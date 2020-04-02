<script>
  import { afterUpdate } from 'svelte'

  export let services

  afterUpdate(() => {
    const colorPalette = [
      '#1e6721',
      '#428a32',
      '#68b246',
      '#8bcb68',
      '#bbe1a7'
    ]

    const totalDuration = services.reduce((total, service) => total + service.duration, 0)

    services.forEach((service, i) => {
      const servicePercentage = (service.duration * 100) / totalDuration
      const serviceDiv = document.querySelector(`#service-${i}`)
      const randomIndex = Math.floor(Math.random() * colorPalette.length)

      service.color = colorPalette[randomIndex]
      colorPalette.splice(randomIndex, 1)
      serviceDiv.style.width = `${servicePercentage}%`
      serviceDiv.style.backgroundColor = service.color
      document.querySelector(`#service-caption-${i}`).style.backgroundColor = service.color
    })
  })
</script>

<h2 class="mdc-typography--headline5">Votre séance</h2>
<div class="services-bar">
  {#each services as service, i}
    <div id="service-{i}"></div>
  {/each}
</div>
<ul class="services-caption">
  {#each services as service, i}
    <li>
      <div class="service-caption-color" id="service-caption-{i}"></div>{service.code} : {service.duration} minutes
    </li>
  {/each}
</ul>

<style src="TherapyDescription.scss"></style>
