<script>
  import { slide } from 'svelte/transition'

  import { preferredServices } from '../../js/store'
  import { serviceColors } from '../../js/utils'
  import ServiceList from '../ServiceList/ServiceList.svelte'
  import TextField from '../TextField/TextField.svelte'

  let filterService = ''

  function onServiceSelected(e) {
    const availableColor = $preferredServices.reduce(
      (availableColors, preferredService) => {
        return availableColors.filter(color => preferredService.color !== color)
      },
      [...serviceColors]
    )[0]

    $preferredServices = [
      ...$preferredServices,
      { code: e.detail, color: availableColor }
    ]

    filterService = ''
  }
</script>

<form class="aposto-form" on:submit|preventDefault transition:slide>
  <TextField bind:value={filterService} fieldID="service-search"
    placeholder="Rechercher une thérapie..." outlined noAutoComplete>
    Thérapie
  </TextField>
  <ServiceList filterService={filterService} on:serviceSelected={onServiceSelected} />
</form>

<style src="AddPreferredServiceForm.scss"></style>
