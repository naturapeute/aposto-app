<script>
  export let title = '' // eslint-disable-line prefer-const
  export let type = 'button' // eslint-disable-line prefer-const
</script>

<button class="mdc-icon-button material-icons" {type} {title} on:click><slot></slot></button>
