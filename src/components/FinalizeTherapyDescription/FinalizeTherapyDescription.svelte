<script>
  import { remainingDuration, selectedServices, user } from '../../js/store'
  import RemainingDurationService from '../RemainingDurationService/RemainingDurationService.svelte'
  import ServiceDescription from '../ServiceDescription/ServiceDescription.svelte'

  let serviceEditModeId = -1

  $: $selectedServices = replaceDeletedPreferredServices($selectedServices, $user.preferredServices)

  function replaceDeletedPreferredServices(selectedServices, preferredServices) {
    return selectedServices.filter(service => preferredServices.find(
      preferredService => service.code === preferredService.code
    ))
  }

  function onAddService() {
    const newId = Date.now()

    selectedServices.addService(
      newId,
      $user.preferredServices[0].code,
      $remainingDuration || 5,
      $user.preferredServices[0].color
    )

    serviceEditModeId = newId
  }

  function onDeleteService(e) {
    selectedServices.deleteService(e.detail)

    serviceEditModeId = -1
  }
</script>

<ul class="therapy-description">
  {#if $remainingDuration}
    <RemainingDurationService on:addService={onAddService} />
  {/if}
  {#each [...$selectedServices].reverse() as service, i (service.id)}
    <ServiceDescription bind:service bind:serviceEditModeId on:deleteService={onDeleteService} />
  {/each}
</ul>

<style src="FinalizeTherapyDescription.scss"></style>
