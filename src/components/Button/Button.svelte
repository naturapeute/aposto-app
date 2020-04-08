<script>
  export let raised = false
  export let unelevated = false
  export let outlined = false
  export let icon = null
  export let type = 'button'
  export let title = ''
</script>

<button class="mdc-button" class:mdc-button--raised="{raised}"
  class:mdc-button--unelevated="{unelevated}" class:mdc-button--outlined="{outlined}" {title}
  on:click {type}>
  <div class="mdc-button__ripple"></div>
  {#if icon}
    <i class="material-icons-round mdc-button__icon" aria-hidden="true">
      {icon}
    </i>
  {/if}
  <span class="mdc-button__label">
    <slot></slot>
  </span>
</button>
