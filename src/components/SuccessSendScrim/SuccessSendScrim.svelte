<script>
  import { createEventDispatcher } from 'svelte'
  import Button from '../Button/Button.svelte'

  export let patient

  const dispatch = createEventDispatcher()

  function onNewInvoice() {
    dispatch('newInvoice')
  }
</script>

<div class="success-scrim"></div>
<div class="success-container">
  <h1 class="mdc-typography--headline2">C'est envoyé !</h1>
  <p>
    Votre nouvelle facture a bien été envoyée à <span
      class="typography--button-inline no-click-inline">
      {patient.firstName} {patient.lastName}</span>.
  </p>
  <p>Vous devriez recevoir une copie dans votre boîte mail sous peu.</p>
  <Button title="Créer une nouvelle facture" on:click={onNewInvoice}>
    Créer une nouvelle facture
  </Button>
</div>

<style src="SuccessSendScrim.scss"></style>
