import Vue from 'vue'
import i18n from './i18n'
import StagecastComponents from '@stagecast/moment-components'
import '@stagecast/moment-components/lib/moment-components.css'
import * as Konva from 'konva'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(StagecastComponents, {
  i18n: (key, value = {}) => i18n.t(key, value)
})

if (window.Stagecast) {
  Vue.prototype.$SDK = new window.Stagecast()
  Vue.prototype.$Konva = Konva
  Vue.prototype.$Hammer = Hammer //eslint-disable-line

  new Vue({
    i18n,
    render: h => h(App)
  }).$mount('#app')
}
