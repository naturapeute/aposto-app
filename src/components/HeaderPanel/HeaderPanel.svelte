<script>
  import { author, loading } from '../../js/store'
  import Button from '../Button/Button.svelte'
  import LinearProgress from '../LinearProgress/LinearProgress.svelte'
  import TopAppBar from '../TopAppBar/TopAppBar.svelte'
  import UserPanel from '../UserPanel/UserPanel.svelte'

  let userPanelOpen = false

  function onToggleUserPanel() {
    userPanelOpen = !userPanelOpen
  }
</script>

<UserPanel bind:open={userPanelOpen} />

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
