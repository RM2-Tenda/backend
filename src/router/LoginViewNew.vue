<template>
    <div id="app">
        <div class="login-container">
            <div class="login-header">
                <img src="./assets/logo.png" alt="RM2 Logo" class="logo">
                <h1 class="project-name">RM2</h1>
            </div>
            <form @submit.prevent="handleSubmit" class="login-form">
                <input type="text" id="username" v-model="credentials.username" placeholder="Username" required>
                <input type="password" id="password" v-model="credentials.password" placeholder="Password" required>
                <button type="submit" class="login-button">{{ isLoginMode ? 'Login' : 'Register' }}</button>
                <p class="toggle-mode" @click="toggleMode">
                    <span>{{ isLoginMode ? 'Need an account? Register here!' : 'Have an account? Login here!' }}</span>
                </p>
            </form>
        </div>
        <div v-if="showModal" :class="{ 'modal-success': modalSuccess, 'modal-error': !modalSuccess }" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <p>{{ modalMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'App',
    data() {
        return {
            credentials: {
                username: '',
                password: ''
            },
            isLoginMode: true,
            showModal: false,
            modalMessage: '',
            modalSuccess: true
        }
    },
    methods: {
        toggleMode() {
            this.isLoginMode = !this.isLoginMode;
        },
        async handleSubmit() {
            const url = this.isLoginMode ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
            try {
                const response = await axios.post(url, this.credentials);
                this.showModal = true;
                this.modalSuccess = true;
                this.modalMessage = response.data.message;
                if (this.isLoginMode) {
                    console.log('Navigating to devices');
                    this.$store.commit('setAuthToken', response.data.token);
                    this.$router.push({ name: 'devices' }).catch(err => {
                        console.error('Router error:', err);
                    });
                } else {
                    this.isLoginMode = true;
                }
            } catch (error) {
                this.showModal = true;
                this.modalSuccess = false;
                this.modalMessage = error.message;
                console.error('Error:', this.modalMessage);
            }
        },
        closeModal() {
            this.showModal = false;
        }
    }
}
</script>

<style scoped>
#app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #E6F0FA;
}

.login-container {
    padding: 2rem;
    border: 2px solid #3498db;
    border-radius: 15px;
    width: 350px;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.logo {
    width: 100px;
    border-radius: 50%;
    margin-bottom: 1rem;
}

.project-name {
    color: #3498db;
    font-size: 2rem;
}

.login-form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 1rem;
    border-radius: 20px;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

.login-button {
    width: 100%;
    padding: 10px;
    background-color: #3498db;
    border: none;
    border-radius: 20px;
    color: white;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.login-button:hover {
    background-color: #2874a6;
}

.toggle-mode {
    color: #3498db;
    text-decoration: none;
    font-size: 0.9rem;
    cursor: pointer;
    text-align: center;
    transition: color 0.3s;
}

.toggle-mode:hover {
    color: #2874a6;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 400px;
    text-align: center;
}

.modal-success {
    background-color: #4CAF50;
    /* Green */
}

.modal-error {
    background-color: #f44336;
    /* Red */
}

.close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
}
</style>