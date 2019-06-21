import Vue from 'vue'
import Router from 'vue-router'
import NotFound from './views/NotFound.vue'
import Preview from './views/Preview.vue'
import Tutorial from './views/Tutorial.vue'
import Bonsai from './views/Bonsai.vue'
import Page from './views/Page.vue'
import List from './views/List.vue'
import BonsaiHome from './views/BonsaiHome.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      // redirect: { name: 'bonsai-home' }
      // redirect: { name: 'tutorial' }
      name: 'bonsai-home',
      component: BonsaiHome
    },
    // {
    //   path: '/bonsai-list',
    //   name: 'bonsai-home',
    //   component: BonsaiHome
    // },
    // {
    //   path: '/bonsai/list',
    //   name: 'list',
    //   component: List
    // },
    {
      path: '/bonsai/:uid',
      name: 'bonsai',
      component: Bonsai
    },
    {
      path: '/page/:uid',
      name: 'page',
      component: Page
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: NotFound
    },
    {
      path: '/preview',
      name: 'preview',
      component: Preview
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: Tutorial
    },
    {
      path: '*',
      redirect: { name: 'not-found' }
    }
  ]
})
