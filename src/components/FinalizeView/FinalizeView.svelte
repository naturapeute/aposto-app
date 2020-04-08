<script>
  import { servicePrice } from '../../js/store'
  import FinalizePatient from '../FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from '../FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import IconButton from '../IconButton/IconButton.svelte'

  export let patient
  export let services

  $: totalAmount = services.reduce(
    (total, service) => total + (service.duration * $servicePrice / 60),
    0
  )
</script>

<form>
  <div class="card-set">
    <div class="mdc-card">
      <FinalizePatient {patient} />
    </div>
    <div class="mdc-card">
      <FinalizeTherapyDescription {services} />
    </div>
    <div class="mdc-card">
      <p class="finalize-p">
        <i class="material-icons-round">monetization_on</i>
        <span class="typography--button-inline total-amount">
          {totalAmount.toFixed(2)}CHF
        </span>
      </p>
    </div>
    <div class="mdc-card send-card">
      <IconButton type="submit" title="Valider les informations de la facture">
        send
      </IconButton>
    </div>
  </div>
</form>

<style src="FinalizeView.scss"></style>
