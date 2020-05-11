<script>
  import { user } from '../../js/store'
  import { serviceColors } from '../../js/utils'
  import ServiceList from '../ServiceList/ServiceList.svelte'
  import TextField from '../TextField/TextField.svelte'

  let filterService = ''

  function onServiceSelected(e) {
    const availableColor = $user.preferredServices.reduce(
      (availableColors, preferredService) => {
        return availableColors.filter(color => preferredService.color !== color)
      },
      [...serviceColors]
    )[0]

    $user.preferredServices = [
      ...$user.preferredServices,
      { code: e.detail, color: availableColor }
    ]
  }

  function onCloseSearch() {
    filterService = ''
  }
</script>

<form class="aposto-form" on:submit|preventDefault>
  <TextField bind:value={filterService} fieldID="service-search"
    placeholder="Rechercher une thérapie..." trailingIcon="close" on:trailingIconClick={onCloseSearch} outlined noAutoComplete>
    Thérapie
  </TextField>
  <ServiceList filterService={filterService} on:serviceSelected={onServiceSelected} />
</form>

<style src="AddPreferredServiceForm.scss"></style>
