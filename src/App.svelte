<script>
  // eslint-disable-next-line no-unused-vars
  import { authorFixture, therapistFixture, patientsFixture } from './fixtures.mjs'
  import Username from './components/Username/Username.svelte'
  import TextField from './components/TextField/TextField.svelte'
  import UserPanel from './components/UserPanel/UserPanel.svelte'
  import PatientList from './components/PatientList/PatientList.svelte'

  let author = { ...authorFixture } // eslint-disable-line no-unused-vars
  let therapist = { ...therapistFixture } // eslint-disable-line no-unused-vars
  const patients = [...patientsFixture]
  let userPanelOpenned = false // eslint-disable-line no-unused-vars
  let selectedPatient = patients[0] // eslint-disable-line no-unused-vars
  let filterPatient = '' // eslint-disable-line prefer-const, no-unused-vars

  const onToggleUserPanel = () => {
    userPanelOpenned = !userPanelOpenned
  }

  const onUpdateUser = e => {
    author = { ...e.detail.author }
    therapist = { ...e.detail.therapist }
  }

  const onChangePatient = () => {
    selectedPatient = null
  }

  const onPatientSelected = (e) => {
    selectedPatient = patients.find(patient => patient.id === e.detail.patientId)
  }
</script>

<UserPanel openned={userPanelOpenned} {author} {therapist} on:closeUserPanel={onToggleUserPanel}
  on:updateUser={onUpdateUser} />

<header>
  <Username username={author.name} on:openUserPanel={onToggleUserPanel} />
</header>
<main>
  {#if selectedPatient}
    <p>
      Vous éditez votre facture pour <span class="mdc-typography--button" title="Choisir un autre patient"
        on:click={onChangePatient}>
        {selectedPatient.firstName} {selectedPatient.lastName}</span>.
    </p>
  {:else}
    <form class="aposto-form" on:submit|preventDefault={() => { return }}>
      <TextField bind:value={filterPatient} fieldId="patient-search">
        Patient
      </TextField>
    </form>
    <PatientList bind:filterPatient={filterPatient} {patients} on:patientSelected={onPatientSelected} />
  {/if}
</main>

<style src="./App.scss" global></style>
