<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { preferedServices } from '../../js/store'
  import { isPreferedServicesValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import PreferedServiceList from '../PreferedServiceList/PreferedServiceList.svelte'
  import AddPreferedServiceForm from '../AddPreferedServiceForm/AddPreferedServiceForm.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isPreferedServicesValid($preferedServices))
      opened = false
    else
      missingPreferedServicesSnackbar.open()

    return !opened
  }

  let addPreferedServiceMode = false
  let opened
  let missingPreferedServicesSnackbar
  const dispatch = createEventDispatcher()

  onMount(() => {
    opened = !isPreferedServicesValid($preferedServices)
  })

  function onAskToggle() {
    if (opened)
      askClose()
    else {
      opened = true
      dispatch('open')
    }
  }

  function onAddPreferedService() {
    addPreferedServiceMode = true
  }

  function onCloseAdd() {
    addPreferedServiceMode = false
  }
</script>

<ExpansionPanel {expansionPanelId} bind:opened on:askToggle={onAskToggle}>
  <div slot="summary">Thérapies préférées</div>
  <div slot="content">
    <PreferedServiceList bind:addPreferedServiceMode on:addService={onAddPreferedService} />
    {#if addPreferedServiceMode}
      <AddPreferedServiceForm on:cancelAdd={onCloseAdd} on:addedService={onCloseAdd} />
    {/if}
  </div>
</ExpansionPanel>

<Snackbar bind:this={missingPreferedServicesSnackbar}>
  <span slot="label">
    Vous devez renseigner au moins une thérapie préférée.
  </span>
</Snackbar>
