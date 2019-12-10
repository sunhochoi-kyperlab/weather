import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  // mode: process.env.NODE_ENV === 'development' ? 'history' : 'abstract',
  mode: 'abstract',
  routes
})

export default router
