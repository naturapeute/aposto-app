<script context="module">
  let expansionPanelCounter = 0
</script>

<script>
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'

  export let openned = false

  const expansionPanelId = `expansion-panel-${expansionPanelCounter++}`

  onMount(() => {
    window.addEventListener(
      'ontouchstart' in window ? 'touchstart' : 'click',
      (e) => {
        if (openned && !e.target.closest(`#${expansionPanelId}`))
          openned = false
      })
  })

  function onToggle() {
    openned = !openned
  }
</script>

<li id="{expansionPanelId}" class="expansion-panel" class:openned>
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
