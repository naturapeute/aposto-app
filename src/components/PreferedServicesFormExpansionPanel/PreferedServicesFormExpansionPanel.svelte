<script>
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import PreferedServiceList from '../PreferedServiceList/PreferedServiceList.svelte'
  import AddPreferedServiceForm from '../AddPreferedServiceForm/AddPreferedServiceForm.svelte'

  export let opened
  export let expansionPanelId

  let addPreferedServiceMode = false

  function onAddPreferedService() {
    addPreferedServiceMode = true
  }

  function onCloseAdd() {
    addPreferedServiceMode = false
  }
</script>

<ExpansionPanel {expansionPanelId} bind:opened on:askToggle>
  <div slot="summary">Thérapies préférées</div>
  <div slot="content">
    <PreferedServiceList bind:addPreferedServiceMode on:addService={onAddPreferedService} />
    {#if addPreferedServiceMode}
      <AddPreferedServiceForm on:cancelAdd={onCloseAdd} on:addedService={onCloseAdd} />
    {/if}
  </div>
</ExpansionPanel>
