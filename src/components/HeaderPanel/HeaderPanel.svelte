<script>
  import { loading, user } from '../../js/store'
  import Button from '../Button/Button.svelte'
  import LinearProgress from '../LinearProgress/LinearProgress.svelte'
  import TopAppBar from '../TopAppBar/TopAppBar.svelte'
  import UserPanel from '../UserPanel/UserPanel.svelte'

  let userPanel

  function onOpenUserPanel() {
    userPanel.openPanel()
  }
</script>

<UserPanel bind:this={userPanel} />

<header class="header" class:loading={$loading}>
  <TopAppBar>
    <slot></slot>
  </TopAppBar>
  <LinearProgress intermediate />
  <Button icon="account_circle" title="Accéder à mon profil de facturation"
    on:click={onOpenUserPanel}>
    {$user.author.name}
  </Button>
</header>

<style src='HeaderPanel.scss'></style>
