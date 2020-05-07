<script>
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'

  export let open = false
  export let expansionPanelId

  const dispatch = createEventDispatcher()

  function onToggle() {
    dispatch('askToggle')
  }
</script>

<li id={expansionPanelId} class="expansion-panel" class:open>
  <div class="expansion-panel-summary" on:click={onToggle}>
    <slot name="summary"></slot>
  </div>
  {#if open}
    <div class="expansion-panel-content" transition:slide|local>
      <slot name="content"></slot>
    </div>
  {/if}
</li>

<style src="ExpansionPanel.scss"></style>
