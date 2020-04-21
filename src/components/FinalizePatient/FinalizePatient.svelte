<script>
  import { patients } from '../../js/store'
  import TextField from '../TextField/TextField.svelte'
  import PatientList from '../PatientList/PatientList.svelte'
  import PatientForm from '../PatientForm/PatientForm.svelte'

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
    patient = { ...newPatient }
    onCloseSearch()
  }
</script>

{#if patient}
  <p class="finalize-p">
    <i class="material-icons-outlined">face</i>
    <span class="patient-edit" on:click={onChangePatient}>
      <span class="typography--button-inline" title="Choisir un autre patient">
        {patient.firstName} {patient.lastName}
      </span>
      <i class="material-icons-outlined edit-icon">edit</i>
    </span>
  </p>
{/if}
{#if !patient || patientSearchMode}
  <form class="aposto-form patient-search-form" on:submit|preventDefault={() => {}}>
    <TextField bind:value={filterPatient} fieldId="patient-search" trailingIcon="close"
      placeholder="Rechercher un patient..."
      on:trailingIconClick={onCloseSearch} on:mount={onTextFieldMount} outlined noAutoComplete>
      Patient
    </TextField>
  </form>
  <PatientList bind:filterPatient={filterPatient} bind:patient on:patientSelected={onCloseSearch}
    on:createPatient={onCreatePatient} />
{/if}
{#if patientCreateMode}
  <PatientForm {filterPatient} on:patientCreated={onPatientCreated} />
{/if}

<style src="FinalizePatient.scss"></style>
