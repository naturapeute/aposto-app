<script>
  import { author } from '../../js/store'
  import UserPanel from '../UserPanel/UserPanel.svelte'
  import Button from '../Button/Button.svelte'

  let userPanelOpenned = false

  const onToggleUserPanel = () => {
    userPanelOpenned = !userPanelOpenned
  }
</script>

<UserPanel openned={userPanelOpenned} on:closeUserPanel={onToggleUserPanel} />

<header class="header">
  <div class="mdc-top-app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <span class="mdc-top-app-bar__title">
          <slot></slot>
        </span>
      </section>
    </div>
  </div>
  <Button icon="account_circle" title="Accéder à mon profil de facturation"
    on:click={onToggleUserPanel}>
    {$author.name}
  </Button>
</header>

<style src='HeaderPanel.scss'></style>
