<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { slide } from 'svelte/transition'
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

  onMount(() => {
    window.addEventListener(
      'ontouchstart' in window ? 'touchstart' : 'click',
      (e) => {
        if (askConfirm && !e.target.closest('.confirm-button-container'))
          askConfirm = false
      })
  })

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
  <ul class="card-set">
    <li class="mdc-card">
      <FinalizePatient bind:patient />
    </li>
    <li class="mdc-card">
      <FinalizeTherapyDescription bind:services />
    </li>
    <li class="mdc-card">
      <p class="finalize-p">
        <i class="material-icons-outlined">monetization_on</i>
        <strong class="typography--button-inline no-click-inline">
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
        {#if !patient}
          <p class="send-error-text">
            Veuillez sélectionner un patient pour finaliser votre facture.
          </p>
        {/if}
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
