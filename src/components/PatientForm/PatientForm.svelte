<script>
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'

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
    firstName: filterPatient.split(' ')[0],
    lastName: filterPatient.split(' ').slice(1).join(' '),
    street: '',
    ZIP: '',
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

<form class="aposto-form" on:submit|preventDefault={onPatientUpdatedOrCreated} transition:slide>
  <div class="row row-xs">
    <TextField className="col-50" bind:value={localPatient.firstName} fieldID="patient-first-name"
      required>
      Prénom
    </TextField>
    <TextField className="col-50" bind:value={localPatient.lastName} fieldID="patient-last-name"
      required>
      Nom
    </TextField>
  </div>
  <div class="row row-xs">
    <TextField className="col-60" bind:value={localPatient.birthdate} type="date"
      fieldID="patient-birthdate" required>
      Date de naissance
    </TextField>
    <Select className="col-40" bind:value={localPatient.gender} fieldID="patient-gender"
      options={genderOptions} required>
      Sexe
    </Select>
  </div>
  <TextField bind:value={localPatient.email} type="email" fieldID="patient-email" required>
    Email
  </TextField>
  <TextField bind:value={localPatient.street} fieldID="patient-street" required>
    Rue et n°
  </TextField>
  <TextField bind:value={localPatient.city} fieldID="patient-city" required>
    Localité
  </TextField>
  <div class="row row-xs">
    <TextField className="col-50" bind:value={localPatient.ZIP} fieldID="patient-zip" required>
      NPA
    </TextField>
    <Select className="col-50" bind:value={localPatient.canton} fieldID="patient-canton"
      options={getCantonOptions()} required>
      Canton
    </Select>
  </div>
  {#if updateMode}
    <Button type="submit"
      title="Mettre à jour les informations de {localPatient.firstName} {localPatient.lastName}"
      unelevated>
      Mettre à jour
    </Button>
  {:else}
    <Button type="submit" title="Créer le patient {localPatient.firstName} {localPatient.lastName}"
      unelevated>
      Créer
    </Button>
  {/if}
</form>

<style src="PatientForm.scss"></style>
