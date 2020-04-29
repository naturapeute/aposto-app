<script>
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'
  import { getCantonOptions, getGenderOptions } from '../../js/utils'
  import TextField from '../TextField/TextField.svelte'
  import Select from '../Select/Select.svelte'
  import Button from '../Button/Button.svelte'

  export let filterPatient

  const patient = {
    firstName: filterPatient.split(' ')[0],
    lastName: filterPatient.split(' ').slice(1).join(' '),
    street: '',
    ZIP: '',
    city: '',
    canton: '',
    gender: '',
    birthdate: '',
    email: ''
  }
  const dispatch = createEventDispatcher()

  function onPatientCreated() {
    dispatch('patientCreated', patient)
  }
</script>

<form class="aposto-form" on:submit|preventDefault={onPatientCreated} transition:slide>
  <div class="row row-xs">
    <TextField className="col-50" bind:value={patient.firstName} fieldId="patient-first-name"
      required>
      Prénom
    </TextField>
    <TextField className="col-50" bind:value={patient.lastName} fieldId="patient-last-name"
      required>
      Nom
    </TextField>
  </div>
  <div class="row row-xs">
    <TextField className="col-60" bind:value={patient.birthdate} type="date"
      fieldId="patient-birthdate" required>
      Date de naissance
    </TextField>
    <Select className="col-40" bind:value={patient.gender} fieldId="patient-gender"
      options={getGenderOptions()} required>
      Sexe
    </Select>
  </div>
  <TextField bind:value={patient.email} type="email" fieldId="patient-email" required>
    Email
  </TextField>
  <TextField bind:value={patient.street} fieldId="patient-street" required>
    Rue et n°
  </TextField>
  <TextField bind:value={patient.city} fieldId="patient-city" required>
    Localité
  </TextField>
  <div class="row row-xs">
    <TextField className="col-50" bind:value={patient.ZIP} fieldId="patient-zip" required>
      NPA
    </TextField>
    <Select className="col-50" bind:value={patient.canton} fieldId="patient-canton"
      options={getCantonOptions()} required>
      Canton
    </Select>
  </div>
  <Button type="submit" title="Enregistrer les modifications" unelevated>
    Créer
  </Button>
</form>

<style src="PatientForm.scss"></style>
