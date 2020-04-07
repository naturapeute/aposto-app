<script>
  import { createEventDispatcher } from 'svelte'
  import { patients, selectedPatient } from '../../js/store' // eslint-disable-line no-unused-vars

  export let filterPatient

  let bestMatches // eslint-disable-line no-unused-vars
  const dispatch = createEventDispatcher()

  $: bestMatches = getBestMatches(filterPatient)

  const onChipClick = patientId => {
    // eslint-disable-next-line no-undef
    selectedPatient.set($patients.find(patient => patient.id === patientId))
    dispatch('patientSelected')
  }

  function getBestMatches(_filterPatient) {
    return _filterPatient.split(' ').reduce((scores, word) => {
      $patients.forEach((patient, i) => { // eslint-disable-line no-undef
        scores[i].score += getPatientScore(patient, word)
      })

      return scores
    }, initialPatientScores())
      .filter(patient => patient.score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  function initialPatientScores() {
    // eslint-disable-next-line no-undef
    return $patients.map(patient => { return { ...patient, score: 0 } })
  }

  function getPatientScore(patient, word) {
    if (!word) return 0

    return +patient.firstName.toLowerCase().includes(word.toLowerCase()) +
      +patient.lastName.toLowerCase().includes(word.toLowerCase())
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  {#each bestMatches as patient (patient.id)}
    <li class="mdc-chip" role="row" on:click={() => onChipClick(patient.id)}>
      <div class="mdc-chip__ripple"></div>
      <i class="material-icons-round mdc-chip__icon mdc-chip__icon--leading">face</i>
      <span role="gridcell">
        <span role="button" tabindex="0" class="mdc-chip__primary-action">
          <span class="mdc-chip__text">{patient.firstName} {patient.lastName}</span>
        </span>
      </span>
    </li>
  {/each}
</ul>

<style src="PatientList.scss"></style>
