<script>
  import { MDCDrawer } from '@material/drawer'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { author, therapist, servicePrice } from '../../js/store'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'
  import IconButton from '../IconButton/IconButton.svelte'

  export let openned = false

  let element
  let drawer = {}
  let submitButtonElement
  const dispatch = createEventDispatcher()

  $: drawer.open = openned

  onMount(() => {
    drawer = new MDCDrawer(element)
    // NOTE : We are overriding the Material scrim click handler as we only want to close the drawer
    // on scrim click if and only if the form is valid
    Object.getPrototypeOf(drawer.foundation_).handleScrimClick = () => { }

    drawer.listen('MDCDrawer:opened', () => {
      document.querySelector('.mdc-icon-button').blur()
    })
  })

  onDestroy(() => {
    if (drawer) drawer.detroy()
  })

  function onClose() {
    submitButtonElement.click()
  }

  function onSubmit() {
    dispatch('closeUserPanel')
  }
</script>

<aside bind:this={element} class="mdc-drawer mdc-drawer--modal" dismissible={false}>
  <div class="mdc-drawer__header">
    <div>
      <h1 class="mdc-drawer__title">Vos informations</h1>
      <h2 class="mdc-drawer__subtitle">{$author.name}</h2>
    </div>
    <IconButton title="Fermer et annuler les modifications" on:click={onClose}>
      close
    </IconButton>
  </div>
  <hr class="mdc-list-divider">
  <div class="mdc-drawer__content">
    <form class="aposto-form drawer-form" on:submit|preventDefault={onSubmit}>
      <h6 class="mdc-list-group__subheader">Auteur des factures</h6>
      <div class="drawer-form-section">
        <TextField bind:value={$author.name} fieldId="author-name" required>
          Nom ou entreprise
        </TextField>
        <TextField bind:value={$author.street} fieldId="author-street" required>
          Rue et n°
        </TextField>
        <TextField bind:value={$author.ZIP} fieldId="author-zip" required>NPA</TextField>
        <TextField bind:value={$author.city} fieldId="author-city" required>Localité</TextField>
        <TextField bind:value={$author.email} type="email" fieldId="author-email" required>
          Email
        </TextField>
        <TextField bind:value={$author.phone} type="tel" fieldId="author-phone" required>
          Téléphone
        </TextField>
        <TextField bind:value={$author.RCC} type="tel" fieldId="author-rcc" required>
          N°RCC
        </TextField>
        <TextField bind:value={$author.GLN} type="tel" fieldId="author-gln" required>
          N°GLN
        </TextField>
      </div>
      <h6 class="mdc-list-group__subheader">Thérapeute</h6>
      <div class="drawer-form-section">
        <TextField bind:value={$therapist.firstName} fieldId="therapist-first-name" required>
          Prénom
        </TextField>
        <TextField bind:value={$therapist.lastName} fieldId="therapist-last-name" required>
          Nom
        </TextField>
        <TextField bind:value={$therapist.street} fieldId="therapist-street" required>
          Rue et n°
        </TextField>
        <TextField bind:value={$therapist.ZIP} fieldId="therapist-zip" required>NPA</TextField>
        <TextField bind:value={$therapist.city} fieldId="therapist-city" required>
          Localité
        </TextField>
        <TextField bind:value={$therapist.phone} type="tel" fieldId="therapist-phone" required>
          Téléphone</TextField>
        <TextField bind:value={$therapist.RCC} type="tel" fieldId="therapist-rcc" required>
          N°RCC
        </TextField>
        <TextField bind:value={$therapist.GLN} type="tel" fieldId="therapist-gln" required>
          N°GLN
        </TextField>
      </div>
      <h6 class="mdc-list-group__subheader">Tarif horaire</h6>
      <div class="drawer-form-section">
        <TextField bind:value={$servicePrice} type="number" fieldId="service-price" required>
          Tarif horaire
        </TextField>
      </div>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</aside>

<div class="mdc-drawer-scrim" on:click={onClose}></div>

<style src="UserPanel.scss"></style>
