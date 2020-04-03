<script>
  import { createEventDispatcher } from 'svelte'

  export let title = '' // eslint-disable-line prefer-const
  export let type = 'button' // eslint-disable-line prefer-const

  const dispatch = createEventDispatcher()

  const onClick = e => {
    dispatch('click', e)
  }
</script>

<button class="mdc-icon-button material-icons" {type} {title} on:click={onClick}><slot></slot></button>
