<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { author } from '../../js/store'
  import { isAuthorValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'

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
  const dispatch = createEventDispatcher()

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
      <TextField bind:value={$author.name} fieldId="author-name" required>
        Nom ou entreprise
      </TextField>
      <TextField bind:value={$author.street} fieldId="author-street" required>
        Rue et n°
      </TextField>
      <TextField bind:value={$author.ZIP} fieldId="author-zip" required>NPA</TextField>
      <TextField bind:value={$author.city} fieldId="author-city" required>Localité</TextField>
      <TextField bind:value={$author.email} type="email" fieldId="author-email" required>
        Email
      </TextField>
      <TextField bind:value={$author.phone} type="tel" fieldId="author-phone" required>
        Téléphone
      </TextField>
      <TextField bind:value={$author.RCC} type="tel" fieldId="author-rcc" required>
        N°RCC
      </TextField>
      <TextField bind:value={$author.GLN} type="tel" fieldId="author-gln" required>
        N°GLN
      </TextField>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</ExpansionPanel>
