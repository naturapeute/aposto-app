<script>
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'
  import { preferedServices } from '../../js/store'
  import { serviceColors } from '../../js/utils'
  import TextField from '../TextField/TextField.svelte'
  import ServiceList from '../ServiceList/ServiceList.svelte'

  let filterService = ''
  const dispatch = createEventDispatcher()

  function onCancelAdd() {
    dispatch('cancelAdd')
  }

  function onTextFieldMount(e) {
    e.detail.focus()
    const drawerContentElement = e.detail.closest('.mdc-drawer__content')
    drawerContentElement.scroll({
      top: drawerContentElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
  }

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

    dispatch('addedService')
  }
</script>

<form class="aposto-form" on:submit|preventDefault transition:slide>
  <TextField bind:value={filterService} fieldID="service-search" trailingIcon="close"
    placeholder="Rechercher un service..." on:trailingIconClick={onCancelAdd}
    on:mount={onTextFieldMount} outlined noAutoComplete>
    Service
  </TextField>
  <ServiceList filterService={filterService} on:serviceSelected={onServiceSelected} />
</form>

<style src="AddPreferedServiceForm.scss"></style>
