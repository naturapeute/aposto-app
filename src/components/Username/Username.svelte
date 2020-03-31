<script>
  import { createEventDispatcher } from 'svelte'
  import Button from '../Button/Button.svelte'

  export let username

  const dispatch = createEventDispatcher()

  const onOpenUserPanel = () => {
    dispatch('openUserPanel', {})
  }
</script>

<Button icon="account_circle" on:click={onOpenUserPanel}>{username}</Button>

<style src="./Username.scss"></style>
