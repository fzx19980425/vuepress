import Button from './button/button.vue'
import Input from './input/input.vue'
import Select from './select/select.vue'
import Table from './table/table.vue'
import Dialog from './dialog/dialog.vue'
import DatePicker from './date-picker/date-picker.vue'
import Switch from './switch/switch.vue'
import Checkbox from './checkbox/checkbox.vue'
import Radio from './radio/radio.vue'
import Icon from './icon/icon.vue'

const components = [
  Button,
  Input,
  Select,
  Table,
  Dialog,
  DatePicker,
  Switch,
  Checkbox,
  Radio,
  Icon
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Button,
  Input,
  Select,
  Table,
  Dialog,
  DatePicker,
  Switch,
  Checkbox,
  Radio,
  Icon
} 