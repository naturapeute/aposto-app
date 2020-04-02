<script>
  import { MDCTextField } from '@material/textfield'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'

  export let fieldId
  export let value = '' // eslint-disable-line prefer-const
  export let type = 'text' // eslint-disable-line prefer-const
  export let required = false // eslint-disable-line prefer-const
  export let trailingIcon = null // eslint-disable-line prefer-const

  let textField
  let thisMDCTextField
  const dispatch = createEventDispatcher()

  onMount(() => {
    thisMDCTextField = new MDCTextField(textField)
    dispatch('mount', textField)
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

  const onTrailingIconClick = () => {
    dispatch('trailingIconClick', {})
  }
</script>

<label bind:this={textField}
  class="mdc-text-field mdc-text-field--outlined {trailingIcon ? 'mdc-text-field--with-trailing-icon' : ''}">
  <input {value} {type} class="mdc-text-field__input" name={fieldId} aria-labelledby={fieldId} on:input={onInput}
    {required}>
  {#if trailingIcon}
    <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button"
      on:click={onTrailingIconClick}>
      {trailingIcon}
    </i>
  {/if}
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

<style src="TextField.scss"></style>
