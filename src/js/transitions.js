import { cubicOut } from 'svelte/easing'

export function growShrink(node) {
  const h = parseFloat(getComputedStyle(node).height)

  return {
    duration: 400,
    easing: cubicOut,
    css: t => {
      return `height: ${t * h}px;`
    }
  }
}
