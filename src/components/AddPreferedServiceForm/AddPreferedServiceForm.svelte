<script>
  import { slide } from 'svelte/transition'
  import { preferedServices } from '../../js/store'
  import { serviceColors } from '../../js/utils'
  import TextField from '../TextField/TextField.svelte'
  import ServiceList from '../ServiceList/ServiceList.svelte'

  let filterService = ''

  function onServiceSelected(e) {
    const availableColor = $preferedServices.reduce(
      (availableColors, preferedService) => {
        return availableColors.filter(color => preferedService.color !== color)
      },
      [...serviceColors]
    )[0]

    $preferedServices = [
      ...$preferedServices,
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

<style src="AddPreferedServiceForm.scss"></style>
