<script>
  import { createEventDispatcher } from 'svelte'

  import { selectedPatient } from '../../js/store'
  import { genderOptions, getCantonOptions, getDateInput } from '../../js/utils'
  import Button from '../Button/Button.svelte'
  import Select from '../Select/Select.svelte'
  import TextField from '../TextField/TextField.svelte'

  export let filterPatient
  export let updateMode

  const localPatient = updateMode ? {
    ...$selectedPatient,
    birthdate: getDateInput($selectedPatient.birthdate)
  } : {
    firstname: filterPatient.split(' ')[0],
    lastname: filterPatient.split(' ').slice(1).join(' '),
    street: '',
    zipcode: '',
    city: '',
    canton: '',
    gender: '',
    birthdate: '',
    email: '',
    id: Date.now()
  }

  const dispatch = createEventDispatcher()

  function onPatientUpdatedOrCreated() {
    dispatch('patientUpdatedOrCreated', localPatient)
  }
</script>

<form class="aposto-form" on:submit|preventDefault={onPatientUpdatedOrCreated}>
  <div class="row row-xs">
    <TextField className="col col-50" bind:value={localPatient.firstname}
      fieldID="patient-firstname" maxlength="35" required>
      Prénom
    </TextField>
    <TextField className="col col-50" bind:value={localPatient.lastname}
      fieldID="patient-lastname" maxlength="35" required>
      Nom
    </TextField>
  </div>
  <div class="row row-xs">
    <TextField className="col col-60" bind:value={localPatient.birthdate} type="date"
      fieldID="patient-birthdate" required>
      Date de naissance
    </TextField>
    <Select className="col col-40" bind:value={localPatient.gender} fieldID="patient-gender"
      options={genderOptions} required>
      Sexe
    </Select>
  </div>
  <TextField bind:value={localPatient.email} type="email" fieldID="patient-email" required>
    Email
  </TextField>
  <TextField bind:value={localPatient.street} fieldID="patient-street" maxlength="35" required>
    Rue et n°
  </TextField>
  <TextField bind:value={localPatient.city} fieldID="patient-city" maxlength="35" required>
    Localité
  </TextField>
  <div class="row row-xs">
    <TextField className="col col-50" bind:value={localPatient.zipcode} fieldID="patient-zipcode"
      maxlength="9" required>
      NPA
    </TextField>
    <Select className="col col-50" bind:value={localPatient.canton} fieldID="patient-canton"
      options={getCantonOptions()} required>
      Canton
    </Select>
  </div>
  {#if updateMode}
    <Button type="submit"
      title="Mettre à jour les informations de {localPatient.firstname} {localPatient.lastname}"
      unelevated>
      Mettre à jour
    </Button>
  {:else}
    <Button type="submit" title="Créer le patient {localPatient.firstname} {localPatient.lastname}"
      unelevated>
      Créer
    </Button>
  {/if}
</form>

<style src="PatientForm.scss"></style>
