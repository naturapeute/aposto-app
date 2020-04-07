<script>
  import { onMount } from 'svelte'
  import { MDCSelect } from '@material/select'

  export let options = [{ value: '', label: '' }] // eslint-disable-line prefer-const
  export let value = ''

  let select
  let thisMDCSelect

  onMount(() => {
    thisMDCSelect = new MDCSelect(select)

    thisMDCSelect.listen('MDCSelect:change', () => {
      value = thisMDCSelect.value
    })
  })
</script>

<div bind:this={select} class="mdc-select">
  <div class="mdc-select__anchor select-width">
    <i class="mdc-select__dropdown-icon"></i>
    <div class="mdc-select__selected-text"></div>
    <span class="mdc-floating-label">
      <slot></slot>
    </span>
    <div class="mdc-line-ripple"></div>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface select-width">
    <ul class="mdc-list">
      {#each options as option}
        <li class="mdc-list-item" class:mdc-list-item--selected="{option.value === value}"
          data-value={option.value} aria-selected="true">
          {option.label}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style src="Select.scss"></style>
