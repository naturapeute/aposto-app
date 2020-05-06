<script>
  import { createEventDispatcher } from 'svelte'

  import { totalDuration } from '../../js/store'
  import { growShrink } from '../../js/transitions'
  import { getServiceHeight } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let remainingDuration

  let serviceRemainingElement
  const dispatch = createEventDispatcher()

  $: remainingHeight = getServiceHeight(remainingDuration, $totalDuration)

  function onAddService() {
    dispatch('addService')
  }
</script>

<li bind:this={serviceRemainingElement} class="service service-remaining"
  style="--service-height: {remainingHeight}px;" transition:growShrink>
  <div class="service-timeline">
  </div>
  <div class="service-control-container">
    <div class="service-label-container">
      <Chip className="service-label" title="Ajouter une thérapie" leadingIcon="spa"
        trailingIcon="add" color="#9e9e9e" on:click={onAddService}>
        Ajouter une thérapie
      </Chip>
    </div>
  </div>
</li>

<style src="RemainingDurationService.scss"></style>
