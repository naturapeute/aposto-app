<script>
  import { slide } from 'svelte/transition'

  import { selectedServices, user } from '../../js/store'
  import { growShrink } from '../../js/transitions'
  import IconButton from '../IconButton/IconButton.svelte'
  import RemainingDurationService from '../RemainingDurationService/RemainingDurationService.svelte'
  import ServiceDescription from '../ServiceDescription/ServiceDescription.svelte'
  import TextField from '../TextField/TextField.svelte'

  let totalDuration = 0
  let serviceIdCounter = 0
  let serviceEditModeId = -1

  $: usedDuration = $selectedServices.reduce((total, service) => total + service.duration, 0)
  $: if (usedDuration > totalDuration) totalDuration = usedDuration
  $: remainingDuration = totalDuration > usedDuration ? totalDuration - usedDuration : 0

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

  function onAddService() {
    $selectedServices.push({
      id: serviceIdCounter++,
      code: $user.preferredServices[0].code,
      duration: remainingDuration,
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

<div class="finalize-p" class:total-duration={remainingDuration || usedDuration}>
  <i class="material-icons-outlined">schedule</i>
  <form class="aposto-form" on:submit|preventDefault transition:slide>
    <TextField type="number" bind:value={totalDuration} fieldID="total-duration"
      className="total-duration-input" min={usedDuration} step="5" outlined noLabel />
  </form>
</div>
<ul class="therapy-description">
  {#if remainingDuration && $selectedServices.length < 5}
    <li class="service service-add" transition:growShrink>
      <div class="service-timeline">
        <IconButton title="Ajouter une nouvelle thérapie" on:click={onAddService}>
          add
        </IconButton>
      </div>
    </li>
  {/if}
  {#if remainingDuration}
    <RemainingDurationService {totalDuration} {remainingDuration} />
  {/if}
  {#each [...$selectedServices].reverse() as service, i (service.id)}
    <ServiceDescription bind:service bind:serviceEditModeId {totalDuration}
      on:deleteService={onDeleteService} />
  {/each}
</ul>

<style src="FinalizeTherapyDescription.scss"></style>
