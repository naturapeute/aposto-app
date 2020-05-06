<script>
  import { afterUpdate, createEventDispatcher } from 'svelte'

  import { getDurationLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let selectedDuration
  export let selectedServiceColor
  export let durations
  export let noIcon = false

  let iconElement
  const dispatch = createEventDispatcher()

  afterUpdate(() => {
    if (!noIcon)
      iconElement.style.setProperty('--selected-service-color', selectedServiceColor)
  })

  function onChipClick(duration) {
    selectedDuration = duration
    dispatch('durationSelected')
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  {#if !noIcon}
    <i bind:this={iconElement} class="material-icons-outlined">schedule</i>
  {/if}
  {#each durations as duration (duration)}
    <li class="mdc-touch-target-wrapper" on:click={() => onChipClick(duration)}>
      <Chip className="duration-chip" title="Sélectionner la durée  {`"${getDurationLabel(duration)}"`}"
        color={selectedServiceColor} selected={duration === selectedDuration} touchWrapper>
        {getDurationLabel(duration)}
      </Chip>
    </li>
  {/each}
</ul>

<style src="DurationList.scss"></style>
