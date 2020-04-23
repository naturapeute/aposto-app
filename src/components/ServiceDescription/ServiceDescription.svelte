<script>
  import { createEventDispatcher, onMount, afterUpdate } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import PreferedServiceList from '../PreferedServiceList/PreferedServiceList.svelte'
  import DurationList from '../DurationList/DurationList.svelte'

  export let service
  export let serviceEditModeId
  export let totalDuration

  let serviceElement
  let serviceFormElement
  const dispatch = createEventDispatcher()

  $: serviceHeight = (20 * 12) * (service.duration / totalDuration) > 36
    ? (20 * 12) * (service.duration / totalDuration) : 36
  $: editMode = service.id === serviceEditModeId

  onMount(() => {
    window.addEventListener(
      'ontouchstart' in window ? 'touchstart' : 'click',
      (e) => {
        if (editMode && !e.target.closest('.service-label-container') &&
          !e.target.closest('.service-add') && serviceFormElement &&
          !serviceFormElement.contains(e.target))
          onCloseEditService()
      })
  })

  afterUpdate(() => {
    if (!editMode)
      serviceElement.style.setProperty('--service-height', `${serviceHeight}px`)

    serviceElement.style.setProperty('--service-color', service.color)
  })

  function onEditService() {
    serviceEditModeId = service.id
  }

  function onDeleteService() {
    dispatch('deleteService', service.id)
  }

  function onCloseEditService() {
    serviceEditModeId = -1
  }

  function onSelectedService(e) {
    service.code = e.detail
    service.color = $preferedServices.find(
      preferedService => preferedService.code === e.detail
    ).color
  }

  function fade(node) {
    const style = getComputedStyle(node)
    const mt = parseFloat(style.marginTop)
    const h = parseFloat(style.height)
    const o = +style.opacity

    serviceElement.style.setProperty('--service-height', `${h + 2 * 16}px`)

    return {
      duration: 400,
      easing: cubicOut,
      css: t => {
        return `
        opacity: ${t * o};
        margin-top: ${t * mt}px;
        height: ${t * h}px;
      `
      }
    }
  }

  function growShrink(node) {
    const h = parseFloat(getComputedStyle(node).height)

    return {
      duration: 400,
      easing: cubicOut,
      css: t => {
        return `height: ${t * h}px;`
      }
    }
  }
</script>

<li bind:this={serviceElement} class="service" transition:growShrink>
  <div class="service-timeline">
    <span>{service.duration}'</span>
  </div>
  <div class="service-control-container" class:edit-mode={editMode}>
    {#if !editMode}
      <div class="service-label-container">
        <Chip className="service-label"
          title="Éditer la thérapie {`"${getServiceLightLabel(service.code)}"`}" leadingIcon="spa"
          trailingIcon="edit" color="{service.color}" on:click={onEditService}>
          {getServiceLightLabel(service.code)}
        </Chip>
        <IconButton className="service-delete"
          title="Supprimer la thérapie {`"${getServiceLightLabel(service.code)}"`}"
          on:click={onDeleteService}>
          delete
        </IconButton>
      </div>
    {:else}
      <form bind:this={serviceFormElement} class="aposto-form" transition:fade
        on:submit|preventDefault={onCloseEditService}>
        <PreferedServiceList selectedServiceCode="{service.code}"
          on:selectedService={onSelectedService} />
        <DurationList bind:selectedServiceDuration={service.duration}
          selectedServiceColor="{service.color}" />
      </form>
    {/if}
  </div>
</li>

<style src="ServiceDescription.scss"></style>
