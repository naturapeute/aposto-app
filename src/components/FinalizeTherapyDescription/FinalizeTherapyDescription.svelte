<script>
  import { beforeUpdate } from 'svelte'
  import { preferedServices } from '../../js/store'
  import IconButton from '../IconButton/IconButton.svelte'
  import ServiceDescription from '../ServiceDescription/ServiceDescription.svelte'

  export let services

  let serviceIdCounter = 0
  let serviceEditModeId = -1

  $: totalDuration = services.reduce((total, service) => total + service.duration, 0)
  $: totalDurationHours = Math.floor(totalDuration / 60)
  $: totalDurationMinutes = Math.round(((totalDuration / 60) - totalDurationHours) * 60)

  $: serviceHeights = services.map(service => {
    let serviceHeight = (20 * 12) * (service.duration / totalDuration)

    if (serviceHeight < 36) serviceHeight = 36

    return serviceHeight
  })

  beforeUpdate(() => {
    services.forEach(service => {
      if (service.id === undefined)
        service.id = serviceIdCounter++
    })
  })

  function onAddService() {
    services = [
      ...services,
      {
        id: serviceIdCounter++,
        code: $preferedServices[0].code,
        duration: 5,
        color: $preferedServices[0].color
      }
    ]
    serviceEditModeId = serviceIdCounter - 1
  }

  function onDeleteService(e) {
    services = services.reduce((newServices, service) => {
      if (service.id === e.detail) return newServices

      return [...newServices, service]
    }, [])

    serviceEditModeId = -1
  }
</script>

<ul class="therapy-description">
  {#if services.length < 5}
    <li class="service service-add">
      <div class="service-timeline">
        <IconButton title="Ajouter une nouvelle thérapie" on:click={onAddService}>
          add
        </IconButton>
      </div>
    </li>
  {/if}
  {#each [...services].reverse() as service, i (service.id)}
    <ServiceDescription bind:service bind:serviceEditModeId {totalDuration}
      on:deleteService={onDeleteService} />
  {/each}
</ul>
<p class="finalize-p total-duration">
  <i class="material-icons-round">schedule</i>
  <span class="typography--button-inline no-click-inline">
    {totalDurationHours}h{#if totalDurationMinutes}
      {totalDurationMinutes}
    {/if}
  </span>
</p>

<style src="FinalizeTherapyDescription.scss"></style>
