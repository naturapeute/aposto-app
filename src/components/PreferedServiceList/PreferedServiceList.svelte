<script>
  import { createEventDispatcher } from 'svelte'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let selectedServiceCode

  const dispatch = createEventDispatcher()

  function onChipClick(code) {
    dispatch('selectedService', code)
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  <i class="material-icons-round">spa</i>
  {#each $preferedServices as preferedService (preferedService.code)}
    <li class="mdc-touch-target-wrapper" on:click={() => onChipClick(preferedService.code)}>
      <Chip title="Sélectionner le service {`"${getServiceLightLabel(preferedService.code)}"`}"
        color="{preferedService.color}" selected={preferedService.code === selectedServiceCode}
        touchWrapper>
        {getServiceLightLabel(preferedService.code)}
      </Chip>
    </li>
  {/each}
</ul>

<style src="PreferedServiceList.scss"></style>
