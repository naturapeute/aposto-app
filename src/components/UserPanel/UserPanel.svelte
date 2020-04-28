<script>
  import { MDCDrawer } from '@material/drawer'
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { author } from '../../js/store'
  import Button from '../Button/Button.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import ExpansionPanelSet from '../ExpansionPanelSet/ExpansionPanelSet.svelte'
  import AuthorFormExpansionPanel from '../AuthorFormExpansionPanel/AuthorFormExpansionPanel.svelte'
  import TherapistFormExpansionPanel
    from '../TherapistFormExpansionPanel/TherapistFormExpansionPanel.svelte'
  import ServicePriceFormExpansionPanel
    from '../ServicePriceFormExpansionPanel/ServicePriceFormExpansionPanel.svelte'
  import PreferedServicesFormExpansionPanel
    from '../PreferedServicesFormExpansionPanel/PreferedServicesFormExpansionPanel.svelte'

  export let opened = false

  let element
  let drawer = {}
  let formElement
  let submitButtonElement

  let formExpansionPanels = [
    { component: AuthorFormExpansionPanel, opened: true, id: 'author-form-expansion-panel' },
    { component: TherapistFormExpansionPanel, opened: true, id: 'therapist-form-expansion-panel' },
    {
      component: ServicePriceFormExpansionPanel,
      opened: true,
      id: 'service-price-form-expansion-panel'
    },
    {
      component: PreferedServicesFormExpansionPanel,
      opened: true,
      id: 'prefered-services-form-expansion-panel'
    }
  ]

  const dispatch = createEventDispatcher()

  $: drawer.open = opened

  onMount(() => {
    drawer = new MDCDrawer(element)
    // FIXME : We are overriding the Material scrim click handler as we only want to close the drawer
    // on scrim click if and only if the form is valid
    Object.getPrototypeOf(drawer.foundation_).handleScrimClick = () => { }

    drawer.listen('MDCDrawer:opened', () => {
      document.querySelector('.mdc-icon-button').blur()
    })

    opened = !formElement.checkValidity()

    formExpansionPanels = formExpansionPanels.reduce(
      (newformExpansionPanels, formExpansionPanel) => {
        return [...newformExpansionPanels, closeIfValid(formExpansionPanel)]
      },
      []
    )
  })

  onDestroy(() => {
    if (drawer) drawer.detroy()
  })

  function closeIfValid(formExpansionPanel) {
    const invalidFields =
      formElement.querySelectorAll(`#${formExpansionPanel.id} :invalid`)

    if (invalidFields.length) {
      submitButtonElement.click()
      return { ...formExpansionPanel }
    } else
      return { ...formExpansionPanel, opened: false }
  }

  function onClose() {
    submitButtonElement.click()
  }

  function onSubmit() {
    dispatch('closeUserPanel')
  }

  function onExpansionPanelAskToggle(formExpansionPanelId) {
    formExpansionPanels = formExpansionPanels.reduce(
      (newFormExpansionPanels, formExpansionPanel) => {
        if (formExpansionPanel.id === formExpansionPanelId) {
          if (formExpansionPanel.opened)
            return [...newFormExpansionPanels, closeIfValid(formExpansionPanel)]
          else
            return [...newFormExpansionPanels, { ...formExpansionPanel, opened: true }]
        } else
          return [...newFormExpansionPanels, closeIfValid(formExpansionPanel)]
      },
      []
    )
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
    <form bind:this={formElement} class="aposto-form" on:submit|preventDefault={onSubmit}>
      <ExpansionPanelSet>
        {#each formExpansionPanels as formExpansionPanel (formExpansionPanel.id)}
          <svelte:component bind:this={formExpansionPanel.element} this={formExpansionPanel.component}
            expansionPanelId={formExpansionPanel.id} bind:opened={formExpansionPanel.opened}
            on:askToggle={() => onExpansionPanelAskToggle(formExpansionPanel.id)} />
        {/each}
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
