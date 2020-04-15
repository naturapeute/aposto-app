<script>
  import { afterUpdate } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { getServiceLightLabel } from '../../js/utils'
  import { preferedServices } from '../../js/store'
  import Chip from '../Chip/Chip.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Select from '../Select/Select.svelte'

  export let services

  const serviceEdits = services.map(e => ({ ...e }))

  $: serviceEditModes = services.map(_ => false)

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

      serviceListItem.style.setProperty(`--service-${i}-height`, `${serviceHeights[i]}px`)
      serviceListItem.style.setProperty(`--service-${i}-color`, service.color)
    })
  })

  function fade(node) {
    const mt = parseFloat(getComputedStyle(node).marginTop)
    const h = parseFloat(getComputedStyle(node).height)
    const o = +getComputedStyle(node).opacity

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

  const onEditService = (i) => {
    serviceEditModes[i] = true
  }
</script>

<ul class="therapy-description">
  {#each [...services].reverse() as service, i (service.code)}
    <li id="service-{services.length - 1 - i}" class="service"
      class:edit-mode={serviceEditModes[services.length - 1 - i]}>
      <div class="service-timeline">
        <span>{service.duration}'</span>
      </div>
      <div class="service-label-container">
        <Chip className="service-label" trailingIcon="edit" color="{service.color}"
        on:click={() => onEditService(services.length - 1 - i)}>
          {getServiceLightLabel(service.code)}
        </Chip>
        {#if serviceEditModes[services.length - 1 - i]}
          <form class="aposto-form" transition:fade>
            <Select bind:value={serviceEdits[services.length - 1 - i].code}
              fieldId={`service-code-select-${services.length - 1 - i}`}
              options={$preferedServices.map(preferedService =>
                ({ value: preferedService.code, label: getServiceLightLabel(preferedService.code) })
              )} outlined>
              Thérapie
            </Select>
            <TextField bind:value={serviceEdits[services.length - 1 - i].duration}
              fieldId={`service-duration-input-${services.length - 1 - i}`}
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
