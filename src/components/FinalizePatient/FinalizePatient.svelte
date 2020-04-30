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
  import IconButton from '../IconButton/IconButton.svelte'
  import { saveUser } from '../../services/UserService'

  export let patient = null

  let filterPatient = ''
  let patientSearchMode = false
  let patientCreateMode = false
  let patientUpdateMode = false

  function onChangePatient() {
    patientSearchMode = true
    patientCreateMode = false
    patientUpdateMode = false
  }

  function onUpdatePatient() {
    patientUpdateMode = true
  }

  function onCloseSearch() {
    if (patient)
      patientSearchMode = false

    patientCreateMode = false
    patientUpdateMode = false
    filterPatient = ''
  }

  function onTextFieldMount(e) {
    e.detail.focus()
  }

  function onCreatePatient() {
    patientCreateMode = true
  }

  function onPatientUpdatedOrCreated(e) {
    const newPatient = {
      ...e.detail,
      birthdate: new Date(e.detail.birthdate).getTime()
    }

    if (patientCreateMode) {
      $patients = [newPatient, ...$patients]
      patientCreateMode = false
    }

    if (patientUpdateMode) {
      const patientToUpdate = $patients.find(patient => patient.id === newPatient.id)

      Object.keys(patientToUpdate).forEach(key => {
        if (key !== 'id')
          patientToUpdate[key] = newPatient[key]
      })

      patientUpdateMode = false
    }

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
    <strong class="typography--button-inline">
      {patient.firstName} {patient.lastName}
    </strong>
    <IconButton title="Mettre à jour les informations de {patient.firstName} {patient.lastName}"
      on:click={onUpdatePatient}>
      edit
    </IconButton>
    <IconButton title="Choisir un autre patient" on:click={onChangePatient}>
      search
    </IconButton>
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
    <PatientList {filterPatient} bind:patient on:patientSelected={onCloseSearch}
      on:createPatient={onCreatePatient} />
  {/if}
{/if}
{#if patientUpdateMode || patientCreateMode}
  <PatientForm {filterPatient} patient={patientUpdateMode ? patient : null}
    on:patientUpdatedOrCreated={onPatientUpdatedOrCreated} />
{/if}

<style src="FinalizePatient.scss"></style>
