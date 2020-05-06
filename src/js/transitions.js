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

export function customFade(node, serviceHeight, serviceElement) {
  const style = getComputedStyle(node)
  const mt = parseFloat(style.marginTop)
  const h = parseFloat(style.height)
  const o = +style.opacity

  serviceHeight = h + 2 * 16
  serviceElement.style.setProperty('--service-height', `${h + 2 * 16}px`)

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
