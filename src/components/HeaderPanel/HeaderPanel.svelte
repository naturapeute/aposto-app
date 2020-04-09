<script>
  import { author, loading } from '../../js/store'
  import UserPanel from '../UserPanel/UserPanel.svelte'
  import TopAppBar from '../TopAppBar/TopAppBar.svelte'
  import Button from '../Button/Button.svelte'
  import LinearProgress from '../LinearProgress/LinearProgress.svelte'

  let userPanelOpenned = false

  const onToggleUserPanel = () => {
    userPanelOpenned = !userPanelOpenned
  }
</script>

<UserPanel openned={userPanelOpenned} on:closeUserPanel={onToggleUserPanel} />

<header class="header">
  <TopAppBar><slot></slot></TopAppBar>
  {#if $loading}
    <LinearProgress intermediate />
  {/if}
  <Button icon="account_circle" title="Accéder à mon profil de facturation"
    on:click={onToggleUserPanel}>
    {$author.name}
  </Button>
</header>

<style src='HeaderPanel.scss'></style>
