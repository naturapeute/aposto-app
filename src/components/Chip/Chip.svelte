<script>
  export let touchWrapper = false
  export let selected = false
  export let title
  export let leadingIcon = ''
  export let trailingIcon = ''
  export let color = ''
  export let className = ''

  let element

  $: if (element && color) element.style.setProperty('--chip-color', color)
</script>

<div bind:this={element} class="mdc-chip {className}" class:mdc-chip--touch={touchWrapper}
  class:mdc-chip--selected={selected} class:colored={color} {title} on:click>
  <div class="mdc-chip__ripple"></div>
  {#if leadingIcon}
    <i class="material-icons-outlined mdc-chip__icon mdc-chip__icon--leading">
      {leadingIcon}
    </i>
  {/if}
  <span class="chip-label" role="gridcell">
    <span tabindex="0" class="mdc-chip__primary-action">
      <span class="mdc-chip__text">
        <slot></slot>
      </span>
    </span>
  </span>
  {#if trailingIcon}
    <span role="gridcell">
      <i class="material-icons-outlined mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1"
        role="button">
        {trailingIcon}
      </i>
    </span>
  {/if}
</div>

<style src="Chip.scss"></style>
