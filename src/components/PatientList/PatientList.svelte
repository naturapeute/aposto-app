<script>
  import { createEventDispatcher, beforeUpdate } from 'svelte'

  export let patients
  export let filterFirstName
  export let filterLastName

  let bestMatches // eslint-disable-line no-unused-vars
  const dispatch = createEventDispatcher()

  beforeUpdate(() => {
    bestMatches = patients.filter(patient => {
      if (!filterFirstName && !filterLastName) return true

      if (!filterFirstName) return patient.lastName.includes(filterLastName)

      if (!filterLastName) return patient.firstName.includes(filterFirstName)

      return patient.firstName.includes(filterFirstName) &&
        patient.lastName.includes(filterLastName)
    }).slice(0, 6)
  })

  const onChipClick = (patientId) => {
    dispatch('patientSelected', { patientId })
  }
</script>

<h2 class="mdc-typography--headline6">Mes patients</h2>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  {#each bestMatches as patient}
    <li class="mdc-chip" role="row" on:click={() => onChipClick(patient.id)}>
      <div class="mdc-chip__ripple"></div>
      <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">face</i>
      <span role="gridcell">
        <span role="button" tabindex="0" class="mdc-chip__primary-action">
          <span class="mdc-chip__text">{patient.firstName} {patient.lastName}</span>
        </span>
      </span>
    </li>
  {/each}
</ul>

<style src="./PatientList.scss"></style>
