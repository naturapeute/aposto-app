<script>
  import { MDCSnackbar } from '@material/snackbar'
  import { onDestroy, onMount } from 'svelte'

  export function open() {
    snackbar.open()
  }

  let element
  let snackbar

  onMount(() => {
    snackbar = new MDCSnackbar(element)
  })

  onDestroy(() => {
    if (snackbar) snackbar.destroy()
  })
</script>

<div bind:this={element} class="mdc-snackbar">
  <div class="mdc-snackbar__surface">
    <div class="mdc-snackbar__label" role="status" aria-live="polite">
      <slot name="label"></slot>
    </div>
    <div class="mdc-snackbar__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</div>
