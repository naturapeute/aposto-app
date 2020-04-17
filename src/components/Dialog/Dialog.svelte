<script>
  import { onMount, onDestroy } from 'svelte'
  import { MDCDialog } from '@material/dialog'

  export let dialogId

  export function open() {
    dialog.open()
  }

  export function close() {
    dialog.close()
  }

  let element
  let dialog = {}

  onMount(() => {
    dialog = new MDCDialog(element)
  })

  onDestroy(() => {
    if (dialog) dialog.destroy()
  })
</script>

<div bind:this={element} class="mdc-dialog">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface" role="alertdialog" aria-modal="true"
      aria-labelledby={dialogId} aria-describedby="dialog-content">
      <h2 class="mdc-dialog__title" id={dialogId}>
        <slot name="dialog-title"></slot>
      </h2>
      <div class="mdc-dialog__content" id="dialog-content">
        <slot name="dialog-body"></slot>
      </div>
      <footer class="mdc-dialog__actions">
        <slot name="dialog-footer"></slot>
      </footer>
    </div>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
