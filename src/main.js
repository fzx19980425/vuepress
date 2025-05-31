import Vue from 'vue'
import App from './App.vue'
import './assets/reset.css'
import UiIcon from '@/components/icon/icon.vue'

// 注册全局组件
Vue.component('UiIcon', UiIcon)

// 引入所有svg文件
import '@/assets/icons'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app') 