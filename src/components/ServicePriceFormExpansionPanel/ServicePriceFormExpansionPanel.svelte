<script>
  import { servicePrice } from '../../js/store'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'

  export let opened
  export let expansionPanelId
</script>

<ExpansionPanel {expansionPanelId} bind:opened on:askToggle>
  <div slot="summary">Tarif horaire</div>
  <div slot="content">
    <TextField bind:value={$servicePrice} type="number" fieldId="service-price" min="1" required>
      Tarif horaire
    </TextField>
  </div>
</ExpansionPanel>
