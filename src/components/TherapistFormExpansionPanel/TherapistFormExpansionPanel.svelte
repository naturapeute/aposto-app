<script>
  import { createEventDispatcher } from 'svelte'

  import { user } from '../../js/store'
  import { isTherapistValid } from '../../js/utils'
  import Button from '../Button/Button.svelte'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isTherapistValid($user.therapist))
      open = false
    else
      submitButtonElement.click()

    return !open
  }

  let open = !isTherapistValid($user.therapist)
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
      <div class="row row-xl">
        <TextField className="col col-50" bind:value={$user.therapist.firstname}
          fieldID="therapist-firstname" maxlength="35" required>
          Prénom
        </TextField>
        <TextField className="col col-50" bind:value={$user.therapist.lastname}
          fieldID="therapist-lastname" maxlength="35" required>
          Nom
        </TextField>
      </div>
      <TextField bind:value={$user.therapist.street} fieldID="therapist-street" maxlength="35"
        required>
        Rue et n°
      </TextField>
      <div class="row row-xl">
        <TextField className="col col-40" bind:value={$user.therapist.zipcode} fieldID="therapist-zipcode"
          maxlength="9" required>
          NPA
        </TextField>
        <TextField className="col col-60" bind:value={$user.therapist.city}
          fieldID="therapist-city" maxlength="35" required>
          Localité
        </TextField>
      </div>
      <TextField bind:value={$user.therapist.phone} type="tel" fieldID="therapist-phone"
        maxlength="25" required>
        Téléphone
      </TextField>
      <TextField bind:value={$user.therapist.rcc} fieldID="therapist-rcc"
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
