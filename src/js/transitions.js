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

export function customFade(node) {
  const style = getComputedStyle(node)
  const h = parseFloat(style.height)
  const o = +style.opacity

  return {
    duration: 400,
    easing: cubicOut,
    css: t => {
      return `
        opacity: ${t * o};
        height: ${t * h}px;
      `
    }
  }
}
