<script>
  import { createEventDispatcher } from 'svelte'
  import { author, therapist, servicePrice, loading } from '../../js/store'
  import FinalizePatient from '../FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from '../FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import FinalizeConfirmDialog from '../FinalizeConfirmDialog/FinalizeConfirmDialog.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import Button from '../Button/Button.svelte'
  import SuccessSendScrim from '../SuccessSendScrim/SuccessSendScrim.svelte'
  import { sendInvoice } from '../../services/InvoiceService'

  export let patient = null
  export let services

  let errorSnackbar
  let confirmDialog
  let askConfirm = false
  let successSend = false
  const dispatch = createEventDispatcher()

  $: totalAmount = services.reduce(
    (total, service) => total + (service.duration * $servicePrice / 60),
    0
  )

  function onSendInvoice() {
    const dontShowAgain = Boolean(window.localStorage.getItem('dontShowAgainConfirmSend'))

    if (!dontShowAgain)
      confirmDialog.open()
    else if (!askConfirm)
      askConfirm = true
    else
      onConfirmSend()
  }

  function onConfirmSend() {
    $loading = true

    sendInvoice(
      { ...$author },
      { ...$therapist },
      { ...patient },
      $servicePrice,
      services.map(e => ({ ...e }))
    )
      .then(() => {
        successSend = true
      })
      .catch((err) => {
        errorSnackbar.open()
        console.error(err)
      })
      .finally(() => {
        $loading = false
      })
  }

  function onNewInvoice() {
    dispatch('newInvoice')
    patient = null
    askConfirm = false
    successSend = false
  }
</script>

<form on:submit|preventDefault={onSendInvoice}>
  <div class="card-set">
    <div class="mdc-card">
      <FinalizePatient bind:patient />
    </div>
    <div class="mdc-card">
      <FinalizeTherapyDescription bind:services />
    </div>
    <div class="mdc-card">
      <p class="finalize-p">
        <i class="material-icons-round">monetization_on</i>
        <span class="typography--button-inline no-click-inline">
          {totalAmount.toFixed(2)}CHF
        </span>
      </p>
    </div>
  </div>
  <div class="send-button" class:loading={$loading}>
    <IconButton className={askConfirm ? 'confirm-button' : ''} type="submit"
      title="{askConfirm ? "Confimer l'envoi" : "Envoyer la facture par mail au patient"}"
      fabLabel="Envoyer" fab disabled={!patient || $loading}>
      send
    </IconButton>
  </div>
  <Snackbar bind:this={errorSnackbar}>
    <span slot="label">L'envoi de la facture a échoué. Veuillez réessayer plus tard...</span>

    <div slot="actions">
      <Button on:click={onSendInvoice} title="Réessayer d'envoyer la facture par mail au patient"
        snackbar>
        Réessayer
      </Button>
    </div>
  </Snackbar>
</form>

{#if patient}
  <FinalizeConfirmDialog bind:this={confirmDialog} {patient}
    on:confirm={onConfirmSend} />
{/if}

{#if patient && successSend}
  <SuccessSendScrim {patient} on:newInvoice={onNewInvoice} />
{/if}

<style src="FinalizeView.scss"></style>
