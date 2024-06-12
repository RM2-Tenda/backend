import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createRouter, createWebHistory } from 'vue-router'


import HomeView from './HomeView.vue'
import LoginView from './LoginView.vue'
import AlarmsView from './AlarmsView.vue'
import DeviceManagement from './DeviceManagement.vue';
import store from './store';

const routes = [
    { path: '/', component: LoginView, name: 'login' },
    { path: '/home', component: HomeView, name: 'home' },
    { path: '/devices', component: DeviceManagement, name: 'devices' },
    { path: '/alarms/:deviceId', component: AlarmsView, name: 'alarms' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).use(store).mount('#app')
