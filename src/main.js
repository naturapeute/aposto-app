import App from './App.svelte'

const app = new App({
  target: document.body
})

export default app

let _paq
loadMatomo()

function loadMatomo() {
  _paq = window._paq || []
  _paq.push(['trackPageView'])
  _paq.push(['enableLinkTracking'])
  ; (function() {
    const u = '//stats.anonym.dev/'
    _paq.push(['setTrackerUrl', u + 'matomo.php'])
    _paq.push(['setSiteId', '5'])
    const d = document
    const g = d.createElement('script')
    const s = d.getElementsByTagName('script')[0]
    g.type = 'text/javascript'
    g.async = true
    g.defer = true
    g.src = u + 'matomo.js'
    s.parentNode.insertBefore(g, s)
  })()
}
