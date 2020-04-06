<script>
  import { createEventDispatcher } from 'svelte'
  import TextField from '../TextField/TextField.svelte'
  import PatientList from '../PatientList/PatientList.svelte'

  export let selectedPatient
  export let patients

  let filterPatient = '' // eslint-disable-line prefer-const, no-unused-vars
  let patientSearchMode = false // eslint-disable-line no-unused-vars
  const dispatch = createEventDispatcher()

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
    dispatch('patientSelected', e.detail)
    onCloseSearch()
  }
</script>

<p class="selected-patient-p">
  Vous éditez votre facture pour <span class="typography--button-inline" title="Choisir un autre patient"
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

<style src="FinalizePatient.scss"></style>
