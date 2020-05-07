<script>
  import { slide } from 'svelte/transition'

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

  $: $selectedServices.map(service => {
    if (service.id === undefined)
      service.id = serviceIdCounter++

    const matchingPreferredService = $user.preferredServices.find(
      preferredService => service.code === preferredService.code
    )

    if (!matchingPreferredService) {
      service.code = $user.preferredServices[0].code
      service.color = $user.preferredServices[0].color
    }

    return service
  })

  function onTotalDurationSelected() {
    if (totalDuration.hasReduced())
      $selectedServices = []

    totalDurationEditMode = false
  }

  function onEditTotalDuration() {
    totalDurationEditMode = true
  }

  function onAddService() {
    $selectedServices.push({
      id: serviceIdCounter++,
      code: $user.preferredServices[0].code,
      duration: remainingDuration || 5,
      color: $user.preferredServices[0].color
    })

    serviceEditModeId = serviceIdCounter - 1
  }

  function onDeleteService(e) {
    $selectedServices = $selectedServices.reduce((newSelectedServices, service) => {
      if (service.id === e.detail) return newSelectedServices

      return [...newSelectedServices, service]
    }, [])

    serviceEditModeId = -1
  }
</script>

<div class="finalize-p" class:total-duration={$totalDuration}>
  <i class="material-icons-outlined">schedule</i>
  {#if !$totalDuration || totalDurationEditMode}
    <form class="aposto-form" on:submit|preventDefault in:slide>
      <DurationList bind:selectedDuration={$totalDuration} selectedServiceColor="#68b246" {durations}
        on:durationSelected={onTotalDurationSelected} noIcon />
    </form>
  {:else}
    <strong class="typography--button-inline">
      {getDurationLabel($totalDuration)}
    </strong>
    <IconButton title="Modifier la durée totale de la séance" on:click={onEditTotalDuration}>
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
