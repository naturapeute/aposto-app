<script>
  import { onMount } from 'svelte'
  import { MDCSelect } from '@material/select'

  export let fieldID
  export let options = [{ value: '', label: '' }]
  export let value = ''
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
    })
  })
</script>

<div bind:this={element} class="mdc-select {className}" class:mdc-select--required={required}>
  <div class="mdc-select__anchor">
    <i class="mdc-select__dropdown-icon"></i>
    <div id={selectedTextID} class="mdc-select__selected-text" role="button" aria-haspopup="listbox"
      aria-labelledby="{labelID} {selectedTextID}" aria-required="{required}"></div>
    <span id={labelID} class="mdc-floating-label">
      <slot></slot>
    </span>
    <div class="mdc-line-ripple"></div>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface select-width" role="listbox">
    <ul class="mdc-list">
      {#each options as option}
        <li class="mdc-list-item" class:mdc-list-item--selected="{option.value === value}"
          data-value={option.value} aria-selected="true" role="option">
          {option.label}
        </li>
      {/each}
    </ul>
  </div>
</div>
