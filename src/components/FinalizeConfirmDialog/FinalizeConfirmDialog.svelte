<script>
  import { createEventDispatcher } from 'svelte'

  import { selectedPatient, user } from '../../js/store'
  import Button from '../Button/Button.svelte'
  import Checkbox from '../Checkbox/Checkbox.svelte'
  import Dialog from '../Dialog/Dialog.svelte'

  export function open() {
    dialog.open()
  }

  export function close() {
    dialog.close()
  }

  let dialog
  let donTShowAgain = false
  const dispatch = createEventDispatcher()

  function onPreview() {
    dispatch('preview')
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
          {$selectedPatient.firstname} {$selectedPatient.lastname} ({$selectedPatient.email})
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

<style src="FinalizeConfirmDialog.scss"></style>
