<script>
  import { author, therapist, selectedPatient, servicePrice, services } from './js/store'
  import HeaderPanel from './components/HeaderPanel/HeaderPanel.svelte'
  import FinalizePatient from './components/FinalizePatient/FinalizePatient.svelte'
  import FinalizeTherapyDescription
    from './components/FinalizeTherapyDescription/FinalizeTherapyDescription.svelte'
  import IconButton from './components/IconButton/IconButton.svelte'

  $: totalAmount = $services.reduce(
    (total, service) => total + (service.duration * $servicePrice / 60),
    0
  )

  const onUpdateUser = e => {
    author.set({ ...e.detail.author })
    therapist.set({ ...e.detail.therapist })
  }
</script>

<HeaderPanel on:updateUser={onUpdateUser}>Clôture de votre séance</HeaderPanel>
<main>
  <form>
    <div class="card-set">
      <div class="mdc-card">
        <FinalizePatient />
      </div>
      <div class="mdc-card">
        <FinalizeTherapyDescription />
      </div>
      <div class="mdc-card">
        <p class="finalize-p">
          <i class="material-icons-round">monetization_on</i>
          <span class="typography--button-inline total-amount">
            {totalAmount.toFixed(2)}CHF
          </span>
        </p>
      </div>
      <div class="mdc-card button-card">
        <IconButton type="submit" title="Valider les informations de la facture">
          send
        </IconButton>
      </div>
    </div>
  </form>
</main>

<style src="App.scss" global></style>
