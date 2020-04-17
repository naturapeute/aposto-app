<script>
  import { createEventDispatcher } from 'svelte'
  import { patients } from '../../js/store'
  import Chip from '../Chip/Chip.svelte'

  export let filterPatient
  export let patient

  const dispatch = createEventDispatcher()

  $: bestMatches = getBestMatches(filterPatient)

  function onChipClick(patientId) {
    patient = { ...$patients.find(patient => patient.id === patientId) }
    dispatch('patientSelected')
  }

  function getBestMatches(_filterPatient) {
    return _filterPatient.split(' ').reduce((scores, word) => {
      $patients.forEach((patient, i) => {
        scores[i].score += getPatientScore(patient, word)
      })

      return scores
    }, initialPatientScores())
      .filter(patient => patient.score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  function initialPatientScores() {
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
    <li class="mdc-touch-target-wrapper" on:click={() => onChipClick(patient.id)}>
      <Chip title="Sélectionner le patient {patient.firstName} {patient.lastName}" leadingIcon="face"
        touchWrapper>
        {patient.firstName} {patient.lastName}
      </Chip>
    </li>
  {/each}
</ul>

<style src="PatientList.scss"></style>
