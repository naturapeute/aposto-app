<script>
  import TextField from '../TextField/TextField.svelte'
  import PatientList from '../PatientList/PatientList.svelte'

  export let patient = null

  let filterPatient = ''
  let patientSearchMode = !patient

  const onChangePatient = () => {
    patientSearchMode = true
  }

  const onCloseSearch = () => {
    if (patient)
      patientSearchMode = false

    filterPatient = ''
  }

  const onTextFieldMount = e => {
    e.detail.focus()
  }
</script>

{#if patient}
  <p class="finalize-p">
    <i class="material-icons-round">face</i>
    <span class="patient-edit" on:click={onChangePatient}>
      <span class="typography--button-inline" title="Choisir un autre patient">
        {patient.firstName} {patient.lastName}
      </span>
      <i class="material-icons-round edit-icon">edit</i>
    </span>
  </p>
{/if}
{#if patientSearchMode}
  <form class="aposto-form patient-search-form" on:submit|preventDefault={() => {}}>
    <TextField bind:value={filterPatient} fieldId="patient-search" trailingIcon="close"
      on:trailingIconClick={onCloseSearch} on:mount={onTextFieldMount} outlined noAutoComplete>
      Patient
    </TextField>
  </form>
  <PatientList bind:filterPatient={filterPatient} bind:patient on:patientSelected={onCloseSearch} />
{/if}

<style src="FinalizePatient.scss"></style>
