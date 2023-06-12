import Vue from 'vue'

function updateContent(el, binding) {
  el.innerHTML = binding.value ? binding.value.replace(/\n/g, '<br/>') : ''
}

Vue.directive('lineBreak', {
  bind: function(el, binding) {
    updateContent(el, binding)
  },
  update: function(el, binding) {
    updateContent(el, binding)
  }
})
