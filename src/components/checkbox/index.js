import Checkbox from './checkbox.vue'
import CheckboxGroup from './checkbox-group.vue'
import CheckboxButton from './checkbox-button.vue'

Checkbox.install = function(Vue) {
  Vue.component(Checkbox.name, Checkbox)
  Vue.component(CheckboxGroup.name, CheckboxGroup)
  Vue.component(CheckboxButton.name, CheckboxButton)
}

export { Checkbox, CheckboxGroup, CheckboxButton }
export default Checkbox 