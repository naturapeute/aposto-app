<script>
  // eslint-disable-next-line no-unused-vars
  import { authorFixture, therapistFixture, patientsFixture } from './fixtures.mjs'
  import Username from './components/Username/Username.svelte'
  import TextField from './components/TextField/TextField.svelte'
  import UserPanel from './components/UserPanel/UserPanel.svelte'
  import PatientView from './components/PatientView/PatientView.svelte'

  let author = { ...authorFixture } // eslint-disable-line no-unused-vars
  let therapist = { ...therapistFixture } // eslint-disable-line no-unused-vars
  const patients = [...patientsFixture]
  let userPanelOpenned = false // eslint-disable-line no-unused-vars
  const selectedPatient = patients[0] // eslint-disable-line no-unused-vars

  const onToggleUserPanel = () => {
    userPanelOpenned = !userPanelOpenned
  }

  const onUpdateUser = e => {
    author = { ...e.detail.author }
    therapist = { ...e.detail.therapist }
  }
</script>

<UserPanel openned={userPanelOpenned} {author} {therapist} on:closeUserPanel={onToggleUserPanel}
  on:updateUser={onUpdateUser} />

<header>
  <Username username={author.name} on:openUserPanel={onToggleUserPanel} />
</header>
<main>
  <PatientView {patients} />
</main>

<style src="./App.scss" global></style>
