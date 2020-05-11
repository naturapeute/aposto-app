<script>
  import { MDCDrawer } from '@material/drawer'
  import { onDestroy, onMount } from 'svelte'

  import { loading, patients, user } from '../../js/store'
  import {
    isAuthorValid,
    isPreferredServicesValid,
    isServicePriceValid,
    isTherapistValid
  } from '../../js/utils'
  import { saveUser } from '../../services/UserService'
  import AuthenticationForm
    from '../AuthenticationForm/AuthenticationForm.svelte'
  import AuthorFormExpansionPanel from '../AuthorFormExpansionPanel/AuthorFormExpansionPanel.svelte'
  import Button from '../Button/Button.svelte'
  import ExpansionPanelSet from '../ExpansionPanelSet/ExpansionPanelSet.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import PreferredServicesFormExpansionPanel
    from '../PreferredServicesFormExpansionPanel/PreferredServicesFormExpansionPanel.svelte'
  import ServicePriceFormExpansionPanel
    from '../ServicePriceFormExpansionPanel/ServicePriceFormExpansionPanel.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import TherapistFormExpansionPanel
    from '../TherapistFormExpansionPanel/TherapistFormExpansionPanel.svelte'

  export let open = false

  let element
  let drawer = {}
  let authenticationMode = true
  const storeSubscriptions = []
  let successUpdateSnackbar
  let successPatchSnackbar
  let failedPatchSnackbar

  const formExpansionPanels = [
    { component: AuthorFormExpansionPanel, id: 'author-form-expansion-panel' },
    { component: TherapistFormExpansionPanel, id: 'therapist-form-expansion-panel' },
    { component: ServicePriceFormExpansionPanel, id: 'service-price-form-expansion-panel' },
    { component: PreferredServicesFormExpansionPanel, id: 'preferred-services-form-expansion-panel' }
  ]

  $: drawer.open = open

  onMount(() => {
    drawer = new MDCDrawer(element)
    // FIXME : We are overriding the Material scrim click handler and Esc key donw as we only want to
    // close the drawer if and only if the form is valid
    Object.getPrototypeOf(drawer.foundation_).handleScrimClick = () => { onClose() }
    Object.getPrototypeOf(drawer.foundation_).handleKeydown = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27)
        onClose()
    }

    drawer.listen('MDCDrawer:opened', () => {
      document.querySelector('.mdc-icon-button').blur()
    })

    user.initUpdated()
    open = !isAuthorValid($user.author) || !isTherapistValid($user.therapist) ||
      !isServicePriceValid($user.servicePrice) || !isPreferredServicesValid($user.preferredServices)
  })

  onDestroy(() => {
    if (drawer) drawer.detroy()

    storeSubscriptions.forEach(storeSubscription => { storeSubscription() })
  })

  function onClose() {
    const validClose = formExpansionPanels.reduce(
      (_validClose, formExpansionPanel) =>
        _validClose &&
        formExpansionPanel.instance &&
        formExpansionPanel.instance.askClose(),
      true
    )

    if (validClose) {
      if (!user.isUpdated()) {
        open = false
        return
      }

      if ($user.terrapeuteID) {
        $loading = true

        saveUser(
          $user.terrapeuteID,
          $user.author,
          $user.therapist,
          $user.servicePrice,
          $user.preferredServices,
          $patients
        )
          .then((_) => {
            open = false
            successPatchSnackbar.open()
            user.initUpdated()
          })
          .catch((err) => {
            console.error(err)
            failedPatchSnackbar.open()
          })
          .finally(() => {
            $loading = false
          })
      } else {
        open = false
        successUpdateSnackbar.open()
        user.initUpdated()
      }
    }
  }

  function onAuthenticationDone() {
    authenticationMode = false
  }

  function onExpansionPanelSetMounted() {
    if ($user.terrapeuteID) {
      user.initUpdated()
      onClose()
    }
  }

  function onExpansionPanelOpen(id) {
    formExpansionPanels.forEach(formExpansionPanel => {
      if (formExpansionPanel.id === id) return

      formExpansionPanel.instance.askClose()
    })
  }

  function onLogOut() {
    authenticationMode = true
    user.logOut()
  }
</script>

<aside bind:this={element} class="mdc-drawer mdc-drawer--modal" dismissible={false}>
  <header class="mdc-drawer__header">
    <div>
      <h1 class="mdc-drawer__title">Vos informations</h1>
      <h2 class="mdc-drawer__subtitle">{$user.author.name}</h2>
    </div>
    <IconButton title="Fermer et annuler les modifications" on:click={onClose}>
      close
    </IconButton>
  </header>
  <hr class="mdc-list-divider">
  <div class="mdc-drawer__content">
    {#if authenticationMode}
      <AuthenticationForm on:done={onAuthenticationDone} />
    {:else}
      <ExpansionPanelSet on:mounted={onExpansionPanelSetMounted}>
        {#each formExpansionPanels as formExpansionPanel (formExpansionPanel.id)}
          <svelte:component this={formExpansionPanel.component} bind:this={formExpansionPanel.instance}
            expansionPanelId={formExpansionPanel.id} on:open={() => onExpansionPanelOpen(formExpansionPanel.id)} />
        {/each}
      </ExpansionPanelSet>
      <div class="log-out-button-wrapper">
        {#if $user.terrapeuteID}
          <Button title="Se déconnecter du réseau Terrapeute" on:click={onLogOut}>
            Se déconnecter
          </Button>
        {:else}
          <Button title="Quitter le mode démo" on:click={onLogOut}>
            Quitter le mode démo
          </Button>
        {/if}
      </div>
    {/if}
  </div>
</aside>

<div class="mdc-drawer-scrim"></div>

<Snackbar bind:this={successUpdateSnackbar}>
  <span slot="label">Vos informations ont été mises à jour.</span>
</Snackbar>
<Snackbar bind:this={successPatchSnackbar}>
  <span slot="label">Vos informations ont été mises à jour sur le réseau Terrapeute.</span>
</Snackbar>
<Snackbar bind:this={failedPatchSnackbar}>
  <span slot="label">
    La sauvegarde de vos informations auprès du réseau Terrapeute a échoué. Veuillez réessayer...
  </span>
</Snackbar>

<style src="UserPanel.scss"></style>
