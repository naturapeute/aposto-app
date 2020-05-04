<script>
  import { MDCSelect } from '@material/select'
  import { onMount } from 'svelte'

  export let fieldID
  export let options = [{ value: '', label: '' }]
  export let value = ''
  export let label = ''
  export let required = false
  export let className = ''

  let element
  let select

  $: labelID = `${fieldID}-label`
  $: selectedTextID = `${fieldID}-selected-text`

  onMount(() => {
    select = new MDCSelect(element)

    select.listen('MDCSelect:change', () => {
      value = select.value
      label = options.find(option => option.value === value).label
    })
  })
</script>

<div bind:this={element} class="mdc-select {className}" class:mdc-select--required={required}>
  <div class="mdc-select__anchor" role="button" aria-haspopup="listbox"
    aria-labelledby="{labelID} {selectedTextID}">
    <div class="mdc-select__ripple"></div>
    <input type="text" disabled readonly id={selectedTextID} class="mdc-select__selected-text"
      value={label} aria-required="{required}">
    <i class="mdc-select__dropdown-icon"></i>
    <span id={labelID} class="mdc-floating-label mdc-floating-label--float-above">
      <slot></slot>
    </span>
    <div class="mdc-line-ripple"></div>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth" role="listbox">
    <ul class="mdc-list">
      {#each options as option}
        <li class="mdc-list-item" class:mdc-list-item--selected="{option.value === value}"
          data-value={option.value} aria-selected="{option.value === value ? 'true' : ''}"
          role="option">
          {option.label}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style src="Select.scss"></style>
