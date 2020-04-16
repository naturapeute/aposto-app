<script>
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
  let successSend = false

  $: totalAmount = services.reduce(
    (total, service) => total + (service.duration * $servicePrice / 60),
    0
  )

  const onSendInvoice = () => {
    const dontShowAgain = Boolean(window.localStorage.getItem('dontShowAgainConfirmSend'))

    if (!dontShowAgain)
      confirmDialog.open()
    else
      onConfirmSend()
  }

  const onConfirmSend = () => {
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
</script>

<form on:submit|preventDefault={onSendInvoice}>
  <div class="card-set">
    <div class="mdc-card">
      <FinalizePatient bind:patient />
    </div>
    <div class="mdc-card">
      <FinalizeTherapyDescription {services} />
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
    <IconButton type="submit" title="Envoyer la facture par mail au patient" fabLabel="Envoyer" fab
      disabled={!patient || $loading}>
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
  <SuccessSendScrim {patient} />
{/if}

<style src="FinalizeView.scss"></style>
