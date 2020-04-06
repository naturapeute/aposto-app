<script>
  // eslint-disable-next-line no-unused-vars
  import { author, therapist, services, servicePrice } from './js/store'
  import HeaderPanel from './components/HeaderPanel/HeaderPanel.svelte'
  import FinalizePatient from './components/FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from './components/FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import FinalizeServicePrice from './components/FinalizeServicePrice/FinalizeServicePrice.svelte'

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
  <FinalizePatient />
  <FinalizeTherapyDescription />
  <FinalizeServicePrice />
  <p class="total-amount-p">
    Le montant de la facture est de <span class="typography--button-inline total-amount">{totalAmount}CHF</span>.
  </p>
</main>

<style src="App.scss" global></style>
