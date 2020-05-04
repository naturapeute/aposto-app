<script>
  import { createEventDispatcher, onMount } from 'svelte'

  const dispatch = createEventDispatcher()

  onMount(() => {
    dispatch('mounted')
  })
</script>

<ul class="expansion-panel-set">
  <slot></slot>
</ul>

<style src="ExpansionPanelSet.scss"></style>
