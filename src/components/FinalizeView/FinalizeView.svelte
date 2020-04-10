<script>
  import { servicePrice, loading } from '../../js/store'
  import FinalizePatient from '../FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from '../FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import FinalizeConfirmDialog from '../FinalizeConfirmDialog/FinalizeConfirmDialog.svelte'

  export let patient
  export let services

  let confirmDialog
  let dontShowAgain = window.localStorage.getItem('dontShowAgainConfirmSend')

  $: totalAmount = services.reduce(
    (total, service) => total + (service.duration * $servicePrice / 60),
    0
  )

  const onSendInvoice = () => {
    if (!dontShowAgain)
      confirmDialog.open()
    else
      onConfirmSend()
  }

  const onConfirmSend = () => {
    loading.set(true)
    document.querySelector('.send-button > *').disabled = true
    // TODO : Sending
  }
</script>

<form on:submit|preventDefault={onSendInvoice}>
  <div class="card-set">
    <div class="mdc-card">
      <FinalizePatient {patient} />
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
  <div class="send-button">
    <IconButton type="submit" title="Envoyer la facture par mail au patient" fabLabel="Envoyer" fab>
      send
    </IconButton>
  </div>
</form>

<FinalizeConfirmDialog bind:this={confirmDialog} bind:dontShowAgain {patient} on:confirm={onConfirmSend} />

<style src="FinalizeView.scss"></style>
