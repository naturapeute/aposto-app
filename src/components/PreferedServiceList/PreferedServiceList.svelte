<script>
  import { createEventDispatcher } from 'svelte'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let selectedServiceCode

  const dispatch = createEventDispatcher()

  const onChipClick = (code) => {
    dispatch('selectedService', code)
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  {#each $preferedServices as preferedService (preferedService.code)}
    <li class="mdc-touch-target-wrapper" on:click={() => onChipClick(preferedService.code)}>
      <Chip leadingIcon="spa" color="{preferedService.color}"
        selected={preferedService.code === selectedServiceCode} touchWrapper>
        {getServiceLightLabel(preferedService.code)}
      </Chip>
    </li>
  {/each}
  </ul>
