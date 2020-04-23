<script>
  import { createEventDispatcher, afterUpdate } from 'svelte'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let selectedServiceCode

  let iconElement
  const dispatch = createEventDispatcher()

  afterUpdate(() => {
    const selectedServiceColor = $preferedServices.find(
      preferedService => preferedService.code === selectedServiceCode
    ).color

    iconElement.style.setProperty('--selected-service-color', selectedServiceColor)
  })

  function onChipClick(code) {
    dispatch('selectedService', code)
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  <i bind:this={iconElement} class="material-icons-outlined">spa</i>
  {#each $preferedServices as preferedService (preferedService.code)}
    <li class="mdc-touch-target-wrapper" on:click={() => onChipClick(preferedService.code)}>
      <Chip className="prefered-service-chip"
        title="Sélectionner le service {`"${getServiceLightLabel(preferedService.code)}"`}"
        color="{preferedService.color}" selected={preferedService.code === selectedServiceCode}
        touchWrapper>
        {getServiceLightLabel(preferedService.code)}
      </Chip>
    </li>
  {/each}
</ul>

<style src="PreferedServiceList.scss"></style>
