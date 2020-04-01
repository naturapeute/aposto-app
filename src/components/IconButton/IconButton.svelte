<script>
  import { createEventDispatcher } from 'svelte'

  export let icon
  export let title = '' // eslint-disable-line prefer-const

  const dispatch = createEventDispatcher()

  const onClick = e => {
    dispatch('click', e)
  }
</script>

<button class="mdc-icon-button material-icons" {title} on:click={onClick}>{icon}</button>
