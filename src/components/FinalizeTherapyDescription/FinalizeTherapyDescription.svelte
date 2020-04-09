<script>
  import { afterUpdate } from 'svelte'
  import { getServiceLightLabel } from '../../js/utils'

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
      <div class="mdc-chip service-label">
        <div class="mdc-chip__ripple"></div>
        <span role="gridcell">
          <span tabindex="0" class="mdc-chip__primary-action">
            <span class="mdc-chip__text">
              {getServiceLightLabel(service.code)}
              <i class="material-icons-round edit-icon">edit</i>
            </span>
          </span>
        </span>
      </div>
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
