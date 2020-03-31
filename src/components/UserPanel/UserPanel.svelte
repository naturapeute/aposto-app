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
        const right = openned
          ? -300 + (t * 300)
          : 0 - (u * 300)

        return `right: ${right}px;`
      }
    }
  }
</script>

{#if openned}
  <div class="user-panel-container {openned ? 'openned' : ''}">
    <div class="user-panel-blur" transition:fadeTransition={{ duration: 500 }}></div>
    <div class="user-panel" transition:slideTransition>
      <div class="user-panel-header">
        <h1 class="mdc-typography--headline6">{author.name}</h1>
        <IconButton icon="close" on:click={onCloseClick} />
      </div>
      <form class="aposto-form" on:submit|preventDefault={onSubmit}>
        <div class="user-panel-content">
          <h2 class="mdc-typography--overline">Auteur des factures</h2>
          <TextField bind:value={_author.name} fieldId="author-name">Nom ou entreprise</TextField>
          <TextField bind:value={_author.street} fieldId="author-street">Rue et n°</TextField>
          <TextField bind:value={_author.NPA} fieldId="author-zip">NPA</TextField>
          <TextField bind:value={_author.city} fieldId="author-city">Localité</TextField>
          <TextField bind:value={_author.email} type="email" fieldId="author-email">Email</TextField>
          <TextField bind:value={_author.phone} type="tel" fieldId="author-phone">Téléphone</TextField>
          <TextField bind:value={_author.RCC} type="tel" fieldId="author-rcc">N°RCC</TextField>
          <TextField bind:value={_author.GLN} type="tel" fieldId="author-gln">N°GLN</TextField>
          <h2 class="mdc-typography--overline">Thérapeute</h2>
          <TextField bind:value={_therapist.firstName} fieldId="therapist-name">Nom ou entreprise</TextField>
          <TextField bind:value={_therapist.lastName} fieldId="therapist-name">Nom ou entreprise</TextField>
          <TextField bind:value={_therapist.street} fieldId="therapist-street">Rue et n°</TextField>
          <TextField bind:value={_therapist.NPA} fieldId="therapist-zip">NPA</TextField>
          <TextField bind:value={_therapist.city} fieldId="therapist-city">Localité</TextField>
          <TextField bind:value={_therapist.phone} type="tel" fieldId="therapist-phone">Téléphone</TextField>
          <TextField bind:value={_therapist.RCC} type="tel" fieldId="therapist-rcc">N°RCC</TextField>
          <TextField bind:value={_therapist.GLN} type="tel" fieldId="therapist-gln">N°GLN</TextField>
        </div>
        <div class="user-panel-footer">
          <Button type="submit" unelevated>Valider</Button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style src="./UserPanel.scss"></style>
