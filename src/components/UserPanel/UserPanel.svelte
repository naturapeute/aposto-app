<script>
  import { MDCDrawer } from '@material/drawer'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { author, therapist, servicePrice } from '../../js/store'
  import TextField from '../TextField/TextField.svelte'
  import Button from '../Button/Button.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import PreferedServiceList from '../PreferedServiceList/PreferedServiceList.svelte'
  import AddPreferedServiceForm from '../AddPreferedServiceForm/AddPreferedServiceForm.svelte'
  import ExpansionPanel from '../ExpansionPanel/ExpansionPanel.svelte'
  import ExpansionPanelSet from '../ExpansionPanelSet/ExpansionPanelSet.svelte'

  export let openned = false

  let element
  let drawer = {}
  let submitButtonElement
  let addPreferedServiceMode = false
  const expansionPanelOpennedStates = [false, false, false, false]
  const dispatch = createEventDispatcher()

  $: drawer.open = openned

  onMount(() => {
    drawer = new MDCDrawer(element)
    // FIXME : We are overriding the Material scrim click handler as we only want to close the drawer
    // on scrim click if and only if the form is valid
    Object.getPrototypeOf(drawer.foundation_).handleScrimClick = () => { }

    drawer.listen('MDCDrawer:opened', () => {
      document.querySelector('.mdc-icon-button').blur()
    })
  })

  onDestroy(() => {
    if (drawer) drawer.detroy()
  })

  function onClose() {
    submitButtonElement.click()
  }

  function onOpenExpansionPanel(index) {
    expansionPanelOpennedStates.forEach((expansionPanelOpennedState, i) => {
      if (i === index) return

      if (expansionPanelOpennedState) expansionPanelOpennedStates[i] = false
    })
  }

  function onAddPreferedService() {
    addPreferedServiceMode = true
  }

  function onCloseAdd() {
    addPreferedServiceMode = false
  }

  function onSubmit() {
    dispatch('closeUserPanel')
  }
</script>

<aside bind:this={element} class="mdc-drawer mdc-drawer--modal" dismissible={false}>
  <header class="mdc-drawer__header">
    <div>
      <h1 class="mdc-drawer__title">Vos informations</h1>
      <h2 class="mdc-drawer__subtitle">{$author.name}</h2>
    </div>
    <IconButton title="Fermer et annuler les modifications" on:click={onClose}>
      close
    </IconButton>
  </header>
  <hr class="mdc-list-divider">
  <div class="mdc-drawer__content">
    <form class="aposto-form" on:submit|preventDefault={onSubmit}>
      <ExpansionPanelSet>
        <ExpansionPanel bind:openned={expansionPanelOpennedStates[0]}
          on:open={() => onOpenExpansionPanel(0)}>
          <div slot="summary">Auteur des factures</div>
          <div slot="content">
            <TextField bind:value={$author.name} fieldId="author-name" required>
              Nom ou entreprise
            </TextField>
            <TextField bind:value={$author.street} fieldId="author-street" required>
              Rue et n°
            </TextField>
            <TextField bind:value={$author.ZIP} fieldId="author-zip" required>NPA</TextField>
            <TextField bind:value={$author.city} fieldId="author-city" required>Localité</TextField>
            <TextField bind:value={$author.email} type="email" fieldId="author-email" required>
              Email
            </TextField>
            <TextField bind:value={$author.phone} type="tel" fieldId="author-phone" required>
              Téléphone
            </TextField>
            <TextField bind:value={$author.RCC} type="tel" fieldId="author-rcc" required>
              N°RCC
            </TextField>
            <TextField bind:value={$author.GLN} type="tel" fieldId="author-gln" required>
              N°GLN
            </TextField>
          </div>
        </ExpansionPanel>
        <ExpansionPanel bind:openned={expansionPanelOpennedStates[1]}
          on:open={() => onOpenExpansionPanel(1)}>
          <div slot="summary">Thérapeute</div>
          <div slot="content">
            <TextField bind:value={$therapist.firstName} fieldId="therapist-first-name" required>
              Prénom
            </TextField>
            <TextField bind:value={$therapist.lastName} fieldId="therapist-last-name" required>
              Nom
            </TextField>
            <TextField bind:value={$therapist.street} fieldId="therapist-street" required>
              Rue et n°
            </TextField>
            <TextField bind:value={$therapist.ZIP} fieldId="therapist-zip" required>NPA</TextField>
            <TextField bind:value={$therapist.city} fieldId="therapist-city" required>
              Localité
            </TextField>
            <TextField bind:value={$therapist.phone} type="tel" fieldId="therapist-phone" required>
              Téléphone</TextField>
            <TextField bind:value={$therapist.RCC} type="tel" fieldId="therapist-rcc" required>
              N°RCC
            </TextField>
            <TextField bind:value={$therapist.GLN} type="tel" fieldId="therapist-gln" required>
              N°GLN
            </TextField>
          </div>
        </ExpansionPanel>
        <ExpansionPanel bind:openned={expansionPanelOpennedStates[2]}
          on:open={() => onOpenExpansionPanel(2)}>
          <div slot="summary">Tarif horaire</div>
          <div slot="content">
            <TextField bind:value={$servicePrice} type="number" fieldId="service-price" required>
              Tarif horaire
            </TextField>
          </div>
        </ExpansionPanel>
        <ExpansionPanel bind:openned={expansionPanelOpennedStates[3]}
          on:open={() => onOpenExpansionPanel(3)}>
          <div slot="summary">Thérapies préférées</div>
          <div slot="content">
            <PreferedServiceList bind:addPreferedServiceMode on:addService={onAddPreferedService} />
            {#if addPreferedServiceMode}
              <AddPreferedServiceForm on:cancelAdd={onCloseAdd} on:addedService={onCloseAdd} />
            {/if}
          </div>
        </ExpansionPanel>
      </ExpansionPanelSet>
      <Button bind:thisElement={submitButtonElement} className="drawer-submit-button" type="submit"
        title="Enregistrer les modifications">
        Enregistrer
      </Button>
    </form>
  </div>
</aside>

<div class="mdc-drawer-scrim" on:click={onClose}></div>

<style src="UserPanel.scss"></style>
