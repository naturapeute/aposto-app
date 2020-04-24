<script>
  import { createEventDispatcher } from 'svelte'
  import { author, loading } from '../../js/store'
  import UserPanel from '../UserPanel/UserPanel.svelte'
  import TopAppBar from '../TopAppBar/TopAppBar.svelte'
  import Button from '../Button/Button.svelte'
  import LinearProgress from '../LinearProgress/LinearProgress.svelte'

  let userPanelOpenned = false
  const dispatch = createEventDispatcher()

  function onToggleUserPanel() {
    userPanelOpenned = !userPanelOpenned

    if (!userPanelOpenned)
      dispatch('userPannelClosed')
  }
</script>

<UserPanel openned={userPanelOpenned} on:closeUserPanel={onToggleUserPanel} />

<header class="header" class:loading={$loading}>
  <TopAppBar>
    <slot></slot>
  </TopAppBar>
  <LinearProgress intermediate />
  <Button icon="account_circle" title="Accéder à mon profil de facturation"
    on:click={onToggleUserPanel}>
    {$author.name}
  </Button>
</header>

<style src='HeaderPanel.scss'></style>
