// filters.js

import Vue from 'vue'

Vue.filter('textwrapping', function(value) {
  if (!value) return ''
  return value.toString().replace(/\n/g, '<br/>')
})

Vue.filter('percentage', function(value) {
  if (!value[0] || !value[1]) {
    return '0%'
  }

  return Math.round((value[0] / value[1]) * 100 * 100) / 100 + '%'
})
