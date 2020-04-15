<script>
  import { afterUpdate } from 'svelte'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let services

  $: totalDuration = services.reduce((total, service) => total + service.duration, 0)
  $: totalDurationHours = Math.floor(totalDuration / 60)
  $: totalDurationMinutes = Math.round(((totalDuration / 60) - totalDurationHours) * 60)

  afterUpdate(() => {
    services.forEach((service, i) => {
      let serviceHeight = (20 * 12) * (service.duration / totalDuration)

      if (serviceHeight < 36) serviceHeight = 36

      const serviceListItem = document.querySelector(`#service-${i}`)
      serviceListItem.style.height = `${serviceHeight}px`
      serviceListItem.style.setProperty(`--service-${i}-color`, service.color)
    })
  })
</script>

<ul class="therapy-description">
  {#each [...services].reverse() as service, i}
    <li class="service" id="service-{services.length - 1 - i}">
      <div class="service-timeline">
        <span>{service.duration}'</span>
      </div>
      <Chip className="service-label" trailingIcon="edit" color={service.color}>
        {getServiceLightLabel(service.code)}
      </Chip>
    </li>
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
