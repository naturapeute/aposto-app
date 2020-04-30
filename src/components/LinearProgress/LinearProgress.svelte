<script>
  import { loading } from '../../js/store'

  export let intermediate = false
</script>

<div role="progressbar" class="mdc-linear-progress"
  class:mdc-linear-progress--indeterminate={intermediate} aria-label="Barre de chargement"
  aria-valuemin="0" aria-valuemax="1" hidden={!$loading}>
  <div class="mdc-linear-progress__buffering-dots"></div>
  <div class="mdc-linear-progress__buffer"></div>
  <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
    <span class="mdc-linear-progress__bar-inner"></span>
  </div>
  <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
    <span class="mdc-linear-progress__bar-inner"></span>
  </div>
</div>

<style src="LinearProgress.scss"></style>
