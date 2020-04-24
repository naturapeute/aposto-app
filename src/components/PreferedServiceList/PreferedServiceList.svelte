<script>
  import { createEventDispatcher, afterUpdate } from 'svelte'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let selectedServiceCode = null
  export let addPreferedServiceMode = false

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

  function onAddService() {
    addPreferedServiceMode = true
    dispatch('addService')
  }
</script>

<ul class="mdc-chip-set" class:mdc-chip-set--choice={selectedServiceCode} role="grid">
  {#if selectedServiceCode}
    <i bind:this={iconElement} class="material-icons-outlined">spa</i>
  {/if}
  {#each $preferedServices as preferedService (preferedService.code)}
    <li class="mdc-touch-target-wrapper" on:click={() => onSelectService(preferedService.code)}>
      <Chip className="{selectedServiceCode ? 'prefered-service-chip' : ''}"
        title="Sélectionner la thérapie {`"${getServiceLightLabel(preferedService.code)}"`}"
        color="{preferedService.color}" selected={preferedService.code === selectedServiceCode}
        trailingIcon={selectedServiceCode ? null : 'delete'}
        on:trailingIconClick={() => onDeletePreferedService(preferedService.code)} touchWrapper>
        {getServiceLightLabel(preferedService.code)}
      </Chip>
    </li>
  {/each}
  {#if !addPreferedServiceMode && !selectedServiceCode && $preferedServices.length < 10}
    <li class="mdc-touch-target-wrapper" on:click={onAddService}>
      <Chip title="Ajouter une thérapie" leadingIcon="add" touchWrapper>
        Ajouter une thérapie
      </Chip>
    </li>
  {/if}
</ul>

<style src="PreferedServiceList.scss"></style>
