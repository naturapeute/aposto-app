<script>
  import { selectedServices, totalDuration, user } from '../../js/store'
  import { getDurationLabel, range } from '../../js/utils'
  import DurationList from '../DurationList/DurationList.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import RemainingDurationService from '../RemainingDurationService/RemainingDurationService.svelte'
  import ServiceDescription from '../ServiceDescription/ServiceDescription.svelte'

  const durations = [...range(30, 60, 5), 75, 90, 105, 120]
  let totalDurationEditMode = true
  let serviceIdCounter = 0
  let serviceEditModeId = -1

  $: usedDuration = $selectedServices.reduce((total, service) => total + service.duration, 0)
  $: remainingDuration = $totalDuration - usedDuration
  $: $selectedServices = replaceDeletedPreferredServices($selectedServices, $user.preferredServices)

  function replaceDeletedPreferredServices(selectedServices, preferredServices) {
    return selectedServices.filter(service => preferredServices.find(
      preferredService => service.code === preferredService.code
    ))
  }

  function setDefaultTherapy() {
    // NOTE : Remaining duration has not been updated yet, so we use total duration.

    if ($user.preferredServices.length === 1) {
      addService(
        serviceIdCounter++,
        $user.preferredServices[0].code,
        $totalDuration,
        $user.preferredServices[0].color
      )
    } else {
      addService(
        serviceIdCounter++,
        $user.preferredServices[0].code,
        5,
        $user.preferredServices[0].color
      )
      addService(
        serviceIdCounter++,
        $user.preferredServices[1].code,
        $totalDuration - 5,
        $user.preferredServices[1].color
      )
    }
  }

  function addService(id, code, duration, color) {
    $selectedServices.push({ id, code, duration, color })
    serviceEditModeId = serviceIdCounter - 1
  }

  function onMaybeClickOutTotalDuration(e) {
    if (totalDurationEditMode && !e.target.closest('.total-duration') &&
      !e.target.classList.contains('edit-total-duration'))
      totalDurationEditMode = false
  }

  function onTotalDurationSelected() {
    if (totalDuration.hasReduced())
      $selectedServices = []

    totalDurationEditMode = false

    if (!$selectedServices.length)
      setDefaultTherapy()
  }

  function onEditTotalDuration() {
    totalDurationEditMode = true
  }

  function onAddService() {
    addService(
      serviceIdCounter++,
      $user.preferredServices[0].code,
      remainingDuration || 5,
      $user.preferredServices[0].color
    )
  }

  function onDeleteService(e) {
    $selectedServices = $selectedServices.reduce((newSelectedServices, service) => {
      if (service.id === e.detail) return newSelectedServices

      return [...newSelectedServices, service]
    }, [])

    serviceEditModeId = -1
  }
</script>

<svelte:window on:click={onMaybeClickOutTotalDuration} on:touchstart={onMaybeClickOutTotalDuration} />

{#if !$totalDuration || totalDurationEditMode}
  <h2 class="mdc-typography--subtitle1">
    Combien de temps a duré votre séance ?
  </h2>
{/if}
<div class="finalize-p" class:total-duration={$totalDuration}>
  <i class="material-icons-outlined">schedule</i>
  {#if !$totalDuration || totalDurationEditMode}
    <form class="aposto-form total-duration-form" on:submit|preventDefault>
      <DurationList bind:selectedDuration={$totalDuration} selectedServiceColor="#68b246" {durations}
        on:durationSelected={onTotalDurationSelected} noIcon />
    </form>
  {:else}
    <strong class="typography--button-inline">
      {getDurationLabel($totalDuration)}
    </strong>
    <IconButton className="edit-total-duration" title="Modifier la durée totale de la séance" on:click={onEditTotalDuration}>
      edit
    </IconButton>
  {/if}
</div>
<ul class="therapy-description">
  {#if remainingDuration}
    <RemainingDurationService {remainingDuration} on:addService={onAddService} />
  {/if}
  {#each [...$selectedServices].reverse() as service, i (service.id)}
    <ServiceDescription bind:service bind:serviceEditModeId maxDuration={remainingDuration}
      on:deleteService={onDeleteService} />
  {/each}
</ul>

<style src="FinalizeTherapyDescription.scss"></style>
