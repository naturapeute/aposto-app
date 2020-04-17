<script>
  import { MDCDrawer } from '@material/drawer'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { author, therapist, servicePrice } from '../../js/store'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'
  import IconButton from '../IconButton/IconButton.svelte'

  export let openned = false

  let _author = { ...$author }
  let _therapist = { ...$therapist }
  let _servicePrice = $servicePrice
  let element
  let drawer = {}
  const dispatch = createEventDispatcher()

  $: drawer.open = openned

  onMount(() => {
    drawer = MDCDrawer.attachTo(element)
    element.addEventListener('MDCDrawer:opened', () => {
      document.querySelector('.mdc-icon-button').blur()
    })
  })

  onDestroy(() => {
    if (drawer) drawer.detroy()
  })

  const onCloseClick = () => {
    dispatch('closeUserPanel')
    _author = { ...$author }
    _therapist = { ...$therapist }
    _servicePrice = $servicePrice
  }

  const onSubmit = () => {
    $author = { ..._author }
    $therapist = { ..._therapist }
    $servicePrice = _servicePrice
    dispatch('closeUserPanel')
  }
</script>

<aside bind:this={element} class="mdc-drawer mdc-drawer--modal">
  <div class="mdc-drawer__header">
    <div>
      <h1 class="mdc-drawer__title">Vos informations</h1>
      <h2 class="mdc-drawer__subtitle">{$author.name}</h2>
    </div>
    <IconButton title="Fermer et annuler les modifications" on:click={onCloseClick}>
      close
    </IconButton>
  </div>
  <hr class="mdc-list-divider">
  <form class="drawer-form" on:submit|preventDefault={onSubmit}>
    <div class="mdc-drawer__content">
      <h6 class="mdc-list-group__subheader">Auteur des factures</h6>
      <div class="drawer-form-section aposto-form">
        <TextField bind:value={_author.name} fieldId="author-name" required>
          Nom ou entreprise
        </TextField>
        <TextField bind:value={_author.street} fieldId="author-street" required>
          Rue et n°
        </TextField>
        <TextField bind:value={_author.ZIP} fieldId="author-zip" required>NPA</TextField>
        <TextField bind:value={_author.city} fieldId="author-city" required>Localité</TextField>
        <TextField bind:value={_author.email} type="email" fieldId="author-email" required>
          Email
        </TextField>
        <TextField bind:value={_author.phone} type="tel" fieldId="author-phone" required>
          Téléphone
        </TextField>
        <TextField bind:value={_author.RCC} type="tel" fieldId="author-rcc" required>
          N°RCC
        </TextField>
        <TextField bind:value={_author.GLN} type="tel" fieldId="author-gln" required>
          N°GLN
        </TextField>
      </div>
      <h6 class="mdc-list-group__subheader">Thérapeute</h6>
      <div class="drawer-form-section aposto-form">
        <TextField bind:value={_therapist.firstName} fieldId="therapist-first-name" required>
          Prénom
        </TextField>
        <TextField bind:value={_therapist.lastName} fieldId="therapist-last-name" required>
          Nom
        </TextField>
        <TextField bind:value={_therapist.street} fieldId="therapist-street" required>
          Rue et n°
        </TextField>
        <TextField bind:value={_therapist.ZIP} fieldId="therapist-zip" required>NPA</TextField>
        <TextField bind:value={_therapist.city} fieldId="therapist-city" required>
          Localité
        </TextField>
        <TextField bind:value={_therapist.phone} type="tel" fieldId="therapist-phone" required>
          Téléphone</TextField>
        <TextField bind:value={_therapist.RCC} type="tel" fieldId="therapist-rcc" required>
          N°RCC
        </TextField>
        <TextField bind:value={_therapist.GLN} type="tel" fieldId="therapist-gln" required>
          N°GLN
        </TextField>
      </div>
      <h6 class="mdc-list-group__subheader">Tarif horaire</h6>
      <div class="drawer-form-section aposto-form">
        <TextField bind:value={_servicePrice} type="number" fieldId="service-price" required>
          Tarif horaire
        </TextField>
      </div>
    </div>
    <hr class="mdc-list-divider">
    <div class="drawer-footer">
      <Button type="submit" title="Enregistrer les modifications" unelevated>
        Enregistrer
      </Button>
    </div>
  </form>
</aside>

<div class="mdc-drawer-scrim" on:click={onCloseClick}></div>

<style src="UserPanel.scss"></style>
