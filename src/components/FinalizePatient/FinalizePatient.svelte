<script>
  import { selectedPatient } from '../../js/store' // eslint-disable-line no-unused-vars
  import TextField from '../TextField/TextField.svelte'
  import PatientList from '../PatientList/PatientList.svelte'

  /* eslint-disable no-unused-vars */
  let filterPatient = '' // eslint-disable-line prefer-const
  let patientSearchMode = false
  /* eslint-enable no-unused-vars */

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
</script>

<p class="selected-patient-p finalize-p">
  <i class="material-icons-round">face</i>
  <span class="patient-edit" on:click={onChangePatient}>
    <span class="typography--button-inline" title="Choisir un autre patient">
      {$selectedPatient.firstName} {$selectedPatient.lastName}
    </span>
    <i class="material-icons-round edit-icon">edit</i>
  </span>
</p>
{#if patientSearchMode}
  <form class="aposto-form patient-search-form" on:submit|preventDefault={() => { return }}>
    <TextField bind:value={filterPatient} fieldId="patient-search" trailingIcon="close"
      on:trailingIconClick={onCloseSearch} on:mount={onTextFieldMount}>
      Patient
    </TextField>
  </form>
  <PatientList bind:filterPatient={filterPatient} on:patientSelected={onCloseSearch} />
{/if}

<style src="FinalizePatient.scss"></style>
