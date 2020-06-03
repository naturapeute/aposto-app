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
    birthday: getDateInput($selectedPatient.birthday)
  } : {
    firstName: filterPatient.split(' ')[0],
    lastName: filterPatient.split(' ').slice(1).join(' '),
    street: '',
    ZIP: '',
    city: '',
    canton: '',
    gender: '',
    birthday: '',
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
    <div class="col col-50">
      <TextField bind:value={localPatient.firstName} fieldID="patient-first-name"
        maxlength="35" required helperText>
        Prénom

        <span slot="helper-text">
          Le prénom du patient est limité à 35 caractères.
        </span>
      </TextField>
    </div>
    <div class="col col-50">
      <TextField bind:value={localPatient.lastName} fieldID="patient-last-name"
        maxlength="35" required helperText>
        Nom

        <span slot="helper-text">
          Le nom du patient est limité à 35 caractères.
        </span>
      </TextField>
    </div>
  </div>
  <div class="row row-xs">
    <TextField className="col col-60" bind:value={localPatient.birthday} type="date"
      fieldID="patient-birthday" required>
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
  <TextField bind:value={localPatient.street} fieldID="patient-street" maxlength="70" required
    helperText>
    Rue et n°

    <span slot="helper-text">
      L'adresse postale du patient est limitée à 70 caractères.
    </span>
  </TextField>
  <TextField bind:value={localPatient.city} fieldID="patient-city" maxlength="35" required
    helperText>
    Localité

    <span slot="helper-text">
      La ville du patient est limitée à 35 caractères.
    </span>
  </TextField>
  <div class="row row-xs">
    <div class="col col-50">
      <TextField bind:value={localPatient.ZIP} fieldID="patient-zip"
        maxlength="16" required helperText>
        NPA

        <span slot="helper-text">
          Le code postal du patient est limité à 16 caractères.
        </span>
      </TextField>
    </div>
    <Select className="col col-50" bind:value={localPatient.canton} fieldID="patient-canton"
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
