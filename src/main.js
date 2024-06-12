import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createRouter, createWebHistory } from 'vue-router'


import HomeView from './HomeView.vue'
import LoginView from './LoginView.vue'
import AlarmsView from './AlarmsView.vue'
import DeviceManagement from './DeviceManagement.vue';
import StatisticsView from './StatisticsView.vue';
import store from './store';

const routes = [
    { path: '/', component: LoginView, name: 'login' },
    { path: '/home', component: HomeView, name: 'home' },
    { path: '/devices', component: DeviceManagement, name: 'devices' },
    { path: '/alarms/:deviceId', component: AlarmsView, name: 'alarms' },
    { path: '/statistics/:deviceId', component: StatisticsView, name: 'statistics', props: true },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).use(store).mount('#app')
