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
      open = false
    else
      missingPreferedServicesSnackbar.open()

    return !open
  }

  let open
  let missingPreferedServicesSnackbar
  const dispatch = createEventDispatcher()

  onMount(() => {
    open = !isPreferedServicesValid($preferedServices)
  })

  function onAskToggle() {
    if (open)
      askClose()
    else {
      open = true
      dispatch('open')
    }
  }
</script>

<ExpansionPanel {expansionPanelId} bind:open on:askToggle={onAskToggle}>
  <div slot="summary">Thérapies préférées</div>
  <div slot="content">
    <PreferedServiceList />
    {#if $preferedServices.length < 10}
      <AddPreferedServiceForm />
    {/if}
  </div>
</ExpansionPanel>

<Snackbar bind:this={missingPreferedServicesSnackbar}>
  <span slot="label">
    Vous devez renseigner au moins une thérapie préférée.
  </span>
</Snackbar>
