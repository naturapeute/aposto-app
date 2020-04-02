<script>
  import { createEventDispatcher, beforeUpdate } from 'svelte'

  export let patients
  export let filterPatient

  let bestMatches // eslint-disable-line no-unused-vars
  const dispatch = createEventDispatcher()

  beforeUpdate(() => {
    bestMatches = patients.reduce((scores, patient) => {
      const patientScore = filterPatient.split(' ').reduce(
        (score, word) => {
          if (!word) return score + 0

          return score + +patient.firstName.toLowerCase().includes(word.toLowerCase()) +
            +patient.lastName.toLowerCase().includes(word.toLowerCase())
        }, 0)

      if (patientScore)
        return [
          ...scores,
          {
            ...patient,
            score: patientScore
          }
        ]

      return scores
    }, [])
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  })

  const onChipClick = (patientId) => {
    dispatch('patientSelected', { patientId })
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  {#each bestMatches as patient (patient.id)}
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

<style src="PatientList.scss"></style>
