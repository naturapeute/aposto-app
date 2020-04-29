<script>
  import { createEventDispatcher } from 'svelte'
  import { terrapeuteUserID, author, therapist, loading } from '../../js/store'
  import Button from '../Button/Button.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import { authenticate } from '../../services/UserService'

  let email
  let failedAuthentificationSnackbar
  const dispatch = createEventDispatcher()

  function onAuthenticate() {
    $loading = true

    authenticate(email)
      .then((body) => {
        $author.email = body.email
        $author.phone = body.phone
        $therapist.firstName = body.firstname
        $therapist.lastName = body.lastname
        $therapist.email = body.email
        $therapist.phone = body.phone

        if (body.offices.length) {
          $author.street = body.offices[0].street
          $author.ZIP = body.offices[0].zipCode
          $author.city = body.offices[0].city
          $therapist.street = body.offices[0].street
          $therapist.ZIP = body.offices[0].zipCode
          $therapist.city = body.offices[0].city
        }

        $terrapeuteUserID = body.id

        onAuthentificationDone()
      })
      .catch((err) => {
        console.error(err)
        failedAuthentificationSnackbar.open()
      })
      .finally(() => {
        $loading = false
      })
  }

  function onAuthentificationDone() {
    dispatch('done')
  }
</script>

<form class="aposto-form" on:submit|preventDefault={onAuthenticate}>
  <TextField bind:value={email} type="email" fieldId="authentification-email" required>
    Email
  </TextField>
  <Button type="submit" title="Se connecter via le réseau Terrapeute" unelevated
    disabled={$loading}>
    Se connecter via Terrapeute
  </Button>
  <a class="mdc-button" href="https://pro.terrapeute.ch/join">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">
      Rejoindre Terrapeute
    </span>
  </a>
  <Button title="Essayer en démo" on:click={onAuthentificationDone} disabled={$loading}>
    Essayer en démo
  </Button>
  <p class="demo-hint">
    En mode démo, vous avez accès à l'intégralité de l'application, mais aucune de vos informations
    n'est enregistrée. Vous devrez donc saisir de nouveau cos informations de thérapeute la
    prochaine fois que vous revenez.
  </p>
</form>

<Snackbar bind:this={failedAuthentificationSnackbar}>
  <span slot="label">
    Votre authentification auprès de du réseau Terrapeute a échoué. Assurez-vous d'être bien inscrit
    dans le réseau.
  </span>
</Snackbar>

<style src="AuthentificationForm.scss"></style>
