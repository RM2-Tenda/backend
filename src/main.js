import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createRouter, createWebHistory } from 'vue-router'


import HomeView from './HomeView.vue'
import LoginView from './LoginView.vue'

const routes = [
    { path: '/', component: LoginView, name: 'login' },
    { path: '/home', component: HomeView, name: 'home' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).mount('#app')
