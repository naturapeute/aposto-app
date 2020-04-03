<script>
  import { afterUpdate } from 'svelte'
  import { getServiceLightLabel } from '../../js/utils' // eslint-disable-line no-unused-vars

  export let services = [ // eslint-disable-line prefer-const
    { code: 1200, duration: 5 },
    { code: 1003, duration: 55 }
  ]

  let totalDuration

  afterUpdate(() => {
    const colorPalette = [
      '#1e6721',
      '#428a32',
      '#68b246',
      '#8bcb68',
      '#bbe1a7'
    ]

    totalDuration = services.reduce((total, service) => total + service.duration, 0)

    services.forEach((service, i) => {
      const servicePercentage = (service.duration * 100) / totalDuration
      const serviceDiv = document.querySelector(`#service-bar-${i}`)
      const randomIndex = Math.floor(Math.random() * colorPalette.length)

      serviceDiv.style.width = `${servicePercentage}%`
      serviceDiv.style.backgroundColor = colorPalette[randomIndex]
      colorPalette.splice(randomIndex, 1)
    })
  })
</script>

<h2 class="mdc-typography--headline5">Votre séance</h2>
<div class="services-bar">
  {#each services as service, i}
    <div id="service-bar-{i}"></div>
  {/each}
</div>
<div class="mdc-data-table">
  <table class="mdc-data-table__table" aria-label="Dessert calories">
    <thead>
      <tr class="mdc-data-table__header-row">
        <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Thérapie</th>
        <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">
          Durée</th>
      </tr>
    </thead>
    <tbody class="mdc-data-table__content">
      {#each services as service, i}
        <tr class="mdc-data-table__row">
          <td class="mdc-data-table__cell">{getServiceLightLabel(service.code)}</td>
          <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{service.duration}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="mdc-data-table__footer-row">
      <tr>
        <td class="mdc-data-table__header-cell" role="rowheader">Durée de la séance</td>
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric total-duration">{totalDuration}</td>
      </tr>
    </tfoot>
  </table>
</div>

<style src="TherapyDescription.scss"></style>
