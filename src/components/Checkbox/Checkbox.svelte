<script>
  import { onMount, onDestroy } from 'svelte'
  import { MDCFormField } from '@material/form-field'
  import { MDCCheckbox } from '@material/checkbox'
  import { numbers } from '@material/ripple'

  export let checkboxId
  export let checked = false

  let elementFormField
  let elementCheckbox
  let formField
  let checkbox

  onMount(() => {
    formField = new MDCFormField(elementFormField)
    checkbox = new MDCCheckbox(elementCheckbox)
    formField.input = checkbox

    // FIXME : At this point, `elementFormField` and `elementCheckbox` might not be rendered by the
    // browser. If so happens, the instanciation above conducts to a wrong-size ripple. Indeed, the
    // Material ripple CSS variable are computed during the instanciation and based on the checkbox
    // element (`elementCheckbox`) width and height. As it is not rendered, the width and height are
    // the window width and height and it results in a huge ripple placed away from the checkbox.
    // As a temporary solution, the following lines compute this CSS variables again when focus event
    // happen on the checkbox, as it happens with a rendered checkbox.
    elementCheckbox.querySelector('input').addEventListener('focus', () => {
      const frame = elementCheckbox.getBoundingClientRect()
      const maxDim = Math.max(frame.height, frame.width)
      const initialSize = maxDim * numbers.INITIAL_ORIGIN_SCALE
      const left = Math.round(frame.width / 2 - initialSize / 2)
      const top = Math.round(frame.height / 2 - initialSize / 2)

      elementCheckbox.style.setProperty('--mdc-ripple-fg-size',
        `${initialSize}px`)
      elementCheckbox.style.setProperty('--mdc-ripple-left', `${left}px`)
      elementCheckbox.style.setProperty('--mdc-ripple-top', `${top}px`)
    })
  })

  onDestroy(() => {
    if (formField) formField.destroy()
    if (checkbox) checkbox.destroy()
  })
</script>

<div bind:this={elementFormField} class="mdc-form-field">
  <div bind:this={elementCheckbox} class="mdc-checkbox">
    <input bind:value={checked} type="checkbox" class="mdc-checkbox__native-control"
      id="{checkboxId}" />
    <div class="mdc-checkbox__background">
      <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path" fill="none"
          d="M1.73,12.91 8.1,19.28 22.79,4.59" />
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
    <div class="mdc-checkbox__ripple"></div>
  </div>
  <label for="{checkboxId}">
    <slot></slot>
  </label>
</div>

<style src="Checkbox.scss"></style>
