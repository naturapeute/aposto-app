<script>
  export let thisElement = null
  export let raised = false
  export let unelevated = false
  export let outlined = false
  export let dialog = false
  export let snackbar = false
  export let icon = null
  export let type = 'button'
  export let title
  export let dialogAction = null
  export let dialogInitialFocus = null
  export let className = ''
</script>

<button bind:this={thisElement} class="mdc-button {className}" class:mdc-button--raised="{raised}"
  class:mdc-button--unelevated="{unelevated}" class:mdc-button--outlined="{outlined}"
  class:mdc-dialog__button="{dialog}" class:mdc-snackbar__action="{snackbar}"
  data-mdc-dialog-action="{dialogAction}" data-mdc-dialog-initial-focus="{dialogInitialFocus}"
  {title} {type} on:click>
  <div class="mdc-button__ripple"></div>
  {#if icon}
    <i class="material-icons-outlined mdc-button__icon" aria-hidden="true">
      {icon}
    </i>
  {/if}
  <span class="mdc-button__label">
    <slot></slot>
  </span>
</button>
