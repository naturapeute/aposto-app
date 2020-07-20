<script>
  import {
    loading,
    remainingDuration,
    selectedPatient,
    selectedServices,
    totalDuration,
    user
  } from '../../js/store'
  import { generateInvoiceContent, previewInvoice, sendInvoice } from '../../services/InvoiceService'
  import Button from '../Button/Button.svelte'
  import FinalizeConfirmDialog from '../FinalizeConfirmDialog/FinalizeConfirmDialog.svelte'
  import FinalizePatient from '../FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from '../FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import FinalizeTotalDuration from '../FinalizeTotalDuration/FinalizeTotalDuration.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import SuccessSendScrim from '../SuccessSendScrim/SuccessSendScrim.svelte'
  import Switch from '../Switch/Switch.svelte'

  let paid = false
  let sendErrorSnackbar
  let previewErrorSnackbar
  let confirmDialog
  let askConfirm = false
  let successSend = false
  let invoiceContent

  const NO_THERAPY_ERROR = 'noTherapy'
  const REMAINING_DURATION_ERROR = 'remainingDuration'

  $: totalAmount = ($totalDuration / 60) * $user.servicePrice
  $: validationError = getValidationError($selectedPatient, $totalDuration, $selectedServices)

  function getValidationError(patient, totalDuration, selectedServices) {
    if (!selectedServices.length)
      return NO_THERAPY_ERROR

    if ($remainingDuration)
      return REMAINING_DURATION_ERROR

    return ''
  }

  function onMaybeClickOut(e) {
    if (askConfirm && !e.target.closest('.confirm-button-container'))
      askConfirm = false
  }

  function onSendInvoice() {
    const donTShowAgain = Boolean(window.localStorage.getItem('donTShowAgainConfirmSend'))

    if (!donTShowAgain || !askConfirm) {
      invoiceContent = generateInvoiceContent(
        $user.naturapeuteID || '',
        $user.author,
        $user.therapist,
        $selectedPatient,
        $user.servicePrice,
        $selectedServices,
        paid
      )
    }

    if (!donTShowAgain)
      confirmDialog.open()
    else if (!askConfirm)
      askConfirm = true
    else
      onConfirmSend()
  }

  function onPreview() {
    $loading = true

    previewInvoice(invoiceContent)
      .then(previewBlob => {
        const previewURL = URL.createObjectURL(previewBlob)

        window.open(previewURL, '_blank')
      })
      .catch(err => {
        console.error(err)

        previewErrorSnackbar.open()
      })
      .finally(() => {
        $loading = false
      })
  }

  function onConfirmSend() {
    askConfirm = false
    $loading = true

    sendInvoice(invoiceContent)
      .then(() => {
        successSend = true
      })
      .catch(err => {
        console.error(err)

        sendErrorSnackbar.open()
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
        <FinalizeTotalDuration />
        <FinalizeTherapyDescription />
      </li>
      {#if totalAmount}
        <li class="mdc-card finalize-total-amount">
          <p class="finalize-p">
            <i class="material-icons-outlined">monetization_on</i>
            <strong class="typography--button-inline">
              {totalAmount.toFixed(2)}CHF
            </strong>
          </p>
          <div class="switch-wrapper">
            <Switch bind:checked={paid} switchId="paid-switch">
              Payé
            </Switch>
          </div>
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
            {#if validationError === NO_THERAPY_ERROR}
              Veuillez sélectionner au moins une thérapie.
            {:else if validationError === REMAINING_DURATION_ERROR}
              Veuillez répartir l'intégralité de votre séance entre les différentes thérapies réalisées.
            {/if}
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
</form>

<Snackbar bind:this={sendErrorSnackbar}>
  <span slot="label">L'envoi de la facture a échoué. Veuillez réessayer plus tard...</span>

  <div slot="actions">
    <Button on:click={onSendInvoice} title="Réessayer d'envoyer la facture par mail au patient"
      snackbar>
      Réessayer
    </Button>
  </div>
</Snackbar>

<Snackbar bind:this={previewErrorSnackbar}>
  <span slot="label">
    La génération de la facture pour la prévisualisation a échoué. Veuillez réessayer plus tard...
  </span>

  <div slot="actions">
    <Button on:click={onPreview} title="Réessayer de prévisualiser la facture" snackbar>
      Réessayer
    </Button>
  </div>
</Snackbar>

<FinalizeConfirmDialog bind:this={confirmDialog} on:confirm={onConfirmSend}
  on:preview={onPreview} />

{#if successSend}
  <SuccessSendScrim on:newInvoice={onNewInvoice} />
{/if}

<style src="FinalizeView.scss"></style>
