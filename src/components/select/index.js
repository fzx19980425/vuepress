import Select from './select.vue'
import Option from './option.vue'
import OptionGroup from './option-group.vue'

Select.Option = Option
Select.OptionGroup = OptionGroup

Select.install = function(Vue) {
  Vue.component(Select.name, Select)
  Vue.component(Option.name, Option)
  Vue.component(OptionGroup.name, OptionGroup)
}

export default Select
export { Option, OptionGroup } 