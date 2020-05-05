<script>
  import { createEventDispatcher } from 'svelte'

  import { user } from '../../js/store'
  import { isPreferredServicesValid } from '../../js/utils'
  import AddPreferredServiceForm from '../AddPreferredServiceForm/AddPreferredServiceForm.svelte'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import PreferredServiceList from '../PreferredServiceList/PreferredServiceList.svelte'
  import Snackbar from '../Snackbar/Snackbar.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isPreferredServicesValid($user.preferredServices))
      open = false
    else
      missingPreferredServicesSnackbar.open()

    return !open
  }

  let open = !isPreferredServicesValid($user.preferredServices)
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
    {#if $user.preferredServices.length < 10}
      <AddPreferredServiceForm />
    {/if}
  </div>
</ExpansionPanel>

<Snackbar bind:this={missingPreferredServicesSnackbar}>
  <span slot="label">
    Vous devez renseigner au moins une thérapie préférée autre que Anamnèse.
  </span>
</Snackbar>
