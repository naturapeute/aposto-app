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
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import { saveUser } from '../../services/UserService'

  export let patient = null

  let filterPatient = ''
  let patientSearchMode = false
  let patientCreateMode = false
  let patientUpdateMode = false
  let succeedPatchSnackbar
  let failedPatchSnackbar

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

    if ($terrapeuteUserID) {
      saveUser($terrapeuteUserID, $author, $therapist, $servicePrice, $preferedServices, $patients)
        .then((_) => {
          patient = { ...newPatient }
          onCloseSearch()
          succeedPatchSnackbar.open()
        })
        .catch((err) => {
          console.error(err)
          failedPatchSnackbar.open()
        })
        .finally(() => {
          $loading = false
        })
    } else {
      patient = { ...newPatient }
      onCloseSearch()
    }
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
    <TextField bind:value={filterPatient} fieldID="patient-search" trailingIcon="close"
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

<Snackbar bind:this={succeedPatchSnackbar}>
  <span slot="label">
    Votre patient a été sauvegardé sur le réseau Terrapeute.
  </span>
</Snackbar>

<Snackbar bind:this={failedPatchSnackbar}>
  <span slot="label">
    La sauvegarde de votre patient auprès du réseau Terrapeute a échoué. Veuillez réessayer...
  </span>
</Snackbar>

<style src="FinalizePatient.scss"></style>
