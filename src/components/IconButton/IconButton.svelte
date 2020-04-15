<script>
  export let title = ''
  export let type = 'button'
  export let fab = false
  export let disabled = false
  export let fabLabel = ''
</script>

{#if !fab}
  <button class="mdc-icon-button material-icons-round" {type} {title} on:click {disabled}>
    <slot></slot>
  </button>
{:else}
  <button class="mdc-fab" aria-label={fabLabel} {disabled}>
    <div class="mdc-fab__ripple"></div>
    <span class="mdc-fab__icon material-icons-round">
      <slot></slot>
    </span>
  </button>
{/if}
