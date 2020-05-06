<script>
  import { slide } from 'svelte/transition'

  import { loading, selectedServices, totalDuration, user } from '../../js/store'
  import { sendInvoice } from '../../services/InvoiceService'
  import Button from '../Button/Button.svelte'
  import FinalizeConfirmDialog from '../FinalizeConfirmDialog/FinalizeConfirmDialog.svelte'
  import FinalizePatient from '../FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from '../FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import SuccessSendScrim from '../SuccessSendScrim/SuccessSendScrim.svelte'

  export let patient = null

  let errorSnackbar
  let confirmDialog
  let askConfirm = false
  let successSend = false

  $: totalAmount = $selectedServices.reduce(
    (total, service) => total + (service.duration * $user.servicePrice / 60),
    0
  )

  function onMaybeClickOut(e) {
    if (askConfirm && !e.target.closest('.confirm-button-container'))
      askConfirm = false
  }

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
    askConfirm = false
    $loading = true

    sendInvoice(
      $user.terrapeuteID || '',
      $user.author,
      $user.therapist,
      patient,
      $user.servicePrice,
      $selectedServices
    )
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
    patient = null
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
      <FinalizePatient bind:patient />
    </li>
    <li class="mdc-card">
      <FinalizeTherapyDescription />
    </li>
    <li class="mdc-card">
      <p class="finalize-p">
        <i class="material-icons-outlined">monetization_on</i>
        <strong class="typography--button-inline">
          {totalAmount.toFixed(2)}CHF
        </strong>
      </p>
    </li>
  </ul>
  <div class="submit-buttons-container">
    {#if !askConfirm}
      <div class="send-button-container" transition:slide="{{ duration: 400 }}">
        <IconButton className={$loading ? 'loading' : ''} type="submit"
          title="Envoyer la facture par mail au patient" fabLabel="Envoyer"
          fab disabled={!patient || $loading}>
          send
        </IconButton>
        <p class="send-error-text" hidden={patient}>
          Veuillez sélectionner un patient pour finaliser votre facture.
        </p>
      </div>
    {:else}
      <div class="confirm-button-container" transition:slide="{{ duration: 400 }}">
        <Button type="submit" title="Confimer l'envoi de la facture par mail au patient" icon="send"
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

{#if patient}
  <FinalizeConfirmDialog bind:this={confirmDialog} {patient}
    on:confirm={onConfirmSend} />
{/if}

{#if patient && successSend}
  <SuccessSendScrim {patient} on:newInvoice={onNewInvoice} />
{/if}

<style src="FinalizeView.scss"></style>
