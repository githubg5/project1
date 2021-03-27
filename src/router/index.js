import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "LoginHomeWelcome" */ '@/views/Login')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "LoginHomeWelcome" */ '@/views/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import(/* webpackChunkName: "LoginHomeWelcome" */ '@/views/Welcome')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "Users" */ '@/views/Users')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName: "Roles" */ '@/views/Roles')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') return next()
  const token = sessionStorage.getItem('token')
  if (!token) return next('/')
  next()
})

export default router
