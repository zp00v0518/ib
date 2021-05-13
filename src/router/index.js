import { createRouter, createWebHistory } from 'vue-router'
import Traiding from '../views/Traiding.vue'
import Test from '../views/Test.vue'

const routes = [
  {
    path: '/',
    name: 'Traiding',
    component: Traiding
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
