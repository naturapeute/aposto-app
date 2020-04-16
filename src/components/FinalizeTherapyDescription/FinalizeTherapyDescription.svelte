<script>
  import { afterUpdate } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'
  import TextField from '../TextField/TextField.svelte'
  import PreferedServiceList from '../PreferedServiceList/PreferedServiceList.svelte'

  export let services

  let serviceEditModeIndex = -1

  $: totalDuration = services.reduce((total, service) => total + service.duration, 0)
  $: totalDurationHours = Math.floor(totalDuration / 60)
  $: totalDurationMinutes = Math.round(((totalDuration / 60) - totalDurationHours) * 60)

  $: serviceHeights = services.map(service => {
    let serviceHeight = (20 * 12) * (service.duration / totalDuration)

    if (serviceHeight < 36) serviceHeight = 36

    return serviceHeight
  })

  afterUpdate(() => {
    services.forEach((service, i) => {
      const serviceListItem = document.querySelector(`#service-${i}`)

      if (i !== serviceEditModeIndex)
        serviceListItem.style.setProperty(`--service-${i}-height`, `${serviceHeights[i]}px`)

      serviceListItem.style.setProperty(`--service-${i}-color`, service.color)
    })
  })

  function fade(node) {
    const mt = parseFloat(getComputedStyle(node).marginTop)
    const h = parseFloat(getComputedStyle(node).height)
    const o = +getComputedStyle(node).opacity

    const index = Number(node.getAttribute('data-index'))

    document.querySelector(`#service-${index}`).style.setProperty(
      `--service-${index}-height`,
      `${parseFloat(getComputedStyle(node).height) + 2 * 16}px`
    )

    return {
      duration: 400,
      easing: cubicOut,
      css: t => {
        return `
        opacity: ${t * o};
        margin-top: ${t * mt}px;
        height: ${t * h}px;
      `
      }
    }
  }

  function servicesReversedIndex(i) {
    return services.length - 1 - i
  }

  const onEditService = (i) => {
    serviceEditModeIndex = i
  }

  const onSelectedService = (e, i) => {
    services[i].code = e.detail
    services[i].color = $preferedServices.find(
      preferedService => preferedService.code === e.detail
    ).color
  }
</script>

<ul class="therapy-description">
  {#each [...services].reverse() as service, i}
    <li id="service-{servicesReversedIndex(i)}" class="service">
      <div class="service-timeline">
        <span>{service.duration}'</span>
      </div>
      <div class="service-label-container">
        {#if servicesReversedIndex(i) !== serviceEditModeIndex}
          <Chip className="service-label" trailingIcon="edit" color="{service.color}"
            on:click={() => onEditService(servicesReversedIndex(i))}>
            {getServiceLightLabel(service.code)}
          </Chip>
        {:else}
          <form class="aposto-form" data-index="{servicesReversedIndex(i)}" transition:fade>
            <PreferedServiceList selectedServiceCode="{service.code}"
              on:selectedService={(e) => onSelectedService(e, servicesReversedIndex(i))} />
            <TextField bind:value={service.duration}
              fieldId={`service-duration-input-${servicesReversedIndex(i)}`}
              type="number" outlined>
              Durée
            </TextField>
          </form>
        {/if}
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
