<script>
  import UserPanel from '../UserPanel/UserPanel.svelte'
  import Button from '../Button/Button.svelte'

  export let author
  export let therapist

  let userPanelOpenned = false // eslint-disable-line no-unused-vars

  const onToggleUserPanel = () => {
    userPanelOpenned = !userPanelOpenned
  }
</script>

<UserPanel openned={userPanelOpenned} {author} {therapist} on:closeUserPanel={onToggleUserPanel} on:updateUser />

<header>
  <Button icon="account_circle" title="Accéder à mon profil de facturation" on:click={onToggleUserPanel}>
    {author.name}
  </Button>
</header>

<style src='HeaderPanel.scss'></style>
