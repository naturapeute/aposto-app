<script>
  import { MDCTextField } from '@material/textfield'
  import { onMount, onDestroy } from 'svelte'

  export let fieldId

  let textField
  let thisMDCTextField

  onMount(() => {
    thisMDCTextField = new MDCTextField(textField)
  })

  onDestroy(() => {
    if (thisMDCTextField) thisMDCTextField.destroy()
  })
</script>

<label bind:this={textField} class="mdc-text-field mdc-text-field--outlined">
  <input type="text" class="mdc-text-field__input" aria-labelledby={fieldId}>
  <div class="mdc-notched-outline">
    <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch">
      <span class="mdc-floating-label" id={fieldId}><slot></slot></span>
    </div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
</label>

<style src="./TextField.scss"></style>
