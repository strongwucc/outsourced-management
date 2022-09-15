import Vue from 'vue'
import { ResizeObserver } from '@juggle/resize-observer'

const ro = new ResizeObserver((entries, observer) => {
  // console.log('Elements resized:', entries.length)
  entries.forEach((entry, index) => {
    const { inlineSize: width } = entry.contentBoxSize[0]
    entry.target.instance.$root.$bus.$emit('leftListResize', width)
    // console.log(`Element ${index + 1}:`, `${width}`)
  })
})

Vue.directive('resize', {
  bind(el, binding) {
    ro.observe(el)
  },
  unbind(el) {
    ro.unobserve(el)
  }
})
