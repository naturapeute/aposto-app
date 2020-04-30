<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { author } from '../../js/store'
  import { isAuthorValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'
  import { getGLN } from '../../services/UserService'

  export let expansionPanelId

  export function askClose() {
    if (isAuthorValid($author))
      opened = false
    else
      submitButtonElement.click()

    return !opened
  }

  let opened
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

  onMount(() => {
    opened = !isAuthorValid($author)
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
      <TextField bind:value={$author.RCC} type="tel" fieldID="author-rcc" required>
        N°RCC
      </TextField>
      <TextField bind:value={$author.GLN} type="tel" fieldID="author-gln" helperText={GLNNotFound}
        required>
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
