<script>
  import { createEventDispatcher } from 'svelte'
  import { author } from '../../js/store'
  import Dialog from '../Dialog/Dialog.svelte'
  import Checkbox from '../Checkbox/Checkbox.svelte'
  import Button from '../Button/Button.svelte'

  export let patient

  export function open() {
    dialog.open()
  }

  export function close() {
    dialog.close()
  }

  let dialog
  let dontShowAgain = false
  const dispatch = createEventDispatcher()

  function onConfirm() {
    if (dontShowAgain) window.localStorage.setItem('dontShowAgainConfirmSend', true)
    dispatch('confirm')
  }
</script>

<Dialog bind:this={dialog} dialogId="dialog-confirm-send">
  <span slot="dialog-title">Envoyer par mail</span>

  <div slot="dialog-body">
    <p>
      Cette action va générer la facture et l'envoyer à
      <strong class="typography--button-inline">
        {patient.firstName} {patient.lastName} ({patient.email})
      </strong>
      par mail.
    </p>
    <p>
      Vous recevrez également une copie dans votre boîte mail
      <strong class="typography--button-inline">
        {$author.email}
      </strong>
      .
    </p>
    <Checkbox bind:checked={dontShowAgain} checkboxId="dont-show-again">
      Ne plus afficher cette alerte
    </Checkbox>
  </div>

  <div slot="dialog-footer">
    <Button className="cancel-button" title="Revenir à l'édition de la facture" dialog
      dialogAction="close" dialogInitialFocus>
      Revenir
    </Button>
    <Button title="Confirmer l'envoi de la facture" unelevated dialog dialogAction="accept"
      on:click={onConfirm}>
      Envoyer
    </Button>
  </div>
</Dialog>

<style src="FinalizeConfirmDialog.scss"></style>
