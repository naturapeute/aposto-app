<script>
  import { author } from '../../js/store'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'

  export let opened
  export let expansionPanelId
</script>

<ExpansionPanel {expansionPanelId} bind:opened on:askToggle>
  <div slot="summary">Auteur des factures</div>
  <div slot="content">
    <TextField bind:value={$author.name} fieldId="author-name" required>
      Nom ou entreprise
    </TextField>
    <TextField bind:value={$author.street} fieldId="author-street" required>
      Rue et n°
    </TextField>
    <TextField bind:value={$author.ZIP} fieldId="author-zip" required>NPA</TextField>
    <TextField bind:value={$author.city} fieldId="author-city" required>Localité</TextField>
    <TextField bind:value={$author.email} type="email" fieldId="author-email" required>
      Email
    </TextField>
    <TextField bind:value={$author.phone} type="tel" fieldId="author-phone" required>
      Téléphone
    </TextField>
    <TextField bind:value={$author.RCC} type="tel" fieldId="author-rcc" required>
      N°RCC
    </TextField>
    <TextField bind:value={$author.GLN} type="tel" fieldId="author-gln" required>
      N°GLN
    </TextField>
  </div>
</ExpansionPanel>
