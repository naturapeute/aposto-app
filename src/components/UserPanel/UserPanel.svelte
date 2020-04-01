<script>
  import { createEventDispatcher } from 'svelte'
  import { fade as fadeTransition } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'
  import IconButton from '../IconButton/IconButton.svelte'

  export let openned = false // eslint-disable-line prefer-const
  export let author
  export let therapist

  let _author = { ...author }
  let _therapist = { ...therapist }
  const dispatch = createEventDispatcher()

  const onCloseClick = () => {
    dispatch('closeUserPanel', {})
    _author = { ...author }
    _therapist = { ...therapist }
  }

  const onSubmit = () => {
    dispatch('updateUser', { author: _author, therapist: _therapist })
    dispatch('closeUserPanel', {})
  }

  const slideTransition = (_, __) => {
    return {
      duration: 500,
      easing: cubicOut,
      css: (t, u) => {
        const panelSize = window.screen.width < 768 ? 300 : 600

        const right = openned
          ? -panelSize + (t * panelSize)
          : 0 - (u * panelSize)

        return `right: ${right}px;`
      }
    }
  }
</script>

{#if openned}
  <div class="user-panel-container">
    <div class="user-panel-blur" transition:fadeTransition={{ duration: 500 }}></div>
    <div class="user-panel" transition:slideTransition>
      <div class="user-panel-header">
        <h1 class="mdc-typography--headline6">{author.name}</h1>
        <IconButton icon="close" on:click={onCloseClick} />
      </div>
      <form on:submit|preventDefault={onSubmit}>
        <div class="user-panel-content">
          <h2 class="mdc-typography--overline">Auteur des factures</h2>
          <div class="aposto-form">
            <TextField bind:value={_author.name} fieldId="author-name" required>Nom ou entreprise</TextField>
            <TextField bind:value={_author.street} fieldId="author-street" required>Rue et n°</TextField>
            <div class="aposto-form-row">
              <div class="col-lg-6">
                <TextField bind:value={_author.NPA} fieldId="author-zip" required>NPA</TextField>
              </div>
              <div class="col-lg-6">
                <TextField bind:value={_author.city} fieldId="author-city" required>Localité</TextField>
              </div>
            </div>
            <div class="aposto-form-row">
              <div class="col-lg-6">
                <TextField bind:value={_author.email} type="email" fieldId="author-email" required>Email</TextField>
              </div>
              <div class="col-lg-6">
                <TextField bind:value={_author.phone} type="tel" fieldId="author-phone" required>Téléphone</TextField>
              </div>
            </div>
            <div class="aposto-form-row">
              <div class="col-lg-6">
                <TextField bind:value={_author.RCC} type="tel" fieldId="author-rcc" required>N°RCC</TextField>
              </div>
              <div class="col-lg-6">
                <TextField bind:value={_author.GLN} type="tel" fieldId="author-gln" required>N°GLN</TextField>
              </div>
            </div>
          </div>
          <h2 class="mdc-typography--overline">Thérapeute</h2>
          <div class="aposto-form">
            <div class="aposto-form-row">
              <div class="col-lg-6">
                <TextField bind:value={_therapist.firstName} fieldId="therapist-first-name" required>Prénom</TextField>
              </div>
              <div class="col-lg-6">
                <TextField bind:value={_therapist.lastName} fieldId="therapist-last-name" required>Nom</TextField>
              </div>
            </div>
            <TextField bind:value={_therapist.street} fieldId="therapist-street" required>Rue et n°</TextField>
            <div class="aposto-form-row">
              <div class="col-lg-6">
                <TextField bind:value={_therapist.NPA} fieldId="therapist-zip" required>NPA</TextField>
              </div>
              <div class="col-lg-6">
                <TextField bind:value={_therapist.city} fieldId="therapist-city" required>Localité</TextField>
              </div>
            </div>
            <TextField bind:value={_therapist.phone} type="tel" fieldId="therapist-phone" required>Téléphone</TextField>
            <div class="aposto-form-row">
              <div class="col-lg-6">
                <TextField bind:value={_therapist.RCC} type="tel" fieldId="therapist-rcc" required>N°RCC</TextField>
              </div>
              <div class="col-lg-6">
                <TextField bind:value={_therapist.GLN} type="tel" fieldId="therapist-gln" required>N°GLN</TextField>
              </div>
            </div>
          </div>
          <!--
            NOTE : As Firefox and IE does not properly handle padding-bottom on overflow: scroll containers,
            a padding-like container is added.
          -->
          <div class="user-pannel-content-padding-bottom"></div>
        </div>
        <div class="user-panel-footer">
          <Button type="submit" unelevated>Valider</Button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style src="./UserPanel.scss"></style>
