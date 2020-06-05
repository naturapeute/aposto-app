<script>
  import { createEventDispatcher } from 'svelte'

  import { loading, selectedPatient, user } from '../../js/store'
  import { previewInvoice } from '../../services/InvoiceService'
  import Button from '../Button/Button.svelte'
  import Checkbox from '../Checkbox/Checkbox.svelte'
  import Dialog from '../Dialog/Dialog.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'

  export let invoiceContent

  export function open() {
    dialog.open()
  }

  export function close() {
    dialog.close()
  }

  let dialog
  let errorSnackbar
  let donTShowAgain = false
  const dispatch = createEventDispatcher()

  function onPreview() {
    $loading = true

    previewInvoice(invoiceContent)
      .then(previewBlob => {
        const previewURL = URL.createObjectURL(previewBlob)

        window.open(previewURL, '_blank')
      })
      .catch(err => {
        console.error(err)
        errorSnackbar.open()
      })
      .finally(() => {
        $loading = false
      })
  }

  function onConfirm() {
    if (donTShowAgain) window.localStorage.setItem('donTShowAgainConfirmSend', true)
    dispatch('confirm')
  }
</script>

<Dialog bind:this={dialog} dialogId="dialog-confirm-send">
  <span slot="dialog-title">Envoyer par mail</span>

  <div slot="dialog-body">
    <p>
      Cette action va générer la facture et l'envoyer à
      <strong class="typography--button-inline">
        {#if $selectedPatient}
          {$selectedPatient.firstName} {$selectedPatient.lastName} ({$selectedPatient.email})
        {/if}
      </strong>
      par mail.
    </p>
    <p>
      Vous recevrez également une copie dans votre boîte mail
      <strong class="typography--button-inline">
        {$user.author.email}
      </strong>
      .
    </p>
    <Checkbox bind:checked={donTShowAgain} checkboxId="don-t-show-again">
      Ne plus afficher cette alerte
    </Checkbox>
  </div>

  <div class="confirm-dialog-footer" slot="dialog-footer">
    <Button className="cancel-button" title="Revenir à l'édition de la facture" dialog
      dialogAction="close" dialogInitialFocus>
      Revenir
    </Button>
    <Button title="Prévisualiser la facture" outlined dialog on:click={onPreview}>
      Prévisualiser
    </Button>
    <Button title="Confirmer l'envoi de la facture" unelevated dialog dialogAction="accept"
      on:click={onConfirm}>
      Envoyer
    </Button>
  </div>
</Dialog>

<Snackbar bind:this={errorSnackbar}>
  <span slot="label">
    La génération de la facture pour la prévisualisation a échoué. Veuillez réessayer plus tard...
  </span>

  <div slot="actions">
    <Button on:click={onPreview} title="Réessayer de prévisualiser la facture" snackbar>
      Réessayer
    </Button>
  </div>
</Snackbar>

<style src="FinalizeConfirmDialog.scss"></style>
