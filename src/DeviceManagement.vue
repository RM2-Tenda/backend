<template>
  <div class="device-management">
    <h1>Device Management</h1>
    <div class="devices">
      <div v-for="device in devices" :key="device.id" class="device">
        <span>{{ device.code }}</span>
        <button @click="deleteDevice(device.id)">Delete</button>
        <router-link :to="{ name: 'home', params: { deviceId: device.id } }">View</router-link>
      </div>
    </div>
    <button @click="showAddDeviceModal = true">+</button>

    <div v-if="showAddDeviceModal" class="modal">
      <div class="modal-content">
        <span @click="showAddDeviceModal = false">&times;</span>
        <h2>Add New Device</h2>
        <input v-model="newDeviceCode" placeholder="Enter device QR code">
        <button @click="addDevice">Add Device</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';
export default {
  data() {
    return {
      devices: [],
      newDeviceCode: '',
      showAddDeviceModal: false
    };
  },
  created() {
    this.fetchDevices();
  },
  methods: {
    fetchDevices() {
      axios.get('/api/qr', { headers: { Authorization: `Bearer ${this.$store.state.authToken}` } })
        .then(response => {
          this.devices = response.data.qr_codes;
        })
        .catch(error => console.error('Error fetching devices:', error));
    },
    addDevice() {
      axios.post('/api/qr', { qr_code: this.newDeviceCode }, { headers: { Authorization: `Bearer ${this.$store.state.authToken}` } })
        .then(() => {
          this.fetchDevices();
          this.newDeviceCode = '';
          this.showAddDeviceModal = false;
        })
        .catch(error => console.error('Error adding device:', error));
    },
    deleteDevice(id) {
      axios.delete(`/api/qr/${id}`, { headers: { Authorization: `Bearer ${this.$store.state.authToken}` } })
        .then(() => {
          this.fetchDevices();
        })
        .catch(error => console.error('Error deleting device:', error));
    },
    logout() {
      this.$store.commit('clearAuthToken');
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<style scoped>
.device-management .devices .device {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>