<script>
  import { createEventDispatcher } from 'svelte'
  import { author } from '../../js/store'
  import Dialog from '../Dialog/Dialog.svelte'
  import Checkbox from '../Checkbox/Checkbox.svelte'
  import Button from '../Button/Button.svelte'

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
    if (dontShowAgain) window.localStorage.setItem('dontShowAgainConfirmSend', true)
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
    <Button className="cancel-button" dialog dialogAction="close" dialogInitialFocus>
      Annuler
    </Button>
    <Button unelevated dialog dialogAction="accept" on:click={onConfirm}>
      Confirmer
    </Button>
  </div>
</Dialog>

<style src="FinalizeConfirmDialog.scss"></style>
