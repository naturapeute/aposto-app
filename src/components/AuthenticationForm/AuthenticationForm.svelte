<script>
  import { createEventDispatcher } from 'svelte'

  import {
    user,
    loading,
    patients
  } from '../../js/store'
  import { authenticate } from '../../services/UserService'
  import Button from '../Button/Button.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import TextField from '../TextField/TextField.svelte'

  let email
  let failedAuthenticationSnackbar
  const dispatch = createEventDispatcher()

  function onAuthenticate() {
    $loading = true

    authenticate(email)
      .then((body) => {
        $user.author.email = body.email
        $user.author.phone = body.phone
        $user.therapist.firstName = body.firstname
        $user.therapist.lastName = body.lastname
        $user.therapist.phone = body.phone

        if (body.offices.length) {
          $user.author.street = body.offices[0].street
          $user.author.city = body.offices[0].city
          $user.author.ZIP = body.offices[0].zipCode
          $user.therapist.street = body.offices[0].street
          $user.therapist.city = body.offices[0].city
          $user.therapist.ZIP = body.offices[0].zipCode
        }

        $user.terrapeuteUserID = body.id

        if (body.extraData) {
          if (body.extraData.author) {
            body.extraData.author.name && ($user.author.name = body.extraData.author.name)
            body.extraData.author.street && ($user.author.street = body.extraData.author.street)
            body.extraData.author.ZIP && ($user.author.ZIP = body.extraData.author.ZIP)
            body.extraData.author.city && ($user.author.city = body.extraData.author.city)
            body.extraData.author.email && ($user.author.email = body.extraData.author.email)
            body.extraData.author.phone && ($user.author.phone = body.extraData.author.phone)
            body.extraData.author.RCC && ($user.author.RCC = body.extraData.author.RCC)
          }

          if (body.extraData.therapist) {
            body.extraData.therapist.firstName &&
              ($user.therapist.firstName = body.extraData.therapist.firstName)
            body.extraData.therapist.lastName &&
              ($user.therapist.lastName = body.extraData.therapist.lastName)
            body.extraData.therapist.street &&
              ($user.therapist.street = body.extraData.therapist.street)
            body.extraData.therapist.city && ($user.therapist.city = body.extraData.therapist.city)
            body.extraData.therapist.ZIP && ($user.therapist.ZIP = body.extraData.therapist.ZIP)
            body.extraData.therapist.phone && ($user.therapist.phone = body.extraData.therapist.phone)
            body.extraData.therapist.RCC && ($user.therapist.RCC = body.extraData.therapist.RCC)
          }

          body.extraData.servicePrice && ($user.servicePrice = body.extraData.servicePrice)

          body.extraData.preferredServices &&
            ($user.preferredServices = body.extraData.preferredServices.map(e => ({ ...e })))

          body.extraData.patients &&
            ($patients = body.extraData.patients.map(e => ({ ...e })))
        }

        onAuthenticationDone()
      })
      .catch((_) => {
        failedAuthenticationSnackbar.open()
      })
      .finally(() => {
        $loading = false
      })
  }

  function onAuthenticationDone() {
    dispatch('done')
  }
</script>

<form class="aposto-form" on:submit|preventDefault={onAuthenticate}>
  <TextField bind:value={email} type="email" fieldID="authentication-email" required>
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
  <Button title="Essayer en démo" on:click={onAuthenticationDone} disabled={$loading}>
    Essayer en démo
  </Button>
  <p class="demo-hint">
    En mode démo, vous avez accès à l'intégralité de l'application, mais aucune de vos informations
    n'est enregistrée. Vous devrez donc saisir de nouveau vos informations de thérapeute la
    prochaine fois que vous revenez.
  </p>
</form>

<Snackbar bind:this={failedAuthenticationSnackbar}>
  <span slot="label">
    Votre connexion auprès du réseau Terrapeute a échoué. Assurez-vous d'être bien inscrit auprès du
    réseau et d'avoir renseigné l'adresse mail correspondant à votre inscription.
  </span>
</Snackbar>

<style src="AuthenticationForm.scss"></style>
