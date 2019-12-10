import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ObigoUI from 'obigo-js-ui'
import {VueTouch} from 'obigo-js-ui/features/v-touch'
import 'obigo-js-webapi/lbs/lbs'

Vue.use(ObigoUI)
VueTouch.install(Vue)
Vue.config.productionTip = false

/* Native Title */
let app
if (window.applicationFramework && window.applicationFramework.applicationManager) {
  app = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
}

if (app) {
  app.addEventListener('ApplicationShown', function () {
    let a = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
    let d = a.getDescriptor()
    if (a && d) {
      if (d.localURI && d.iconSrcPath) {
        a.setStatusBarTitle(d.getWidgetName('en-us'), (d.localURI + d.iconSrcPath))
      }
    }
  })
}
/* Native Title - End */

/* eslint-disable no-new */
new Vue({
  el: '#root',
  store,
  router,
  template: '<App/>',
  components: { App }
})
