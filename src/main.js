import Vue from 'vue'
import App from './App.vue'
import VueFormLayer from './lib'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(VueFormLayer)
Vue.use(ElementUI, {
  size: 'small'
})

new Vue({
  el: '#app',
  render: h => h(App)
})
