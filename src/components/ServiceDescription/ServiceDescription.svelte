<script>
  import { createEventDispatcher } from 'svelte'
  import { cubicOut } from 'svelte/easing'

  import { user } from '../../js/store'
  import { growShrink } from '../../js/transitions'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'
  import DurationList from '../DurationList/DurationList.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import PreferredServiceList from '../PreferredServiceList/PreferredServiceList.svelte'

  export let service
  export let serviceEditModeId
  export let totalDuration

  let serviceElement
  let serviceFormElement
  let serviceHeight
  const dispatch = createEventDispatcher()

  $: editMode = service.id === serviceEditModeId
  $: if (!editMode) {
    serviceHeight = (20 * 12) * (service.duration / totalDuration) > 36
      ? (20 * 12) * (service.duration / totalDuration)
      : 36
  }

  function onMaybeClickOut(e) {
    if (editMode && !e.target.closest('.service-label-container') &&
      !e.target.closest('.service-add') && serviceFormElement &&
      !serviceFormElement.contains(e.target))
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
    service.code = e.detail
    service.color = $user.preferredServices.find(
      preferredService => preferredService.code === e.detail
    ).color
  }

  function fade(node) {
    const style = getComputedStyle(node)
    const mt = parseFloat(style.marginTop)
    const h = parseFloat(style.height)
    const o = +style.opacity

    serviceHeight = h + 2 * 16
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
</script>

<svelte:window on:click={onMaybeClickOut} on:touchstart={onMaybeClickOut} />

<li bind:this={serviceElement} class="service"
  style="--service-color: {service.color}; --service-height: {serviceHeight}px;"
  transition:growShrink>
  <div class="service-timeline">
    <span>{service.duration}'</span>
  </div>
  <div class="service-control-container" class:edit-mode={editMode}>
    {#if !editMode}
      <div class="service-label-container">
        <Chip className="service-label"
          title="Éditer la thérapie {`"${getServiceLightLabel(service.code)}"`}" leadingIcon="spa"
          trailingIcon="edit" color={service.color} on:click={onEditService}>
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
        <PreferredServiceList selectedServiceCode={service.code}
          on:selectedService={onSelectedService} />
        <DurationList bind:selectedServiceDuration={service.duration}
          selectedServiceColor={service.color} />
      </form>
    {/if}
  </div>
</li>

<style src="ServiceDescription.scss"></style>
