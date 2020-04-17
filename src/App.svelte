<script>
  import { selectedServicesFixture } from './js/fixtures'
  import { author, therapist } from './js/store'
  import HeaderPanel from './components/HeaderPanel/HeaderPanel.svelte'
  import FinalizeView from './components/FinalizeView/FinalizeView.svelte'

  const selectedServices = [...selectedServicesFixture]

  function onUpdateUser(e) {
    $author = { ...e.detail.author }
    $therapist = { ...e.detail.therapist }
  }
</script>

<HeaderPanel on:updateUser={onUpdateUser}>Clôture de votre séance</HeaderPanel>
<main>
  <FinalizeView services={selectedServices} />
</main>

<style src="App.scss" global></style>
