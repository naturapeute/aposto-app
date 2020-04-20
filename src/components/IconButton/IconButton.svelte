<script>
  export let title
  export let type = 'button'
  export let fab = false
  export let disabled = false
  export let fabLabel = ''
  export let className = ''
</script>

{#if !fab}
  <button class="mdc-icon-button material-icons-outlined {className}" {type} {title} on:click
    {disabled}>
    <slot></slot>
  </button>
{:else}
  <button class="mdc-fab {className}" aria-label={fabLabel} {title} {disabled}>
    <div class="mdc-fab__ripple"></div>
    <span class="mdc-fab__icon material-icons-outlined">
      <slot></slot>
    </span>
  </button>
{/if}
