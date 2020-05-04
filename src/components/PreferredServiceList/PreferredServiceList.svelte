<script>
  import { createEventDispatcher, afterUpdate } from 'svelte'

  import { preferredServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let selectedServiceCode = null

  let iconElement
  const dispatch = createEventDispatcher()

  afterUpdate(() => {
    if (selectedServiceCode) {
      const selectedServiceColor = $preferredServices.find(
        preferredService => preferredService.code === selectedServiceCode
      ).color

      iconElement.style.setProperty('--selected-service-color', selectedServiceColor)
    }
  })

  function onSelectService(code) {
    dispatch('selectedService', code)
  }

  function onDeletePreferredService(code) {
    $preferredServices = $preferredServices.filter(preferredService => preferredService.code !== code)
  }
</script>

<ul class="mdc-chip-set" class:mdc-chip-set--choice={selectedServiceCode} role="grid">
  {#if selectedServiceCode}
    <i bind:this={iconElement} class="material-icons-outlined">spa</i>
  {/if}
  {#each $preferredServices as preferredService (preferredService.code)}
    <li class="mdc-touch-target-wrapper" on:click={() => onSelectService(preferredService.code)}>
      <Chip className="{selectedServiceCode ? 'preferred-service-chip' : ''}"
        title="Sélectionner la thérapie {`"${getServiceLightLabel(preferredService.code)}"`}"
        color="{preferredService.color}" selected={preferredService.code === selectedServiceCode}
        trailingIcon={selectedServiceCode ? null : 'delete'}
        on:trailingIconClick={() => onDeletePreferredService(preferredService.code)} touchWrapper>
        {getServiceLightLabel(preferredService.code)}
      </Chip>
    </li>
  {/each}
</ul>

<style src="PreferredServiceList.scss"></style>
