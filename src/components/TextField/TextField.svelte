<script>
  import { MDCTextField } from '@material/textfield'
  import { onMount, onDestroy } from 'svelte'

  export let fieldId
  export let value = '' // eslint-disable-line prefer-const
  export let type = 'text' // eslint-disable-line prefer-const

  let textField
  let thisMDCTextField

  onMount(() => {
    thisMDCTextField = new MDCTextField(textField)
  })

  onDestroy(() => {
    if (thisMDCTextField) thisMDCTextField.destroy()
  })

  // NOTE : Credits to Rich Harris (https://stackoverflow.com/a/57393751)
  const onInput = e => {
    value = type.match(/^(number|range)$/)
      ? +e.target.value
      : e.target.value
  }
</script>

<label bind:this={textField} class="mdc-text-field mdc-text-field--outlined">
  <input {value} {type} class="mdc-text-field__input" aria-labelledby={fieldId} on:input={onInput}>
  <div class="mdc-notched-outline">
    <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch">
      <span class="mdc-floating-label" id={fieldId}>
        <slot></slot>
      </span>
    </div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
</label>

<style src="./TextField.scss"></style>
