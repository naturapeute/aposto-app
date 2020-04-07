<script>
  import { afterUpdate } from 'svelte'
  /* eslint-disable no-unused-vars */
  import { services } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  /* eslint-enable no-unused-vars */

  let totalDuration

  /* eslint-disable no-undef */
  $: totalDuration = $services.reduce((total, service) => total + service.duration, 0)
  $: $services.reduce((endTime, service) => {
    service.endTime = endTime + service.duration

    return service.endTime
  }, 0)
  /* eslint-enable no-undef */

  afterUpdate(() => {
    $services.forEach((service, i) => { // eslint-disable-line no-undef
      let serviceHeight = (24 * 12) * (service.duration / totalDuration)

      if (serviceHeight < 24) serviceHeight = 24

      document.querySelector(`#service-timeline-${i}`).style.height = `${serviceHeight}px`
      document.querySelector(`#service-timeline-${i} .service-timeline`).style.backgroundColor =
        service.color
      document.querySelector(`#service-timeline-${i} .service-duration`).style.backgroundColor =
        service.color
      document.querySelector(`#service-timeline-${i} .service-label`).style.color = service.color
      document.querySelector(`#service-timeline-${i} .service-label`).style.border =
        `1px solid ${service.color}`
    })
  })
</script>

<ul class="therapy-description">
  {#each $services as service, i}
    <li id="service-timeline-{i}">
      <div class="service-timeline"></div>
      <div class="service-duration">{service.endTime}</div>
      <div class="mdc-chip service-label">
        <div class="mdc-chip__ripple"></div>
        <span role="gridcell">
          <span tabindex="0" class="mdc-chip__primary-action">
            <span class="mdc-chip__text">{getServiceLightLabel(service.code)}</span>
          </span>
        </span>
      </div>
    </li>
  {/each}
</ul>

<style src="FinalizeTherapyDescription.scss"></style>
