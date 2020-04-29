<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { servicePrice } from '../../js/store'
  import { isServicePriceValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isServicePriceValid($servicePrice))
      opened = false
    else
      submitButtonElement.click()

    return !opened
  }

  let opened
  let submitButtonElement
  const dispatch = createEventDispatcher()

  onMount(() => {
    opened = !isServicePriceValid($servicePrice)
  })

  function onAskToggle() {
    if (opened)
      askClose()
    else {
      opened = true
      dispatch('open')
    }
  }

  function onSubmit() {
    onAskToggle()
  }
</script>

<ExpansionPanel {expansionPanelId} bind:opened on:askToggle={onAskToggle}>
  <div slot="summary">Tarif horaire</div>
  <div slot="content">
    <form class="aposto-form" on:submit|preventDefault={onSubmit}>
      <TextField bind:value={$servicePrice} type="number" fieldId="service-price" min="1" required>
        Tarif horaire
      </TextField>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</ExpansionPanel>
