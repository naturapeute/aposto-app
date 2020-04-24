<script>
  import { createEventDispatcher } from 'svelte'
  import { serviceCodes } from '../../js/utils'
  import { preferedServices } from '../../js/store'
  import Chip from '../Chip/Chip.svelte'

  export let filterService

  const dispatch = createEventDispatcher()

  $: bestMatches = getBestMatches(filterService)

  function onSelectService(code) {
    dispatch(
      'serviceSelected',
      code
    )
  }

  function getBestMatches(_filterService) {
    return _filterService.split(' ').reduce((scores, word) => {
      serviceCodes.forEach((service, i) => {
        if (!$preferedServices.find(preferedService => preferedService.code === service.value))
          scores[i].score += getServiceScore(service, word)
      })

      return scores
    }, initialServiceScores())
      .filter(service => service.score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  function initialServiceScores() {
    return serviceCodes.map(service => { return { ...service, score: 0 } })
  }

  function getServiceScore(service, word) {
    if (!word) return 0

    return +service.lightLabel.toLowerCase().includes(word.toLowerCase()) +
      +String(service.value).includes(word)
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  {#each bestMatches as service (service.value)}
    <li class="mdc-touch-target-wrapper" on:click={() => onSelectService(service.value)}>
      <Chip title="Sélectionner le service {service.lightLabel}" leadingIcon="spa" touchWrapper>
        {service.lightLabel}
      </Chip>
    </li>
  {/each}
</ul>
