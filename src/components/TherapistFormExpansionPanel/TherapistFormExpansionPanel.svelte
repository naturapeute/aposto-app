<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { therapist } from '../../js/store'
  import { isTherapistValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isTherapistValid($therapist))
      opened = false
    else
      submitButtonElement.click()

    return !opened
  }

  let opened
  let submitButtonElement
  const dispatch = createEventDispatcher()

  onMount(() => {
    opened = !isTherapistValid($therapist)
  })

  function onAskToggle() {
    if (opened)
      askClose()
    else {
      opened = true
      dispatch('open')
    }
  }

  function onSubmit() {
    onAskToggle()
  }
</script>

<ExpansionPanel {expansionPanelId} bind:opened on:askToggle={onAskToggle}>
  <div slot="summary">Thérapeute</div>
  <div slot="content">
    <form class="aposto-form" on:submit|preventDefault={onSubmit}>
      <TextField bind:value={$therapist.firstName} fieldId="therapist-first-name" required>
        Prénom
      </TextField>
      <TextField bind:value={$therapist.lastName} fieldId="therapist-last-name" required>
        Nom
      </TextField>
      <TextField bind:value={$therapist.street} fieldId="therapist-street" required>
        Rue et n°
      </TextField>
      <TextField bind:value={$therapist.ZIP} fieldId="therapist-zip" required>NPA</TextField>
      <TextField bind:value={$therapist.city} fieldId="therapist-city" required>
        Localité
      </TextField>
      <TextField bind:value={$therapist.phone} type="tel" fieldId="therapist-phone" required>
        Téléphone</TextField>
      <TextField bind:value={$therapist.RCC} type="tel" fieldId="therapist-rcc" required>
        N°RCC
      </TextField>
      <TextField bind:value={$therapist.GLN} type="tel" fieldId="therapist-gln" required>
        N°GLN
      </TextField>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</ExpansionPanel>
