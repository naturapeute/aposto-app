<script>
  import { createEventDispatcher } from 'svelte'
  import { preferredServices } from '../../js/store'
  import { isPreferredServicesValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import PreferredServiceList from '../PreferredServiceList/PreferredServiceList.svelte'
  import AddPreferredServiceForm from '../AddPreferredServiceForm/AddPreferredServiceForm.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isPreferredServicesValid($preferredServices))
      open = false
    else
      missingPreferredServicesSnackbar.open()

    return !open
  }

  let open = !isPreferredServicesValid($preferredServices)
  let missingPreferredServicesSnackbar
  const dispatch = createEventDispatcher()

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
    <PreferredServiceList />
    {#if $preferredServices.length < 10}
      <AddPreferredServiceForm />
    {/if}
  </div>
</ExpansionPanel>

<Snackbar bind:this={missingPreferredServicesSnackbar}>
  <span slot="label">
    Vous devez renseigner au moins une thérapie préférée.
  </span>
</Snackbar>
