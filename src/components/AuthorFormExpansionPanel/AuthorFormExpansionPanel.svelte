<script>
  import { createEventDispatcher } from 'svelte'

  import { user } from '../../js/store'
  import { isAuthorValid } from '../../js/utils'
  import Button from '../Button/Button.svelte'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isAuthorValid($user.author))
      open = false
    else
      submitButtonElement.click()

    return !open
  }

  let open = !isAuthorValid($user.author)
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
  <div slot="summary">Auteur des factures</div>
  <div slot="content">
    <form class="aposto-form" on:submit|preventDefault={onSubmit}>
      <TextField bind:value={$user.author.name} fieldID="author-name" required>
        Nom ou entreprise
      </TextField>
      <TextField bind:value={$user.author.street} fieldID="author-street" required>
        Rue et n°
      </TextField>
      <TextField bind:value={$user.author.ZIP} fieldID="author-zip" required>NPA</TextField>
      <TextField bind:value={$user.author.city} fieldID="author-city" required>Localité</TextField>
      <TextField bind:value={$user.author.email} type="email" fieldID="author-email" required>
        Email
      </TextField>
      <TextField bind:value={$user.author.phone} type="tel" fieldID="author-phone" required>
        Téléphone
      </TextField>
      <TextField bind:value={$user.author.RCC} type="tel" fieldID="author-rcc"
        title="Un numéro RCC est composé d'une lettre majuscule et de 6 chiffres"
        pattern="[A-Z][0-9]&#123;6&#125;" helperText>
        N°RCC

        <span slot="helper-text">
          Le numéro RCC est attribué à des personnes ayant une activité indépendante, à des personnes physiques ou morales (organisations) qui sont en mesure et qui souhaitent exercer à charge de l’assurance-maladie.
          <strong>
            Ce champ est optionnel.
          </strong>
        </span>
      </TextField>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</ExpansionPanel>
