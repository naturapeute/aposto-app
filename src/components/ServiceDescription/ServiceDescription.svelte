<script>
  import { createEventDispatcher, onMount, afterUpdate } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'
  import Button from '../Button/Button.svelte'
  import PreferedServiceList from '../PreferedServiceList/PreferedServiceList.svelte'
  import TextField from '../TextField/TextField.svelte'

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
    window.addEventListener('click', closeOnClickOut)
  })

  afterUpdate(() => {
    if (!editMode)
      serviceElement.style.setProperty('--service-height', `${serviceHeight}px`)

    serviceElement.style.setProperty('--service-color', service.color)
  })

  function closeOnClickOut(e) {
    if (!editMode) return

    if (!e.target.closest('.service-label-container') && !e.target.closest('.service-add') &&
      serviceFormElement && !serviceFormElement.contains(e.target))
      onCloseEditService()
  }

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
    // TODO : Check it is updating

    service.code = e.detail
    service.color = $preferedServices.find(
      preferedService => preferedService.code === e.detail
    ).color
  }

  function fade(node) {
    const mt = parseFloat(getComputedStyle(node).marginTop)
    const h = parseFloat(getComputedStyle(node).height)
    const o = +getComputedStyle(node).opacity

    serviceElement.style.setProperty(
      '--service-height',
      `${parseFloat(getComputedStyle(node).height) + 2 * 16}px`
    )

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
</script>

<li bind:this={serviceElement} class="service">
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
        <Button className="service-delete" title="Supprimer la thérapie {`"
          ${getServiceLightLabel(service.code)}"`}" on:click={onDeleteService}>
          Supprimer
        </Button>
      </div>
    {:else}
      <form bind:this={serviceFormElement} class="aposto-form" transition:fade
        on:submit|preventDefault={onCloseEditService}>
        <PreferedServiceList selectedServiceCode="{service.code}"
          on:selectedService={onSelectedService} />
        <TextField bind:value={service.duration} fieldId="service-duration-input" type="number"
          outlined>
          Durée
        </TextField>
      </form>
    {/if}
  </div>
</li>

<style src="ServiceDescription.scss"></style>
