<script>
  import { createEventDispatcher, afterUpdate } from 'svelte'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let selectedServiceCode = null

  let iconElement
  const dispatch = createEventDispatcher()

  afterUpdate(() => {
    if (selectedServiceCode) {
      const selectedServiceColor = $preferedServices.find(
        preferedService => preferedService.code === selectedServiceCode
      ).color
  
      iconElement.style.setProperty('--selected-service-color', selectedServiceColor)
    }
  })

  function onSelectService(code) {
    dispatch('selectedService', code)
  }

  function onDeletePreferedService(code) {
    $preferedServices = $preferedServices.filter(preferedService => preferedService.code !== code)
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  {#if selectedServiceCode}
    <i bind:this={iconElement} class="material-icons-outlined">spa</i>
  {/if}
  {#each $preferedServices as preferedService (preferedService.code)}
    <li class="mdc-touch-target-wrapper" on:click={() => onSelectService(preferedService.code)}>
      <Chip className="{selectedServiceCode ? 'prefered-service-chip' : ''}"
        title="Sélectionner le service {`"${getServiceLightLabel(preferedService.code)}"`}"
        color="{preferedService.color}" selected={preferedService.code === selectedServiceCode}
        trailingIcon={selectedServiceCode ? null : 'delete'}
        on:trailingIconClick={() => onDeletePreferedService(preferedService.code)} touchWrapper>
        {getServiceLightLabel(preferedService.code)}
      </Chip>
    </li>
  {/each}
</ul>

<style src="PreferedServiceList.scss"></style>
