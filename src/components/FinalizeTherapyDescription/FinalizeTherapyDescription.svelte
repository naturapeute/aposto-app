<script>
  import { selectedServices, user } from '../../js/store'
  import { getDurationLabel } from '../../js/utils'
  import IconButton from '../IconButton/IconButton.svelte'
  import ServiceDescription from '../ServiceDescription/ServiceDescription.svelte'

  let serviceIdCounter = 0
  let serviceEditModeId = -1

  $: totalDuration = $selectedServices.reduce((total, service) => total + service.duration, 0)

  $: serviceHeights = $selectedServices.map(service => {
    let serviceHeight = (20 * 12) * (service.duration / totalDuration)

    if (serviceHeight < 36) serviceHeight = 36

    return serviceHeight
  })

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
      duration: 5,
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

<ul class="therapy-description">
  {#if $selectedServices.length < 5}
    <li class="service service-add">
      <div class="service-timeline">
        <IconButton title="Ajouter une nouvelle thérapie" on:click={onAddService}>
          add
        </IconButton>
      </div>
    </li>
  {/if}
  {#each [...$selectedServices].reverse() as service, i (service.id)}
    <ServiceDescription bind:service bind:serviceEditModeId {totalDuration}
      on:deleteService={onDeleteService} />
  {/each}
</ul>
<p class="finalize-p total-duration">
  <i class="material-icons-outlined">schedule</i>
  <strong class="typography--button-inline">
    {getDurationLabel(totalDuration)}
  </strong>
</p>

<style src="FinalizeTherapyDescription.scss"></style>
