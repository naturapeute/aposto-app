<script>
  // eslint-disable-next-line no-unused-vars
  import { author, therapist, services, servicePrice } from './js/store'
  import HeaderPanel from './components/HeaderPanel/HeaderPanel.svelte'
  import FinalizePatient from './components/FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from './components/FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'

  let totalAmount // eslint-disable-line no-unused-vars

  /* eslint-disable no-undef */
  $: totalAmount = $services.reduce(
    (total, service) => total + (service.duration * $servicePrice / 60),
    0
  )
  /* eslint-enable no-undef */

  const onUpdateUser = e => {
    author.set({ ...e.detail.author })
    therapist.set({ ...e.detail.therapist })
  }
</script>

<HeaderPanel on:updateUser={onUpdateUser} />
<main>
  <div class="mdc-card">
    <div class="card-subsection">
      <h2 class="mdc-typography--headline5 finalize-headline">
        Finalisation de votre facture
      </h2>
    </div>
    <div class="card-subsection">
      <FinalizePatient />
    </div>
    <div class="card-subsection">
      <FinalizeTherapyDescription />
    </div>
    <div class="card-subsection">
      <p class="total-amount-p finalize-p">
        <i class="material-icons-round">monetization_on</i>
        <span class="typography--button-inline total-amount">
          {totalAmount.toFixed(2)}CHF
        </span>
      </p>
    </div>
  </div>
</main>

<style src="App.scss" global></style>
