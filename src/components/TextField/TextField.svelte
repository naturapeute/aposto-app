<script>
  import { MDCTextField } from '@material/textfield'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'

  export let fieldId
  export let value = ''
  export let type = 'text'
  export let required = false
  export let trailingIcon = null
  export let noAutoComplete = false

  let element
  let textField
  const dispatch = createEventDispatcher()

  onMount(() => {
    textField = new MDCTextField(element)
    dispatch('mount', element)
  })

  onDestroy(() => {
    if (textField) textField.destroy()
  })

  // NOTE : Credits to Rich Harris (https://stackoverflow.com/a/57393751)
  const onInput = e => {
    value = type.match(/^(number|range)$/)
      ? +e.target.value
      : e.target.value
  }

  const onTrailingIconClick = () => {
    dispatch('trailingIconClick')
  }
</script>

<label bind:this={element} class="mdc-text-field mdc-text-field--outlined"
  class:mdc-text-field--with-trailing-icon="{trailingIcon}">
  <input {value} {type} class="mdc-text-field__input" name={fieldId} aria-labelledby={fieldId}
    on:input={onInput} {required}  autocomplete="{noAutoComplete ? 'off' : ''}">
  {#if trailingIcon}
    <i class="material-icons-round mdc-text-field__icon mdc-text-field__icon--trailing"
      tabindex="0" role="button" on:click={onTrailingIconClick}>
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
