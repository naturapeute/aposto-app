<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { MDCTextField } from '@material/textfield'

  export let fieldID
  export let value = ''
  export let type = 'text'
  export let required = false
  export let outlined = false
  export let trailingIcon = null
  export let noAutoComplete = false
  export let placeholder = null
  export let className = ''
  export let min = null
  export let pattern = null
  export let title = null
  export let helperText = false

  let element
  let textField
  const dispatch = createEventDispatcher()

  $: helperTextID = `${fieldID}-helper-text`

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

<label bind:this={element} class="mdc-text-field {className}"
  class:mdc-text-field--filled={!outlined} class:mdc-text-field--outlined="{outlined}"
  class:mdc-text-field--with-trailing-icon="{trailingIcon}">
  {#if !outlined}
    <div class="mdc-text-field__ripple"></div>
  {/if}
  <input {value} {type} class="mdc-text-field__input" id={fieldID} {placeholder} name={fieldID}
    aria-labelledby={fieldID} aria-controls="{helperText ? helperTextID : ''}"
    aria-describedby="{helperText ? helperTextID : ''}" {title} on:input={onInput} {min} {pattern}
    {required} autocomplete="{noAutoComplete ? 'off' : ''}">
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
        <span class="mdc-floating-label" id={fieldID}>
          <slot></slot>
        </span>
      </div>
      <div class="mdc-notched-outline__trailing"></div>
    </div>
  {:else}
    <span class="mdc-floating-label" id={fieldID}>
      <slot></slot>
    </span>
    <div class="mdc-line-ripple"></div>
  {/if}
</label>
{#if helperText}
  <div class="mdc-text-field-helper-line">
    <div id="helperTextID" class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
      <slot name="helper-text"></slot>
    </div>
  </div>
{/if}

<style src="TextField.scss"></style>
