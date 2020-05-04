<script>
  import { createEventDispatcher } from 'svelte'

  import { therapist } from '../../js/store'
  import { isTherapistValid } from '../../js/utils'
  import { getGLN } from '../../services/UserService'
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
        pattern="[A-Z][0-9]&#123;6&#125;" helperText required>
        N°RCC
      </TextField>
      <TextField bind:value={$therapist.GLN} type="tel" fieldID="therapist-gln"
        title="Un numéro GLN est composé de 13 chiffres" pattern="[0-9]&#123;13&#125;"
        helperText={GLNNotFound} required persistentHelperText>
        N°GLN
        <span slot="helper-text">
          {#if GLNNotFound}
            <a href="https://www.refdata.ch/fr/partenaires/requete/base-de-donnees-des-partenaires-gln"
              target="_blank">
              Trouvez ou faites la demande de votre n°GLN sur RefData.
            </a>
            Si toutefois vous ne le trouvez pas, renseignez le numéro 2099999999999.
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
