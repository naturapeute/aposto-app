<script>
  import { createEventDispatcher } from 'svelte'

  export let raised = false // eslint-disable-line prefer-const
  export let unelevated = false // eslint-disable-line prefer-const
  export let outlined = false // eslint-disable-line prefer-const
  export let icon

  const dispatch = createEventDispatcher()

  function onClick(event) {
    dispatch('click', event)
  }
</script>

<button
  class="
    mdc-button
    {raised ? 'mdc-button--raised' : ''}
    {unelevated ? 'mdc-button--unelevated' : ''}
    {outlined ? 'mdc-button--outlined' : ''}
  "
  on:click={onClick}>
  <div class="mdc-button__ripple"></div>
  <span class="mdc-button__label">
    <slot></slot>
  </span>
  {#if icon}
    <i class="material-icons mdc-button__icon" aria-hidden="true">{icon}</i>
  {/if}
</button>
