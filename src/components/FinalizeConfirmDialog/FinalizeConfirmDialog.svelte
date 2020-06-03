<script>
  import { createEventDispatcher } from 'svelte'

  import { invoiceTimestamp, selectedPatient, user } from '../../js/store'
  import Button from '../Button/Button.svelte'
  import Checkbox from '../Checkbox/Checkbox.svelte'
  import Dialog from '../Dialog/Dialog.svelte'

  export let invoiceContentBase64

  export function open() {
    dialog.open()
  }

  export function close() {
    dialog.close()
  }

  let dialog
  let donTShowAgain = false
  const dispatch = createEventDispatcher()

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
    <a class="mdc-button mdc-button--outlined mdc-dialog__button" title="Prévisualiser la facture"
      target="_blank"
      href="{process.env.API_URL}/pdf/{invoiceContentBase64}/facture-{$invoiceTimestamp}.pdf">
      <div class="mdc-button__ripple"></div>
      <span class="mdc-button__label">
        Prévisualiser
      </span>
    </a>
    <Button title="Confirmer l'envoi de la facture" unelevated dialog dialogAction="accept"
      on:click={onConfirm}>
      Envoyer
    </Button>
  </div>
</Dialog>

<style src="FinalizeConfirmDialog.scss"></style>
