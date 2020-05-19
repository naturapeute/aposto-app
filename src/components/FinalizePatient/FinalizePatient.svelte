<script>
  import { loading, patients, selectedPatient, user } from '../../js/store'
  import { saveUser } from '../../services/UserService'
  import IconButton from '../IconButton/IconButton.svelte'
  import PatientForm from '../PatientForm/PatientForm.svelte'
  import PatientList from '../PatientList/PatientList.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'
  import TextField from '../TextField/TextField.svelte'

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
    if ($selectedPatient)
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

    if ($user.terrapeuteID) {
      $loading = true

      saveUser(
        $user.terrapeuteID,
        $user.author,
        $user.therapist,
        $user.servicePrice,
        $user.preferredServices,
        $patients
      )
        .then((_) => {
          $selectedPatient = { ...newPatient }
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
      $selectedPatient = { ...newPatient }
      onCloseSearch()
    }
  }
</script>

{#if $selectedPatient}
  <p class="finalize-p">
    <i class="material-icons-outlined">face</i>
    <strong class="typography--button-inline">
      {$selectedPatient.firstName} {$selectedPatient.lastName}
    </strong>
    <IconButton title="Mettre à jour les informations de {$selectedPatient.firstName} {$selectedPatient.lastName}"
      on:click={onUpdatePatient}>
      edit
    </IconButton>
    <IconButton title="Choisir un autre patient" on:click={onChangePatient}>
      search
    </IconButton>
  </p>
{/if}
{#if !$selectedPatient || patientSearchMode}
  <h2 class="mdc-typography--subtitle1">
    Pour quel patient éditez-vous cette facture ?
  </h2>
  <form class="aposto-form patient-search-form" on:submit|preventDefault>
    <TextField bind:value={filterPatient} fieldID="patient-search" trailingIcon="close"
      placeholder="Rechercher un patient..."
      on:trailingIconClick={onCloseSearch} on:mount={onTextFieldMount} outlined noAutoComplete>
      Rechercher un patient...
    </TextField>
  </form>
  {#if !patientCreateMode}
    <PatientList {filterPatient} on:patientSelected={onCloseSearch}
      on:createPatient={onCreatePatient} />
  {/if}
{/if}
{#if patientUpdateMode || patientCreateMode}
  <PatientForm {filterPatient} updateMode={patientUpdateMode}
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
