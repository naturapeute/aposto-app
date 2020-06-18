<script>
  import { MDCSwitch } from '@material/switch'
  import { onMount, onDestroy } from 'svelte'

  export let switchId
  export let checked = false

  let switchControlElement
  let switchControl

  onMount(() => {
    switchControl = new MDCSwitch(switchControlElement)
  })

  onDestroy(() => {
    if (switchControlElement)
      switchControl.destroy()
  })
</script>

<div bind:this={switchControlElement} class="mdc-switch">
  <div class="mdc-switch__track"></div>
  <div class="mdc-switch__thumb-underlay">
    <div class="mdc-switch__thumb"></div>
    <input bind:checked type="checkbox" id={switchId} class="mdc-switch__native-control"
      role="switch" aria-checked="false">
  </div>
</div>
<label class="switch-label" for={switchId}>
  <slot></slot>
</label>

<style src="Switch.scss"></style>
