<script>
  import { selectedServices, totalDuration, user } from '../../js/store.js'
  import { getDurationLabel, range } from '../../js/utils.js'
  import DurationList from '../DurationList/DurationList.svelte'
  import IconButton from '../IconButton/IconButton.svelte'

  const durations = [...range(30, 60, 5), 75, 90, 105, 120]
  let totalDurationEditMode = true

  $: if ($totalDuration) onTotalDurationUpdated($totalDuration)

  function onTotalDurationUpdated(_) {
    if (totalDuration.hasReduced())
      $selectedServices = []

    totalDurationEditMode = false

    if (!$selectedServices.length)
      setDefaultTherapy()
  }

  function setDefaultTherapy() {
    selectedServices.addService(
      Date.now(),
      $user.preferredServices[0].code,
      10,
      $user.preferredServices[0].color
    )
  }

  function onMaybeClickOutTotalDuration(e) {
    if (totalDurationEditMode && !e.target.closest('.total-duration') &&
      !e.target.classList.contains('edit-total-duration'))
      totalDurationEditMode = false
  }

  function onEditTotalDuration() {
    totalDurationEditMode = true
  }
</script>

<svelte:window on:click={onMaybeClickOutTotalDuration} on:touchstart={onMaybeClickOutTotalDuration} />


{#if !$totalDuration || totalDurationEditMode}
  <h2 class="mdc-typography--subtitle1">
    Combien de temps a duré votre séance ?
  </h2>
{/if}
<div class="finalize-p" class:total-duration={$totalDuration}>
  <i class="material-icons-outlined">schedule</i>
  {#if !$totalDuration || totalDurationEditMode}
    <form class="aposto-form total-duration-form" on:submit|preventDefault>
      <DurationList bind:selectedDuration={$totalDuration} selectedServiceColor="#68b246" {durations} noIcon />
    </form>
  {:else}
    <strong class="typography--button-inline">
      {getDurationLabel($totalDuration)}
    </strong>
    <IconButton className="edit-total-duration" title="Modifier la durée totale de la séance" on:click={onEditTotalDuration}>
      edit
    </IconButton>
  {/if}
</div>

<style src="FinalizeTotalDuration.scss"></style>
