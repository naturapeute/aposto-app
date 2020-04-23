<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { MDCTextField } from '@material/textfield'

  export let fieldId
  export let value = ''
  export let type = 'text'
  export let required = false
  export let outlined = false
  export let trailingIcon = null
  export let noAutoComplete = false
  export let placeholder = ''

  let element
  let textField
  const dispatch = createEventDispatcher()

  onMount(() => {
    textField = new MDCTextField(element)
    dispatch('mount', element)

    if (type === 'date') {
      if (navigator.userAgent.includes('Chrome') && navigator.vendor.includes('Google Inc'))
        trailingIcon = ''
      else
        trailingIcon = 'event'
    }
  })

  onDestroy(() => {
    if (textField) textField.destroy()
  })

  // NOTE : Credits to Rich Harris (https://stackoverflow.com/a/57393751)
  function onInput(e) {
    value = type.match(/^(number|range)$/)
      ? +e.target.value
      : e.target.value
  }

  function onTrailingIconClick() {
    if (type === 'date')
      element.click()
    else
      dispatch('trailingIconClick')
  }
</script>

<label bind:this={element} class="mdc-text-field" class:mdc-text-field--outlined="{outlined}"
  class:mdc-text-field--with-trailing-icon="{trailingIcon}">
  {#if !outlined}
    <div class="mdc-text-field__ripple"></div>
  {/if}
  <input {value} {type} class="mdc-text-field__input" id={fieldId} {placeholder} name={fieldId}
    aria-labelledby={fieldId} on:input={onInput} {required}
    autocomplete="{noAutoComplete ? 'off' : ''}">
  {#if trailingIcon}
    <i class="material-icons-outlined mdc-text-field__icon mdc-text-field__icon--trailing"
      tabindex="0" role="button" on:click={onTrailingIconClick}>
      {trailingIcon}
    </i>
  {/if}
  {#if outlined}
    <div class="mdc-notched-outline">
      <div class="mdc-notched-outline__leading"></div>
      <div class="mdc-notched-outline__notch">
        <span class="mdc-floating-label" id={fieldId}>
          <slot></slot>
        </span>
      </div>
      <div class="mdc-notched-outline__trailing"></div>
    </div>
  {:else}
    <span class="mdc-floating-label" id={fieldId}>
      <slot></slot>
    </span>
    <div class="mdc-line-ripple"></div>
  {/if}
</label>

<style src="TextField.scss"></style>
