<script>
  import { createEventDispatcher } from 'svelte'

  import { therapist } from '../../js/store'
  import { isTherapistValid } from '../../js/utils'
  import Button from '../Button/Button.svelte'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isTherapistValid($therapist))
      open = false
    else
      submitButtonElement.click()

    return !open
  }

  let open = !isTherapistValid($therapist)
  let submitButtonElement
  const dispatch = createEventDispatcher()

  function onAskToggle() {
    if (open)
      askClose()
    else {
      open = true
      dispatch('open')
    }
  }

  function onSubmit() {
    onAskToggle()
  }
</script>

<ExpansionPanel {expansionPanelId} bind:open on:askToggle={onAskToggle}>
  <div slot="summary">Thérapeute</div>
  <div slot="content">
    <form class="aposto-form" on:submit|preventDefault={onSubmit}>
      <TextField bind:value={$therapist.firstName} fieldID="therapist-first-name" required>
        Prénom
      </TextField>
      <TextField bind:value={$therapist.lastName} fieldID="therapist-last-name" required>
        Nom
      </TextField>
      <TextField bind:value={$therapist.street} fieldID="therapist-street" required>
        Rue et n°
      </TextField>
      <TextField bind:value={$therapist.ZIP} fieldID="therapist-zip" required>NPA</TextField>
      <TextField bind:value={$therapist.city} fieldID="therapist-city" required>
        Localité
      </TextField>
      <TextField bind:value={$therapist.phone} type="tel" fieldID="therapist-phone" required>
        Téléphone</TextField>
      <TextField bind:value={$therapist.RCC} type="tel" fieldID="therapist-rcc"
        title="Un numéro RCC est composé d'une lettre majuscule et de 6 chiffres"
        pattern="[A-Z][0-9]&#123;6&#125;">
        N°RCC
      </TextField>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</ExpansionPanel>
