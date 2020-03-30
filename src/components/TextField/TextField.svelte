<script>
  import { MDCTextField } from '@material/textfield'
  import { onMount, onDestroy } from 'svelte'

  export let fieldId
  export let label

  let textField
  let thisMDCTextField

  onMount(() => {
    thisMDCTextField = new MDCTextField(textField)
  })

  onDestroy(() => {
    if (thisMDCTextField) thisMDCTextField.destroy()
  })
</script>

<label bind:this={textField} class="mdc-text-field">
  <div class="mdc-text-field__ripple"></div>
  <input class="mdc-text-field__input" type="text" aria-labelledby={fieldId}>
  <span class="mdc-floating-label" id={fieldId}>{label}</span>
  <div class="mdc-line-ripple"></div>
</label>

<style src="./TextField.scss"></style>
