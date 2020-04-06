<script>
  import { beforeUpdate } from 'svelte'
  import {
    authorFixture,
    therapistFixture,
    patientsFixture,
    servicesFixture,
    servicePriceFixture
  } from 'js/fixtures'
  import HeaderPanel from './components/HeaderPanel/HeaderPanel.svelte'
  import FinalizePatient from './components/FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from './components/FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import FinalizeServicePrice from './components/FinalizeServicePrice/FinalizeServicePrice.svelte'

  let author = { ...authorFixture } // eslint-disable-line no-unused-vars
  let therapist = { ...therapistFixture } // eslint-disable-line no-unused-vars
  const patients = [...patientsFixture]
  const services = [...servicesFixture] // eslint-disable-line no-unused-vars
  let servicePrice = servicePriceFixture // eslint-disable-line prefer-const
  let selectedPatient = patients[0] // eslint-disable-line no-unused-vars
  let totalAmount // eslint-disable-line no-unused-vars

  beforeUpdate(() => {
    totalAmount = services.reduce(
      (total, service) => total + (service.duration * servicePrice / 60),
      0
    )
  })

  const onUpdateUser = e => {
    author = { ...e.detail.author }
    therapist = { ...e.detail.therapist }
  }

  const onPatientSelected = e => {
    selectedPatient = patients.find(patient => patient.id === e.detail)
  }
</script>

<HeaderPanel {author} {therapist} on:updateUser={onUpdateUser} />
<main>
  <FinalizePatient bind:selectedPatient {patients} on:patientSelected={onPatientSelected} />
  <FinalizeTherapyDescription {services} />
  <FinalizeServicePrice bind:servicePrice />
  <p class="total-amount-p">
    Le montant de la facture est de <span class="typography--button-inline total-amount">{totalAmount}CHF</span>.
  </p>
</main>

<style src="App.scss" global></style>
