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
  <TextField bind:value={patient.firstName} fieldId="patient-first-name" required>
    Prénom
  </TextField>
  <TextField bind:value={patient.lastName} fieldId="patient-last-name" required>
    Nom
  </TextField>
  <TextField bind:value={patient.street} fieldId="patient-street" required>
    Rue et n°
  </TextField>
  <TextField bind:value={patient.ZIP} fieldId="patient-zip" required>
    NPA
  </TextField>
  <TextField bind:value={patient.city} fieldId="patient-city" required>
    Localité
  </TextField>
  <Select bind:value={patient.canton} fieldId="patient-canton" options={getCantonOptions()}
    required>
    Canton
  </Select>
  <Select bind:value={patient.gender} fieldId="patient-gender" options={getGenderOptions()}
    required>
    Sexe
  </Select>
  <TextField bind:value={patient.birthdate} type="date" fieldId="patient-birthdate"
    trailingIcon="event" required>
    Date de naissance
  </TextField>
  <TextField bind:value={patient.email} type="email" fieldId="patient-email" required>
    Email
  </TextField>
  <Button type="submit" title="Enregistrer les modifications">
    Créer
  </Button>
</form>
