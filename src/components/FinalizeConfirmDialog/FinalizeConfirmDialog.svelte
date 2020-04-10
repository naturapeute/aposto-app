<script>
  import { createEventDispatcher } from 'svelte'
  import { author } from '../../js/store'
  import Dialog from '../Dialog/Dialog.svelte'
  import Checkbox from '../Checkbox/Checkbox.svelte'

  export let patient
  export let dontShowAgain

  export const open = () => {
    dialog.open()
  }

  export const close = () => {
    dialog.close()
  }

  let dialog
  const dispatch = createEventDispatcher()

  const onConfirm = () => {
    window.localStorage.setItem('dontShowAgainConfirmSend', true)
    dispatch('confirm')
  }
</script>

<Dialog bind:this={dialog} dialogId="dialog-confirm-send">
  <span slot="dialog-title">Confirmer l'envoi</span>

  <div slot="dialog-body">
    <p>
      Cette action va générer la facture et l'envoyer à
      <span class="typography--button-inline no-click-inline">
        {patient.firstName} {patient.lastName} ({patient.email})
      </span>
      par mail.
    </p>
    <p>
      Vous recevrez également une copie dans votre boîte mail
      <span class="typography--button-inline no-click-inline">
        {$author.email}
      </span>
      .
    </p>
    <Checkbox bind:checked={dontShowAgain} checkboxId="dont-show-again">
      Ne plus afficher cette alerte
    </Checkbox>
  </div>

  <div slot="dialog-footer">
    <button type="button" class="mdc-button mdc-dialog__button cancel-button"
      data-mdc-dialog-action="close" data-mdc-dialog-initial-focus>
      <div class="mdc-button__ripple"></div>
      <span class="mdc-button__label">Annuler</span>
    </button>
    <button type="button" class="mdc-button mdc-button--unelevated mdc-dialog__button"
      data-mdc-dialog-action="accept" on:click={onConfirm}>
      <div class="mdc-button__ripple"></div>
      <span class="mdc-button__label">Confirmer</span>
    </button>
  </div>
</Dialog>

<style src="FinalizeConfirmDialog.scss"></style>
