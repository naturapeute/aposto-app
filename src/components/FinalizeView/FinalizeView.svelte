<script>
  import {
    invoiceTimestamp,
    loading,
    selectedPatient,
    selectedServices,
    totalDuration,
    user
  } from '../../js/store'
  import { generateInvoiceContentBase64, sendInvoice } from '../../services/InvoiceService'
  import Button from '../Button/Button.svelte'
  import FinalizeConfirmDialog from '../FinalizeConfirmDialog/FinalizeConfirmDialog.svelte'
  import FinalizePatient from '../FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from '../FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import SuccessSendScrim from '../SuccessSendScrim/SuccessSendScrim.svelte'

  let errorSnackbar
  let confirmDialog
  let askConfirm = false
  let successSend = false
  let invoiceContentBase64

  $: totalAmount = ($totalDuration / 60) * $user.servicePrice
  $: validationError = getValidationError($selectedPatient, $totalDuration, $selectedServices)

  function getValidationError(patient, totalDuration, selectedServices) {
    if (!selectedServices.length)
      return 'Veuillez sélectionner au moins une thérapie.'

    const usedDuration = selectedServices.reduce((total, service) => total + service.duration, 0)

    if (usedDuration !== totalDuration)
      return 'Veuillez répartir l\'intégralité de votre séance entre les différentes thérapies réalisées.'

    return ''
  }

  function onMaybeClickOut(e) {
    if (askConfirm && !e.target.closest('.confirm-button-container'))
      askConfirm = false
  }

  function onSendInvoice() {
    const donTShowAgain = Boolean(window.localStorage.getItem('donTShowAgainConfirmSend'))

    if (!donTShowAgain || !askConfirm) {
      $invoiceTimestamp = Date.now()

      invoiceContentBase64 = generateInvoiceContentBase64(
        $user.naturapeuteID || '',
        $user.author,
        $user.therapist,
        $selectedPatient,
        $user.servicePrice,
        $selectedServices,
        $invoiceTimestamp
      )
    }

    if (!donTShowAgain)
      confirmDialog.open()
    else if (!askConfirm)
      askConfirm = true
    else
      onConfirmSend()
  }

  function onConfirmSend() {
    askConfirm = false
    $loading = true

    sendInvoice(invoiceContentBase64)
      .then(() => {
        successSend = true
      })
      .catch((err) => {
        console.error(err)
        errorSnackbar.open()
      })
      .finally(() => {
        $loading = false
      })
  }

  function onNewInvoice() {
    $selectedPatient = null
    $selectedServices = []
    $totalDuration = 0
    askConfirm = false
    successSend = false
  }
</script>

<svelte:window on:click={onMaybeClickOut} on:touchstart={onMaybeClickOut} />

<form on:submit|preventDefault={onSendInvoice}>
  <ul class="card-set">
    <li class="mdc-card">
      <FinalizePatient />
    </li>
    {#if $selectedPatient}
      <li class="mdc-card">
        <FinalizeTherapyDescription />
      </li>
      {#if totalAmount}
        <li class="mdc-card">
          <p class="finalize-p">
            <i class="material-icons-outlined">monetization_on</i>
            <strong class="typography--button-inline">
              {totalAmount.toFixed(2)}CHF
            </strong>
          </p>
        </li>
      {/if}
    {/if}
  </ul>
  <div class="submit-buttons-container">
    {#if !askConfirm}
      <div class="send-button-container">
        {#if $selectedPatient && $totalDuration}
          <IconButton className={$loading ? 'loading' : ''} type="submit"
            title="Envoyer la facture par mail au patient" fabLabel="Envoyer"
            fab disabled={validationError || $loading}>
            send
          </IconButton>
          <p class="error-text" hidden={!validationError}>
            {validationError}
          </p>
        {/if}
      </div>
    {:else}
      <div class="confirm-button-container">
        <Button type="submit" title="Confirmer l'envoi de la facture par mail au patient" icon="send"
          outlined disabled={$loading}>
          Confirmer l'envoi
        </Button>
      </div>
    {/if}
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

<FinalizeConfirmDialog bind:this={confirmDialog} {invoiceContentBase64}
  on:confirm={onConfirmSend} />

{#if successSend}
  <SuccessSendScrim on:newInvoice={onNewInvoice} />
{/if}

<style src="FinalizeView.scss"></style>
