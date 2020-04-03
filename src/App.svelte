<script>
  import { beforeUpdate } from 'svelte'
  import {
    authorFixture,
    therapistFixture,
    patientsFixture,
    servicesFixture,
    servicePriceFixture
  } from './fixtures.mjs'
  import Username from './components/Username/Username.svelte'
  import UserPanel from './components/UserPanel/UserPanel.svelte'
  import TextField from './components/TextField/TextField.svelte'
  import PatientList from './components/PatientList/PatientList.svelte'
  import FinalizeTherapyDescription
    from './components/FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import FinalizeServicePrice from './components/FinalizeServicePrice/FinalizeServicePrice.svelte'

  let author = { ...authorFixture } // eslint-disable-line no-unused-vars
  let therapist = { ...therapistFixture } // eslint-disable-line no-unused-vars
  const patients = [...patientsFixture]
  const services = [...servicesFixture] // eslint-disable-line no-unused-vars
  let servicePrice = servicePriceFixture // eslint-disable-line prefer-const
  let userPanelOpenned = false // eslint-disable-line no-unused-vars
  let selectedPatient = patients[0] // eslint-disable-line no-unused-vars
  let filterPatient = '' // eslint-disable-line prefer-const, no-unused-vars
  let patientSearchMode = false // eslint-disable-line no-unused-vars
  let totalAmount // eslint-disable-line no-unused-vars

  beforeUpdate(() => {
    totalAmount = services.reduce(
      (total, service) => total + (service.duration * servicePrice / 60),
      0
    )
  })

  const onToggleUserPanel = () => {
    userPanelOpenned = !userPanelOpenned
  }

  const onUpdateUser = e => {
    author = { ...e.detail.author }
    therapist = { ...e.detail.therapist }
  }

  const onChangePatient = () => {
    patientSearchMode = true
  }

  const onCloseSearch = () => {
    patientSearchMode = false
    filterPatient = ''
  }

  const onTextFieldMount = e => {
    e.detail.focus()
  }

  const onPatientSelected = e => {
    selectedPatient = patients.find(patient => patient.id === e.detail.patientId)
    onCloseSearch()
  }
</script>

<UserPanel openned={userPanelOpenned} {author} {therapist} on:closeUserPanel={onToggleUserPanel}
  on:updateUser={onUpdateUser} />

<header>
  <Username username={author.name} on:openUserPanel={onToggleUserPanel} />
</header>
<main>
  <p class="selected-patient-p`">
    Vous éditez votre facture pour <span class="mdc-typography--button" title="Choisir un autre patient"
      on:click={onChangePatient}>
      {selectedPatient.firstName} {selectedPatient.lastName}</span>.
  </p>
  {#if patientSearchMode}
    <form class="aposto-form patient-search-form" on:submit|preventDefault={() => { return }}>
      <TextField bind:value={filterPatient} fieldId="patient-search" trailingIcon="close"
        on:trailingIconClick={onCloseSearch} on:mount={onTextFieldMount}>
        Patient
      </TextField>
    </form>
    <PatientList bind:filterPatient={filterPatient} {patients} on:patientSelected={onPatientSelected} />
  {/if}
  <FinalizeTherapyDescription {services} />
  <FinalizeServicePrice bind:servicePrice />
  <p class="total-amount-p">
    Le montant de la facture est de <span class="mdc-typography--button total-amount">{totalAmount}CHF</span>.
  </p>
</main>

<style src="App.scss" global></style>
