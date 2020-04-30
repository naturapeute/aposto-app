<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { therapist } from '../../js/store'
  import { isTherapistValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'
  import { getGLN } from '../../services/UserService'

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
  let GLNNotFound = false
  const dispatch = createEventDispatcher()

  $: if (!$therapist.GLN && $therapist.firstName && $therapist.lastName && $therapist.ZIP &&
    $therapist.city) {
    getGLN('', $therapist.firstName, $therapist.lastName, $therapist.ZIP, $therapist.city)
      .then(GLN => {
        $therapist.GLN = GLN
        GLNNotFound = false
      })
      .catch((_) => {
        GLNNotFound = true
      })
  }

  $: if ($therapist.GLN)
    GLNNotFound = false

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
      <TextField bind:value={$therapist.RCC} type="tel" fieldID="therapist-rcc" required>
        N°RCC
      </TextField>
      <TextField bind:value={$therapist.GLN} type="tel" fieldID="therapist-gln"
        helperText={GLNNotFound} required>
        N°GLN
        <span slot="helper-text">
          {#if GLNNotFound}
            <a href="https://www.refdata.ch/fr/partenaires/requete/base-de-donnees-des-partenaires-gln"
              target="_blank">
              Trouver son n°GLN ou faire la demande
            </a>
          {/if}
        </span>
      </TextField>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</ExpansionPanel>
