<script>
  import { MDCDrawer } from '@material/drawer'
  import { onDestroy, onMount } from 'svelte'

  import {
    loading,
    patients,
    user,
    selectedPatient,
    totalDuration,
    selectedServices
  } from '../../js/store'
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

  export function openPanel() {
    open = true
  }

  let open
  let element
  let drawer = {}
  let authenticationMode = true
  let authenticationForm
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
    // FIXME : We are overriding the Material scrim click handler and Esc key down as we only want to
    // close the drawer if and only if the form is valid
    Object.getPrototypeOf(drawer.foundation_).handleScrimClick = () => { onClose() }
    Object.getPrototypeOf(drawer.foundation_).handleKeydown = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27)
        onClose()
    }

    drawer.listen('MDCDrawer:opened', () => {
      drawer.root_.querySelector('.mdc-icon-button').blur()

      const input = drawer.root_.querySelector('input')

      if (input)
        input.focus()
    })

    const localStorageEmail = window.localStorage.getItem('naturapeuteEmail')

    if (localStorageEmail)
      authenticationForm.authenticateNaturapeute(localStorageEmail)
    else
      // NOTE : We can not set open when authenticating from localStorage because it could leads to
      // toggling the Material Drawer two times in a row. As the Material Drawer ignores toggle
      // action while opening or closing, it would leave the panel open when logged in from local
      // storage.
      // In other cases (means authentication form), the panel must be open.
      open = true
  })

  onDestroy(() => {
    if (drawer) drawer.destroy()
  })

  function onClose() {
    if (authenticationMode)
      return

    const isValidClose = formExpansionPanels.reduce((_isValidClose, formExpansionPanel) => {
      return _isValidClose && formExpansionPanel.instance.askClose()
    }, true)

    if (isValidClose) {
      if (!user.isUpdated()) {
        open = false
        return
      }

      if ($user.naturapeuteID) {
        $loading = true

        saveUser(
          $user.naturapeuteID,
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

  function isValidExpansionPanel(id) {
    switch (id) {
      case 'author-form-expansion-panel':
        return isAuthorValid($user.author)
      case 'therapist-form-expansion-panel':
        return isTherapistValid($user.therapist)
      case 'service-price-form-expansion-panel':
        return isServicePriceValid($user.servicePrice)
      case 'preferred-services-form-expansion-panel':
        return isPreferredServicesValid($user.preferredServices)
    }
  }

  function onAuthenticationDone() {
    authenticationMode = false

    open = !formExpansionPanels.reduce((_isValidClose, formExpansionPanel) => {
      return _isValidClose && isValidExpansionPanel(formExpansionPanel.id)
    }, true)
  }

  function onAuthenticationFailed() {
    // NOTE : When the component try to authenticate and it fails (i.e. the account has been
    // deleted), the user panel has to be open. When it occurs in the onMount component method, the
    // panel is by default closed to avoid Material Web Components issue (see NOTE line 80). So when
    // the authentication from the email written in the local storage in onMount method, fails, the
    // panel has to be opened so the user can retry authenticating.
    open = true
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
    $patients = []
    $selectedPatient = null
    $totalDuration = 0
    $selectedServices = []
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
      <AuthenticationForm bind:this={authenticationForm} on:done={onAuthenticationDone}
        on:failed={onAuthenticationFailed} />
    {:else}
      <ExpansionPanelSet>
        {#each formExpansionPanels as formExpansionPanel (formExpansionPanel.id)}
          <svelte:component this={formExpansionPanel.component}
            bind:this={formExpansionPanel.instance} expansionPanelId={formExpansionPanel.id}
            on:open={() => onExpansionPanelOpen(formExpansionPanel.id)} />
        {/each}
      </ExpansionPanelSet>
      <div class="log-out-button-wrapper">
        {#if $user.naturapeuteID}
          <Button title="Se déconnecter du réseau Naturapeute" on:click={onLogOut}>
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
  <span slot="label">Vos informations ont été mises à jour sur le réseau Naturapeute.</span>
</Snackbar>
<Snackbar bind:this={failedPatchSnackbar}>
  <span slot="label">
    La sauvegarde de vos informations auprès du réseau Naturapeute a échoué. Veuillez réessayer...
  </span>
</Snackbar>

<style src="UserPanel.scss"></style>
