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
      <TextField bind:value={$user.author.name} fieldID="author-name" maxlength="70" required>
        Nom ou entreprise
      </TextField>
      <TextField bind:value={$user.author.street} fieldID="author-street" maxlength="35" required>
        Rue et n°
      </TextField>
      <div class="row row-xl">
        <TextField className="col col-40" bind:value={$user.author.ZIP} fieldID="author-zip"
          maxlength="9" required>
          NPA
        </TextField>
        <TextField className="col col-60" bind:value={$user.author.city} fieldID="author-city"
          maxlength="35" required>
          Localité
        </TextField>
      </div>
      <div class="row row-xl">
        <TextField className="col col-60" bind:value={$user.author.email} type="email"
          fieldID="author-email" required>
          Email
        </TextField>
        <TextField className="col col-40" bind:value={$user.author.phone} type="tel"
          fieldID="author-phone" maxlength="35" required>
          Téléphone
        </TextField>
      </div>
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
