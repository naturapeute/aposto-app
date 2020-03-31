<script>
  import { createEventDispatcher } from 'svelte'

  export let icon

  const dispatch = createEventDispatcher()

  const onClick = e => {
    dispatch('click', e)
  }
</script>

<button class="mdc-icon-button material-icons" on:click={onClick}>{icon}</button>
