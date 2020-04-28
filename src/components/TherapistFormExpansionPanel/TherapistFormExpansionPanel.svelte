<script>
  import { therapist } from '../../js/store'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'

  export let opened
  export let expansionPanelId
</script>

<ExpansionPanel {expansionPanelId} bind:opened on:askToggle>
  <div slot="summary">Thérapeute</div>
  <div slot="content">
    <TextField bind:value={$therapist.firstName} fieldId="therapist-first-name" required>
      Prénom
    </TextField>
    <TextField bind:value={$therapist.lastName} fieldId="therapist-last-name" required>
      Nom
    </TextField>
    <TextField bind:value={$therapist.street} fieldId="therapist-street" required>
      Rue et n°
    </TextField>
    <TextField bind:value={$therapist.ZIP} fieldId="therapist-zip" required>NPA</TextField>
    <TextField bind:value={$therapist.city} fieldId="therapist-city" required>
      Localité
    </TextField>
    <TextField bind:value={$therapist.phone} type="tel" fieldId="therapist-phone" required>
      Téléphone</TextField>
    <TextField bind:value={$therapist.RCC} type="tel" fieldId="therapist-rcc" required>
      N°RCC
    </TextField>
    <TextField bind:value={$therapist.GLN} type="tel" fieldId="therapist-gln" required>
      N°GLN
    </TextField>
  </div>
</ExpansionPanel>
