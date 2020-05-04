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
<dialog class="success-container">
  <h1 class="mdc-typography--headline2">C'est envoyé !</h1>
  <p>
    Votre nouvelle facture a bien été envoyée à <strong
      class="typography--button-inline">
      {patient.firstName} {patient.lastName}
    </strong>.
  </p>
  <p>Vous devriez recevoir une copie dans votre boîte mail sous peu.</p>
  <Button title="Créer une nouvelle facture" on:click={onNewInvoice}>
    Créer une nouvelle facture
  </Button>
</dialog>

<style src="SuccessSendScrim.scss"></style>
