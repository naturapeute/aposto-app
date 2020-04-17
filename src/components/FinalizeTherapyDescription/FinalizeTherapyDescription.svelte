<script>
  import { onMount, afterUpdate } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { preferedServices } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  import Chip from '../Chip/Chip.svelte'
  import TextField from '../TextField/TextField.svelte'
  import PreferedServiceList from '../PreferedServiceList/PreferedServiceList.svelte'
  import IconButton from '../IconButton/IconButton.svelte'
  import Button from '../Button/Button.svelte'

  export let services

  let serviceEditModeId = -1

  $: totalDuration = services.reduce((total, service) => total + service.duration, 0)
  $: totalDurationHours = Math.floor(totalDuration / 60)
  $: totalDurationMinutes = Math.round(((totalDuration / 60) - totalDurationHours) * 60)

  $: serviceHeights = services.map(service => {
    let serviceHeight = (20 * 12) * (service.duration / totalDuration)

    if (serviceHeight < 36) serviceHeight = 36

    return serviceHeight
  })

  onMount(() => {
    window.addEventListener('click', e => {
      const serviceForm = document.querySelector(`#service-${serviceEditModeId}-form`)
      if (serviceEditModeId > -1 && serviceForm && !serviceForm.contains(e.target))
        onCloseEditService()
    })
  })

  afterUpdate(() => {
    services.forEach(service => {
      const serviceListItem = document.querySelector(`#service-${service.id}`)

      if (service.id !== serviceEditModeId) {
        serviceListItem.style.setProperty(
          `--service-${service.id}-height`,
          `${serviceHeights[service.id]}px`
        )
      }

      serviceListItem.style.setProperty(`--service-${service.id}-color`, service.color)
    })
  })

  function fade(node) {
    const mt = parseFloat(getComputedStyle(node).marginTop)
    const h = parseFloat(getComputedStyle(node).height)
    const o = +getComputedStyle(node).opacity

    const id = Number(node.getAttribute('data-id'))

    document.querySelector(`#service-${id}`).style.setProperty(
      `--service-${id}-height`,
      `${parseFloat(getComputedStyle(node).height) + 2 * 16}px`
    )

    return {
      duration: 400,
      easing: cubicOut,
      css: t => {
        return `
        opacity: ${t * o};
        margin-top: ${t * mt}px;
        height: ${t * h}px;
      `
      }
    }
  }

  function onEditService(id) {
    serviceEditModeId = id
  }

  function onCloseEditService() {
    serviceEditModeId = -1
  }

  function onSelectedService(e, id) {
    services = services.map(service => {
      if (service.id === id) {
        service.code = e.detail
        service.color = $preferedServices.find(
          preferedService => preferedService.code === e.detail
        ).color
      }

      return service
    })
  }

  function onAddService() {
    services = [
      ...services,
      {
        id: services.length,
        code: $preferedServices[0].code,
        duration: 5,
        color: $preferedServices[0].color
      }
    ]
    serviceEditModeId = services.length - 1
  }

  function onDeleteService(id) {
    services = services.reduce((newServices, service) => {
      if (service.id === id) return newServices

      if (service.id > id) {
        const updatedService = { ...service }

        updatedService.id--

        return [...newServices, updatedService]
      }

      return [...newServices, service]
    }, [])

    onCloseEditService()
  }
</script>

<ul class="therapy-description">
  {#if services.length < 5}
    <li class="service service-add">
      <div class="service-timeline">
        <IconButton title="Ajouter une nouvelle thérapie" on:click={onAddService}>
          add
        </IconButton>
      </div>
    </li>
  {/if}
  {#each [...services].reverse() as service, i (service.id)}
    <li id="service-{service.id}" class="service">
      <div class="service-timeline">
        <span>{service.duration}'</span>
      </div>
      <div class="service-control-container" class:edit-mode={service.id === serviceEditModeId}>
        {#if service.id !== serviceEditModeId}
          <div class="service-label-container">
            <Chip className="service-label" title="Éditer la thérapie {`"
              ${getServiceLightLabel(service.code)}"`}" trailingIcon="edit" color="{service.color}"
              on:click={() => onEditService(service.id)}>
              {getServiceLightLabel(service.code)}
            </Chip>
            <Button className="service-delete" title="Supprimer la thérapie {`"
              ${getServiceLightLabel(service.code)}"`}" on:click={onDeleteService(service.id)}>
              Supprimer
            </Button>
          </div>
        {:else}
          <form id="service-{service.id}-form" class="aposto-form" data-id="{service.id}"
            transition:fade on:submit|preventDefault={onCloseEditService}>
            <PreferedServiceList selectedServiceCode="{service.code}"
              on:selectedService={(e) => onSelectedService(e, service.id)} />
            <TextField bind:value={service.duration}
              fieldId={`service-duration-input-${service.id}`}
              type="number" outlined>
              Durée
            </TextField>
          </form>
        {/if}
      </div>
    </li>
  {/each}
</ul>
<p class="finalize-p total-duration">
  <i class="material-icons-round">schedule</i>
  <span class="typography--button-inline no-click-inline">
    {totalDurationHours}h{#if totalDurationMinutes}
      {totalDurationMinutes}
    {/if}
  </span>
</p>

<style src="FinalizeTherapyDescription.scss"></style>
