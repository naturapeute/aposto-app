<script>
  import TextField from '../TextField/TextField.svelte'
  import IconButton from '../IconButton/IconButton.svelte'

  export let servicePrice

  let servicePriceEditMode = false // eslint-disable-line no-unused-vars
  let servicePriceEdit = '' // eslint-disable-line prefer-const, no-unused-vars

  const onEditServicePrice = () => {
    servicePriceEditMode = true
  }

  const onSubmit = () => {
    servicePrice = servicePriceEdit
    onCloseServicePriceEdit()
  }

  const onCloseServicePriceEdit = () => {
    servicePriceEditMode = false
    servicePriceEdit = 0
  }

  const onTextFieldMount = e => {
    e.detail.focus()
  }
</script>

<p class="service-price-p">
  Vous facturez <span class="typography--button-inline" on:click={onEditServicePrice}>
    {servicePrice}CHF</span> de l'heure.
</p>
{#if servicePriceEditMode}
  <form class="aposto-form service-price-edit-form" on:submit|preventDefault={onSubmit}>
    <TextField bind:value={servicePriceEdit} type="number" fieldId="service-price" trailingIcon="close"
      on:trailingIconClick={onCloseServicePriceEdit} on:mount={onTextFieldMount}>
      Nouveau tarif horaire
    </TextField>
    <IconButton type="submit" title="Valider le nouveau tarif horaire">done</IconButton>
  </form>
{/if}

<style src="FinalizeServicePrice.scss"></style>
