<script>
  import { afterUpdate } from 'svelte'
  import { getServiceLightLabel } from '../../js/utils'

  export let services

  $: totalDuration = services.reduce((total, service) => total + service.duration, 0)

  afterUpdate(() => {
    services.forEach((service, i) => {
      let serviceHeight = (20 * 12) * (service.duration / totalDuration)

      if (serviceHeight < 36) serviceHeight = 36

      const serviceListItem = document.querySelector(`#service-${i}`)
      serviceListItem.style.height = `${serviceHeight}px`
      serviceListItem.style.setProperty(`--service-${i}-color`, service.color)
      document.querySelector(`#service-${i} .service-timeline`).style.zIndex = services.length - i
    })
  })
</script>

<ul class="therapy-description">
  {#each services as service, i}
    <li class="service" id="service-{i}">
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
  <li class="service service-total-duration">
    <div class="service-timeline">
      <span>{totalDuration}'</span>
    </div>
  </li>
</ul>

<style src="FinalizeTherapyDescription.scss"></style>
