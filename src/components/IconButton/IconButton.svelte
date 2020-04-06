<script>
  /* eslint-disable prefer-const */
  export let title = ''
  export let type = 'button'
  /* eslint-enable prefer-const */
</script>

<button class="mdc-icon-button material-icons" {type} {title} on:click><slot></slot></button>
