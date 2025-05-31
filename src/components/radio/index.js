import Radio from './radio.vue'
import RadioGroup from './radio-group.vue'
import RadioButton from './radio-button.vue'

Radio.install = function(Vue) {
  Vue.component(Radio.name, Radio)
  Vue.component(RadioGroup.name, RadioGroup)
  Vue.component(RadioButton.name, RadioButton)
}

export { Radio, RadioGroup, RadioButton }
export default Radio 