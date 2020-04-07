<script>
  /* eslint-disable no-unused-vars */
  import { services } from '../../js/store'
  import { getServiceLightLabel } from '../../js/utils'
  /* eslint-enable no-unused-vars */

  let totalDuration // eslint-disable-line no-unused-vars

  /* eslint-disable no-undef */
  $: serviceEditMode = $services.map(_ => false)
  $: totalDuration = $services.reduce((total, service) => total + service.duration, 0)
  /* eslint-enable no-undef */
</script>

<h2 class="mdc-typography--headline5 therapy-headline">Votre séance</h2>
<div class="mdc-data-table">
  <table class="mdc-data-table__table" aria-label="Votre séance">
    <thead>
      <tr class="mdc-data-table__header-row">
        <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Thérapie</th>
        <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">
          Durée</th>
      </tr>
    </thead>
    <tbody class="mdc-data-table__content">
      {#each $services as service, i}
        <tr class="mdc-data-table__row">
          <td class="mdc-data-table__cell">{getServiceLightLabel(service.code)}</td>
          <td class="mdc-data-table__cell mdc-data-table__cell--numeric">{service.duration}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="data-table__footer-row">
      <tr>
        <td class="mdc-data-table__header-cell" role="rowheader">Durée de la séance</td>
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric total-duration">{totalDuration}</td>
      </tr>
    </tfoot>
  </table>
</div>

<style src="FinalizeTherapyDescription.scss"></style>
