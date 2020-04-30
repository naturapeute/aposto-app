<script>
  import { MDCDrawer } from '@material/drawer'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { slide } from 'svelte/transition'
  import {
    terrapeuteUserID,
    author,
    therapist,
    servicePrice,
    preferedServices,
    patients,
    loading
  } from '../../js/store'
  import {
    isAuthorValid,
    isTherapistValid,
    isServicePriceValid,
    isPreferedServicesValid
  } from '../../js/utils'
  import IconButton from '../IconButton/IconButton.svelte'
  import ExpansionPanelSet from '../ExpansionPanelSet/ExpansionPanelSet.svelte'
  import AuthorFormExpansionPanel from '../AuthorFormExpansionPanel/AuthorFormExpansionPanel.svelte'
  import TherapistFormExpansionPanel
    from '../TherapistFormExpansionPanel/TherapistFormExpansionPanel.svelte'
  import ServicePriceFormExpansionPanel
    from '../ServicePriceFormExpansionPanel/ServicePriceFormExpansionPanel.svelte'
  import PreferedServicesFormExpansionPanel
    from '../PreferedServicesFormExpansionPanel/PreferedServicesFormExpansionPanel.svelte'
  import AuthenticationForm
    from '../AuthenticationForm/AuthenticationForm.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import { saveUser } from '../../services/UserService'

  export let open = false

  let element
  let drawer = {}
  let authenticationMode = true
  let failedPatchSnackbar

  const formExpansionPanels = [
    { component: AuthorFormExpansionPanel, id: 'author-form-expansion-panel' },
    { component: TherapistFormExpansionPanel, id: 'therapist-form-expansion-panel' },
    { component: ServicePriceFormExpansionPanel, id: 'service-price-form-expansion-panel' },
    { component: PreferedServicesFormExpansionPanel, id: 'prefered-services-form-expansion-panel' }
  ]

  const dispatch = createEventDispatcher()

  $: drawer.open = open

  onMount(() => {
    drawer = new MDCDrawer(element)
    // FIXME : We are overriding the Material scrim click handler as we only want to close the drawer
    // on scrim click if and only if the form is valid
    Object.getPrototypeOf(drawer.foundation_).handleScrimClick = () => { }

    drawer.listen('MDCDrawer:opened', () => {
      document.querySelector('.mdc-icon-button').blur()
    })

    open = !isAuthorValid($author) || !isTherapistValid($therapist) ||
      !isServicePriceValid($servicePrice) || !isPreferedServicesValid($preferedServices)
  })

  onDestroy(() => {
    if (drawer) drawer.detroy()
  })

  function onClose() {
    const validClose = formExpansionPanels.reduce(
      (_validClose, formExpansionPanel) => _validClose && formExpansionPanel.instance.askClose(),
      true
    )

    if (validClose) {
      if ($terrapeuteUserID) {
        $loading = true

        saveUser($terrapeuteUserID, $author, $therapist, $servicePrice, $preferedServices, $patients)
          .then((_) => {
            dispatch('closeUserPanel')
          })
          .catch((err) => {
            console.error(err)
            failedPatchSnackbar.open()
          })
          .finally(() => {
            $loading = false
          })
      } else
        dispatch('closeUserPanel')
    }
  }

  function onAuthenticationDone() {
    authenticationMode = false
  }

  function onExpansionPanelOpen(id) {
    formExpansionPanels.forEach(formExpansionPanel => {
      if (formExpansionPanel.id === id) return

      formExpansionPanel.instance.askClose()
    })
  }
</script>

<aside bind:this={element} class="mdc-drawer mdc-drawer--modal" dismissible={false}>
  <header class="mdc-drawer__header">
    <div>
      <h1 class="mdc-drawer__title">Vos informations</h1>
      <h2 class="mdc-drawer__subtitle">{$author.name}</h2>
    </div>
    <IconButton title="Fermer et annuler les modifications" on:click={onClose}>
      close
    </IconButton>
  </header>
  <hr class="mdc-list-divider">
  <div class="mdc-drawer__content">
    {#if authenticationMode}
      <div transition:slide>
        <AuthenticationForm on:done={onAuthenticationDone} />
      </div>
    {:else}
      <ExpansionPanelSet>
        {#each formExpansionPanels as formExpansionPanel (formExpansionPanel.id)}
          <svelte:component this={formExpansionPanel.component} bind:this={formExpansionPanel.instance}
            expansionPanelId={formExpansionPanel.id} on:open={() => onExpansionPanelOpen(formExpansionPanel.id)} />
        {/each}
      </ExpansionPanelSet>
    {/if}
  </div>
</aside>

<div class="mdc-drawer-scrim" on:click={onClose}></div>

<Snackbar bind:this={failedPatchSnackbar}>
  <span slot="label">
    La sauvegarde de vos informations auprès du réseau Terrapeute a échoué. Veuillez réessayer.
  </span>
</Snackbar>

<style src="UserPanel.scss"></style>
