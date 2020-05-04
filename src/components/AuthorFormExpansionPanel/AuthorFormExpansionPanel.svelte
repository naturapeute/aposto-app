<script>
  import { createEventDispatcher } from 'svelte'
  import { author } from '../../js/store'
  import { isAuthorValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'
  import { getGLN } from '../../services/UserService'

  export let expansionPanelId

  export function askClose() {
    if (isAuthorValid($author))
      open = false
    else
      submitButtonElement.click()

    return !open
  }

  let open = !isAuthorValid($author)
  let submitButtonElement
  let GLNNotFound = false
  const dispatch = createEventDispatcher()

  $: if (!$author.GLN && $author.name && $author.ZIP && $author.city) {
    getGLN($author.name, '', '', $author.ZIP, $author.city)
      .then(GLN => {
        $author.GLN = GLN
        GLNNotFound = false
      })
      .catch((_) => {
        GLNNotFound = true
      })
  }

  $: if ($author.GLN)
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
  <div slot="summary">Auteur des factures</div>
  <div slot="content">
    <form class="aposto-form" on:submit|preventDefault={onSubmit}>
      <TextField bind:value={$author.name} fieldID="author-name" required>
        Nom ou entreprise
      </TextField>
      <TextField bind:value={$author.street} fieldID="author-street" required>
        Rue et n°
      </TextField>
      <TextField bind:value={$author.ZIP} fieldID="author-zip" required>NPA</TextField>
      <TextField bind:value={$author.city} fieldID="author-city" required>Localité</TextField>
      <TextField bind:value={$author.email} type="email" fieldID="author-email" required>
        Email
      </TextField>
      <TextField bind:value={$author.phone} type="tel" fieldID="author-phone" required>
        Téléphone
      </TextField>
      <TextField bind:value={$author.RCC} type="tel" fieldID="author-rcc"
        title="Un numéro RCC est composé d'une lettre majuscule et de 6 chiffres"
        pattern="[A-Z][0-9]&#123;6&#125;" required>
        N°RCC
      </TextField>
      <TextField bind:value={$author.GLN} type="tel" fieldID="author-gln" helperText={GLNNotFound}
        title="Un numéro GLN est composé de 13 chiffres" pattern="[0-9]&#123;13&#125;" required
        persistentHelperText>
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
