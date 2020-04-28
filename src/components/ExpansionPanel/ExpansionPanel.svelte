<script>
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'

  export let opened = false
  export let expansionPanelId

  const dispatch = createEventDispatcher()

  function onToggle() {
    dispatch('askToggle')
  }
</script>

<li id={expansionPanelId} class="expansion-panel" class:opened>
  <div class="expansion-panel-summary" on:click={onToggle}>
    <slot name="summary"></slot>
  </div>
  {#if opened}
    <div class="expansion-panel-content" transition:slide>
      <slot name="content"></slot>
    </div>
  {/if}
</li>

<style src="ExpansionPanel.scss"></style>
