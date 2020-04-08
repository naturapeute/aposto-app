<script>
  import { selectedServicesFixture } from './js/fixtures'
  import { author, therapist, patients } from './js/store'
  import HeaderPanel from './components/HeaderPanel/HeaderPanel.svelte'
  import FinalizeView from './components/FinalizeView/FinalizeView.svelte'

  const selectedPatient = { ...$patients[0] }
  const selectedServices = [...selectedServicesFixture]

  const onUpdateUser = e => {
    author.set({ ...e.detail.author })
    therapist.set({ ...e.detail.therapist })
  }
</script>

<HeaderPanel on:updateUser={onUpdateUser}>Clôture de votre séance</HeaderPanel>
<main>
  <FinalizeView patient={selectedPatient} services={selectedServices} />
</main>

<style src="App.scss" global></style>
