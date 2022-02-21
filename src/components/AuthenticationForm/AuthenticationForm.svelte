<script>
  import { createEventDispatcher } from 'svelte'

  import {
    user,
    loading,
    patients
  } from '../../js/store'
  import { authenticate, saveUser } from '../../services/UserService'
  import Button from '../Button/Button.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import TextField from '../TextField/TextField.svelte'

  export function authenticateNaturapeute(naturapeuteEmail) {
    email = naturapeuteEmail
    $loading = true
    authenticate(email)
      .then((body) => {
        saveAuthenticatedUser(body)
        user.initUpdated()
        onAuthenticationDone()
      })
      .catch((_) => {
        onAuthenticationFailed()
      })
      .finally(() => {
        $loading = false
      })
  }

  let email
  let failedAuthenticationSnackbar
  const dispatch = createEventDispatcher()

  function saveAuthenticatedUser(body) {
    $user.naturapeuteID = body.id

    $user.author.email = body.email
    $user.author.phone = body.phone
    $user.therapist.firstname = body.firstname
    $user.therapist.lastname = body.lastname
    $user.therapist.phone = body.phone

    const office = body.offices[0]

    if (office) {
      $user.author.street = office.street
      $user.author.city = office.city
      $user.author.zipcode = office.zipcode
      $user.therapist.street = office.street
      $user.therapist.city = office.city
      $user.therapist.zipcode = office.zipcode
    }

    if(body.invoice_data.author.name) $user.author.name = body.invoice_data.author.name
    if(body.invoice_data.author.street) $user.author.street = body.invoice_data.author.street
    if(body.invoice_data.author.zipcode) $user.author.zipcode = body.invoice_data.author.zipcode
    if(body.invoice_data.author.city) $user.author.city = body.invoice_data.author.city
    if(body.invoice_data.author.email) $user.author.email = body.invoice_data.author.email
    if(body.invoice_data.author.phone) $user.author.phone = body.invoice_data.author.phone
    if(body.invoice_data.author.iban) $user.author.iban = body.invoice_data.author.iban
    if(body.invoice_data.author.rcc) $user.author.rcc = body.invoice_data.author.rcc

    if(body.invoice_data.therapist.firstname) $user.therapist.firstname = body.invoice_data.therapist.firstname
    if(body.invoice_data.therapist.lastname) $user.therapist.lastname = body.invoice_data.therapist.lastname
    if(body.invoice_data.therapist.street) $user.therapist.street = body.invoice_data.therapist.street
    if(body.invoice_data.therapist.city) $user.therapist.city = body.invoice_data.therapist.city
    if(body.invoice_data.therapist.zipcode) $user.therapist.zipcode = body.invoice_data.therapist.zipcode
    if(body.invoice_data.therapist.phone) $user.therapist.phone = body.invoice_data.therapist.phone
    if(body.invoice_data.therapist.rcc) $user.therapist.rcc = body.invoice_data.therapist.rcc

    if(body.invoice_data.hourly_price) $user.servicePrice = body.invoice_data.hourly_price
    if(body.invoice_data.services) $user.preferredServices = body.invoice_data.services.map(e => ({ ...e }))
    $patients = body.patients.map(e => ({ ...e }))

    if ($user.naturapeuteID) {
      saveUser(
        $user.naturapeuteID,
        $user.author,
        $user.therapist,
        $user.servicePrice,
        $user.preferredServices,
        $patients
      )
    }
  }

  function onAuthenticate() {
    authenticateNaturapeute(email)
  }

  function onAuthenticationDone() {
    if (email && !window.localStorage.getItem('naturapeuteEmail'))
      window.localStorage.setItem('naturapeuteEmail', email)

    dispatch('done')
  }

  function onAuthenticationFailed() {
    failedAuthenticationSnackbar.open()

    if (window.localStorage.getItem('naturapeuteEmail'))
      window.localStorage.removeItem('naturapeuteEmail')

    dispatch('failed')
  }

  function onDemoMode() {
    saveAuthenticatedUser({
      email: 'john.doe@email.com',
      phone: '0313172521',
      firstname: 'John',
      lastname: 'Doe',
      offices: [],
      invoice_data: {
        author: {
          name: 'Cabinet de John',
          street: 'Rue de Bourgogne 19',
          zipcode: '1203',
          city: 'Genf',
          iban: '6689144926855958782',
          rcc: 'A123456'
        },
        therapist: {
          street: 'Rue de Bourgogne 19',
          zipcode: '1203',
          city: 'Genf',
          rcc: 'A123456'
        },
        hourly_price: 100,
        services: [
          { code: 1200, color: '#f46d6d' },
          { code: 1140, color: '#75b79e' },
          { code: 1089, color: '#f8a978' },
          { code: 1005, color: '#424874' }
        ]
      },
      patients: [
        {
          id: 1234567890,
          firstname: 'Joe',
          lastname: 'Doakes',
          birthdate: 45270000000,
          gender: 'man',
          email: 'joe.doakes@email.com',
          street: 'Avenue de Rheinau 8',
          zipcode: '1304',
          city: 'Werdenberg',
          canton: 'AG'
        }
      ]
    })
    user.initUpdated()
    onAuthenticationDone()
  }
</script>

<form class="aposto-form" on:submit|preventDefault={onAuthenticate}>
  <TextField bind:value={email} type="email" fieldID="authentication-email" required>
    Email
  </TextField>
  <Button className="connect-button" type="submit" title="Se connecter via le réseau Naturapeute" unelevated
    disabled={$loading}>
    Se connecter avec Naturapeute
  </Button>
  <a class="mdc-button" href="https://pro.naturapeute.ch/join">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">
      Rejoindre Naturapeute
    </span>
  </a>
  <Button title="Essayer en démo" on:click={onDemoMode} disabled={$loading}>
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
    Votre connexion auprès du réseau Naturapeute a échoué. Assurez-vous d'être bien inscrit auprès du
    réseau et d'avoir renseigné l'adresse mail correspondant à votre inscription.
  </span>
</Snackbar>

<style src="AuthenticationForm.scss"></style>
