<script context="module">
  let expansionPanelCounter = 0
</script>

<script>
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'

  export let openned = false

  const expansionPanelId = expansionPanelCounter++
  const dispatch = createEventDispatcher()

  function onToggle() {
    openned = !openned

    if (openned)
      dispatch('open', expansionPanelId)
  }
</script>

<li id="expansion-panel-{expansionPanelId}" class="expansion-panel" class:openned>
  <div class="expansion-panel-summary" on:click={onToggle}>
    <slot name="summary"></slot>
  </div>
  {#if openned}
  <div class="expansion-panel-content" transition:slide>
    <slot name="content"></slot>
  </div>
  {/if}
</li>

<style src="ExpansionPanel.scss"></style>
