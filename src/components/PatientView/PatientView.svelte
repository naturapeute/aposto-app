<script>
  import TextField from '../TextField/TextField.svelte'
  import PatientList from '../PatientList/PatientList.svelte'

  export let patients

  const typedPatient = { // eslint-disable-line no-unused-vars
    firstName: '',
    lastName: ''
  }
</script>

<h1 class="mdc-typography--headline4">Informations du patient</h1>

<form class="aposto-form">
  <TextField bind:value={typedPatient.firstName} fieldId="patient-first-name">
    Prénom du patient
  </TextField>
  <TextField bind:value={typedPatient.lastName} fieldId="patient-last-name">
    Nom du patient
  </TextField>
</form>

<PatientList bind:filterFirstName={typedPatient.firstName} bind:filterLastName={typedPatient.lastName} {patients} />

<style src="./PatientView.scss"></style>
