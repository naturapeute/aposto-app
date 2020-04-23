<script>
  import { onMount } from 'svelte'
  import { selectedServicesFixture } from './js/fixtures'
  import { author, therapist, servicePrice } from './js/store'
  import HeaderPanel from './components/HeaderPanel/HeaderPanel.svelte'
  import FinalizeView from './components/FinalizeView/FinalizeView.svelte'
  import Snackbar from './components/Snackbar/Snackbar.svelte'

  let saveUserSnackbar
  let selectedServices = selectedServicesFixture.map(e => ({ ...e }))
  let userUpdated

  onMount(() => {
    author.subscribe(_ => { userUpdated = true })
    therapist.subscribe(_ => { userUpdated = true })
    servicePrice.subscribe(_ => { userUpdated = true })
    userUpdated = false
  })

  function onUserPannelClosed() {
    if (userUpdated) {
      saveUserSnackbar.open()
      userUpdated = false
    }
  }

  function onNewInvoice() {
    selectedServices = selectedServicesFixture.map(e => ({ ...e }))
  }
</script>

<HeaderPanel on:userPannelClosed={onUserPannelClosed}>Clôture de votre séance</HeaderPanel>
<main>
  <FinalizeView services={selectedServices} on:newInvoice={onNewInvoice} />

  <Snackbar bind:this={saveUserSnackbar}>
    <span slot="label">Vos informations ont été mises à jour.</span>
  </Snackbar>
</main>

<style src="App.scss" global></style>