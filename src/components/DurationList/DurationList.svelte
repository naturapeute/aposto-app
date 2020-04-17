<script>
  import { getDurationLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'

  export let selectedServiceDuration

  const durations = [...range(5, 60, 5), 75, 90]

  function range(start, end, step) {
    const length = Math.floor((end - start) / step) + 1

    return Array.from(Array(length), (x, index) => start + index * step)
  }

  function onChipClick(duration) {
    selectedServiceDuration = duration
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  <i class="material-icons-round">schedule</i>
  {#each durations as duration (duration)}
    <li class="mdc-touch-target-wrapper" on:click={() => onChipClick(duration)}>
      <Chip className="duration-chip" title="Sélectionner la durée  {`"${getDurationLabel(duration)}"`}"
        selected={duration === selectedServiceDuration} touchWrapper>
        {getDurationLabel(duration)}
      </Chip>
    </li>
  {/each}
</ul>

<style src="DurationList.scss"></style>
