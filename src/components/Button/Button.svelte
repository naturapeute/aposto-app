<script>
  import { createEventDispatcher } from 'svelte'

  export let raised = false // eslint-disable-line prefer-const
  export let unelevated = false // eslint-disable-line prefer-const
  export let outlined = false // eslint-disable-line prefer-const
  export let icon = null // eslint-disable-line prefer-const
  export let type = 'button' // eslint-disable-line prefer-const
  export let title = '' // eslint-disable-line prefer-const

  const dispatch = createEventDispatcher()

  const onClick = e => {
    dispatch('click', e)
  }
</script>

<button
  class="
    mdc-button
    {raised ? 'mdc-button--raised' : ''}
    {unelevated ? 'mdc-button--unelevated' : ''}
    {outlined ? 'mdc-button--outlined' : ''}
  "
  {title}
  on:click={onClick}
  {type}>
  <div class="mdc-button__ripple"></div>
  {#if icon}
    <i class="material-icons mdc-button__icon" aria-hidden="true">{icon}</i>
  {/if}
  <span class="mdc-button__label">
    <slot></slot>
  </span>
</button>
