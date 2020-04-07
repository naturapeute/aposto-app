<script>
  /* eslint-disable prefer-const */
  export let raised = false
  export let unelevated = false
  export let outlined = false
  export let icon = null
  export let type = 'button'
  export let title = ''
  export let navigation = false
  /* eslint-enable prefer-const */
</script>

<button
  class="mdc-button"
  class:mdc-button--raised="{raised}"
  class:mdc-button--unelevated="{unelevated}"
  class:mdc-button--outlined="{outlined}"
  {title}
  on:click
  {type}>
  <div class="mdc-button__ripple"></div>
  {#if icon}
    <i class="material-icons-round mdc-button__icon" class:mdc-top-app-bar__navigation-icon="{navigation}"
      aria-hidden="true">
      {icon}
    </i>
  {/if}
  <span class="mdc-button__label" class:mdc-top-app-bar__title="{navigation}">
    <slot></slot>
  </span>
</button>
