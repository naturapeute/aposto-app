<script>
  import { createEventDispatcher } from 'svelte'
  import { servicePrice } from '../../js/store'
  import { isServicePriceValid } from '../../js/utils'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'

  export let expansionPanelId

  export function askClose() {
    if (isServicePriceValid($servicePrice))
      open = false
    else
      submitButtonElement.click()

    return !open
  }

  let open = !isServicePriceValid($servicePrice)
  let submitButtonElement
  const dispatch = createEventDispatcher()

  function onAskToggle() {
    if (open)
      askClose()
    else {
      open = true
      dispatch('open')
    }
  }

  function onSubmit() {
    onAskToggle()
  }
</script>

<ExpansionPanel {expansionPanelId} bind:open on:askToggle={onAskToggle}>
  <div slot="summary">Tarif horaire</div>
  <div slot="content">
    <form class="aposto-form" on:submit|preventDefault={onSubmit}>
      <TextField bind:value={$servicePrice} type="number" fieldID="service-price" min="1" required>
        Tarif horaire
      </TextField>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</ExpansionPanel>
