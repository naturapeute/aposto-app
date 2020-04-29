<script>
  import { slide } from 'svelte/transition'
  import {
    terrapeuteUserID,
    author,
    therapist,
    servicePrice,
    preferedServices,
    patients,
    loading
  } from '../../js/store'
  import TextField from '../TextField/TextField.svelte'
  import PatientList from '../PatientList/PatientList.svelte'
  import PatientForm from '../PatientForm/PatientForm.svelte'
  import { saveUser } from '../../services/UserService'

  export let patient = null

  let filterPatient = ''
  let patientSearchMode = false
  let patientCreateMode = false

  function onChangePatient() {
    patientSearchMode = true
  }

  function onCloseSearch() {
    if (patient)
      patientSearchMode = false

    patientCreateMode = false
    filterPatient = ''
  }

  function onTextFieldMount(e) {
    e.detail.focus()
  }

  function onCreatePatient() {
    patientCreateMode = true
  }

  function onPatientCreated(e) {
    const newPatient = {
      ...e.detail,
      birthdate: new Date(e.detail.birthdate).getTime()
    }

    patientCreateMode = false
    $patients = [newPatient, ...$patients]
    $loading = true

    saveUser($terrapeuteUserID, $author, $therapist, $servicePrice, $preferedServices, $patients)
      .then((_) => {
        // TODO
      })
      .catch((err) => {
        console.error(err)
        // TODO
      })
      .finally(() => {
        $loading = false
      })

    patient = { ...newPatient }
    onCloseSearch()
  }
</script>

{#if patient}
  <p class="finalize-p">
    <i class="material-icons-outlined">face</i>
    <button type="button" class="typography--button-inline patient-edit"
      title="Choisir un autre patient" on:click={onChangePatient}>
      {patient.firstName} {patient.lastName}
      <i class="material-icons-outlined edit-icon">edit</i>
    </button>
  </p>
{/if}
{#if !patient || patientSearchMode}
  <form class="aposto-form patient-search-form" on:submit|preventDefault transition:slide>
    <TextField bind:value={filterPatient} fieldId="patient-search" trailingIcon="close"
      placeholder="Rechercher un patient..."
      on:trailingIconClick={onCloseSearch} on:mount={onTextFieldMount} outlined noAutoComplete>
      Patient
    </TextField>
  </form>
  {#if !patientCreateMode}
    <PatientList filterPatient={filterPatient} bind:patient on:patientSelected={onCloseSearch}
      on:createPatient={onCreatePatient} />
  {/if}
  {#if patientCreateMode}
    <PatientForm {filterPatient} on:patientCreated={onPatientCreated} />
  {/if}
{/if}

<style src="FinalizePatient.scss"></style>
