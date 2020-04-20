<script>
  import { selectedServicesFixture } from './js/fixtures'
  import { author, therapist } from './js/store'
  import HeaderPanel from './components/HeaderPanel/HeaderPanel.svelte'
  import FinalizeView from './components/FinalizeView/FinalizeView.svelte'

  let selectedServices = selectedServicesFixture.map(e => ({ ...e }))

  function onUpdateUser(e) {
    $author = { ...e.detail.author }
    $therapist = { ...e.detail.therapist }
  }

  function onNewInvoice() {
    selectedServices = selectedServicesFixture.map(e => ({ ...e }))
  }
</script>

<HeaderPanel on:updateUser={onUpdateUser}>Clôture de votre séance</HeaderPanel>
<main>
  <FinalizeView services={selectedServices} on:newInvoice={onNewInvoice} />
</main>

<style src="App.scss" global></style>
