<script>
  import { createEventDispatcher } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'

  import { remainingDuration, totalDuration, user } from '../../js/store'
  import { customFade, growShrink } from '../../js/transitions'
  import { range, getServiceHeight, getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'
  import DurationList from '../DurationList/DurationList.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import PreferredServiceList from '../PreferredServiceList/PreferredServiceList.svelte'

  export let service
  export let serviceEditModeId

  let serviceElement
  let serviceFormElement
  const serviceHeight = tweened(0, {
    duration: 400,
    easing: cubicOut
  })
  const dispatch = createEventDispatcher()

  $: editMode = service.id === serviceEditModeId
  $: if (!editMode)
    serviceHeight.set(getServiceHeight(service.duration, $totalDuration))
  $: durations = [...range(5, $remainingDuration + service.duration, 5)]
  $: serviceLightLabel = getServiceLightLabel(service.code)

  function onMaybeClickOut(e) {
    if (editMode && !e.target.closest('.service-label-container') &&
      !e.target.closest('.total-duration-form') && serviceFormElement &&
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

  function onDurationSelected() {
    onCloseEditService()
  }

  function _customFade(node) {
    serviceHeight.set(parseFloat(getComputedStyle(serviceFormElement).height) + 2 * 16)

    return customFade(node)
  }
</script>

<svelte:window on:click={onMaybeClickOut} on:touchstart={onMaybeClickOut} />

<li bind:this={serviceElement} class="service"
  style="--service-color: {service.color}; --service-height: {$serviceHeight}px;"
  out:growShrink|local>
  <div class="service-timeline">
    <span>{service.duration}'</span>
  </div>
  <div class="service-control-container" class:edit-mode={editMode}>
    {#if !editMode}
      <div class="service-label-container">
        <Chip className="service-label"
          title="Éditer la thérapie {`"${serviceLightLabel}"`}" leadingIcon="spa"
          trailingIcon="edit" color={service.color} on:click={onEditService}>
          {serviceLightLabel}
        </Chip>
        <IconButton className="service-delete"
          title="Supprimer la thérapie {`"${serviceLightLabel}"`}"
          on:click={onDeleteService}>
          delete
        </IconButton>
      </div>
    {:else}
      <form bind:this={serviceFormElement} class="aposto-form" transition:_customFade
        on:submit|preventDefault={onCloseEditService}>
        <PreferredServiceList selectedServiceCode={service.code}
          on:selectedService={onSelectedService} />
        <DurationList bind:selectedDuration={service.duration} selectedServiceColor={service.color}
          {durations} on:durationSelected={onDurationSelected} />
      </form>
    {/if}
  </div>
</li>

<style src="ServiceDescription.scss"></style>
