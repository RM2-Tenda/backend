<template>
    <div id="app">
        <div class="login-container">
            <div class="login-header">
                <img src="./assets/logo.png" alt="RM2 Logo" class="logo">
                <h1 class="project-name">RM2</h1>
            </div>
            <form @submit.prevent="login" class="login-form">
                <input type="text" id="username" v-model="credentials.username" placeholder="username" required>
                <input type="password" id="password" v-model="credentials.password" placeholder="password" required>
                <button type="submit" class="login-button">Login</button>
                <p class="forgot-password">Esqueceu-se da palavra-pass?</p>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            credentials: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            console.log('Login attempted with:', this.credentials);
            this.$router.push({ name: 'home' });
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
}

.login-button:hover {
    background-color: #2874a6;
}

.forgot-password {
    color: #3498db;
    text-decoration: none;
    font-size: 0.9rem;
}
</style>
