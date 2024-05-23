import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import DeviceManagement from '../views/DeviceManagement.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/devices',
      name: 'devices',
      component: DeviceManagement
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },

  ]
});
