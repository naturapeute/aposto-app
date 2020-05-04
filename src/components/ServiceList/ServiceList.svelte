<script>
  import { createEventDispatcher } from 'svelte'

  import { preferredServices } from '../../js/store'
  import { serviceCodes } from '../../js/utils'
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
        if (!$preferredServices.find(preferredService => preferredService.code === service.code))
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
      +String(service.code).includes(word)
  }
</script>

<ul class="mdc-chip-set mdc-chip-set--choice" role="grid">
  {#each bestMatches as service (service.code)}
    <li class="mdc-touch-target-wrapper" on:click={() => onSelectService(service.code)}>
      <Chip title="Sélectionner le service {service.lightLabel}" leadingIcon="spa" touchWrapper>
        {service.lightLabel}
      </Chip>
    </li>
  {/each}
</ul>
