<template>
  <div id="app">
    <router-view></router-view>
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
