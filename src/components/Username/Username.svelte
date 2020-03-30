<script>
  import { createEventDispatcher } from 'svelte'
  import Button from '../Button/Button.svelte'

  export let username

  const dispatch = createEventDispatcher()

  function onOpenUserPannel() {
    dispatch('openUserPannel', {})
  }
</script>

<Button icon="account_circle" on:click={onOpenUserPannel}>{username}</Button>

<style src="./Username.scss"></style>
