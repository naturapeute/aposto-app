<script>
  export let title = ''
  export let type = 'button'
</script>

<button class="mdc-icon-button material-icons-round" {type} {title} on:click>
  <slot></slot>
</button>
