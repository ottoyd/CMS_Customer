import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueCurrencyFilter from 'vue-currency-filter'
// import 'materialize-css/dist/js/materialize.min'

Vue.config.productionTip = false
Vue.use(VueCurrencyFilter,
  {
    symbol: 'Rp',
    thousandsSeparator: '.',
    fractionCount: 2,
    fractionSeparator: ',',
    symbolPosition: 'front',
    symbolSpacing: true
  })
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
