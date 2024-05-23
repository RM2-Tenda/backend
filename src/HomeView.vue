<template>
    <center>
        <div id="home" class="container">
            <div class="text-right">
                <img src="./assets/logo.png" alt="RM2 Logo" class="logo">
                <button @click="logout" class="btn btn-secondary btn-sm">Log out</button>
            </div>
            <h2 class="my-4">Bem-vindo à RM2!</h2>
            <div id="map" class="map-container mb-4"></div>
        </div>
        <h3 class="mb-3">Veja também...</h3>
        <button @click="toggleModal('LED')" class="btn btn-primary">Controlo de LEDS</button>
        <button @click="toggleModal('Sensor')" class="btn btn-info">Valores dos sensores</button>

        <!-- Modal for LED Control -->
        <div class="modal" tabindex="-1" role="dialog" v-show="showLEDPopup">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">LED Control</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click="toggleModal('LED')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-for="(state, index) in leds" :key="index" class="led-control">
                            <p class="lead">LED {{ index + 1 }}:</p>
                            <label class="switch">
                                <input type="checkbox" v-model="state.status" @change="setLED(index)">
                                <span class="slider round"></span>
                            </label>
                            <i v-bind:class="['led-light', state.status ? 'led-light-on' : 'led-light-off']"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Sensor Values -->
        <div class="modal" tabindex="-1" role="dialog" v-show="showSensorPopup">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Sensor Values</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click="toggleModal('Sensor')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group">
                            <li class="list-group-item">Humidity: {{ sensorData.humidity }}%</li>
                            <li class="list-group-item">Temperature: {{ sensorData.temperature }}°C</li>
                            <li class="list-group-item">Heat Index: {{ sensorData.heatIndex }}</li>
                            <li class="list-group-item">Presence: <span
                                    :class="sensorData.presence ? 'text-success' : 'text-danger'">{{ sensorData.presence
                    ? 'Detected' : 'Not Detected' }}</span></li>
                            <li class="list-group-item">Gas Value: {{ sensorData.gasValue }}</li>
                            <li class="list-group-item">Gas Detected: <span
                                    :class="sensorData.gasDetected ? 'text-danger' : 'text-success'">{{
                    sensorData.gasDetected ? 'Yes' : 'No' }}</span></li>
                            <li class="list-group-item">UV Value: {{ sensorData.uvValue }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </center>
</template>

<script>
import axios from 'axios';
import VueCookie from 'vue-cookie';

export default {
    props: ['deviceId'],
    data() {
        return {
            locationPermissionGranted: false,
            map: null,
            showLEDPopup: false,
            showSensorPopup: false,
            leds: [
                { status: false }
            ],
            ledState: false,
            sensorData: {
                humidity: 0,
                temperature: 0,
                heatIndex: 0,
                presence: false
            }
        };
    },
    created() {
        this.fetchSensorData();
        this.sensorDataInterval = setInterval(this.fetchSensorData, 500);
    },
    beforeUnmount() {
        clearInterval(this.sensorDataInterval);
    },
    mounted() {
        this.checkLocationPermission();
    },
    methods: {
        checkLocationPermission() {
            const permissionCookie = VueCookie.get('locationPermission');
            if (permissionCookie === 'granted') {
                this.locationPermissionGranted = true;
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.initMap(position);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                    }
                );
            } else {
                this.requestLocationPermission();
            }
        },

        requestLocationPermission() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.locationPermissionGranted = true;
                        VueCookie.set('locationPermission', 'granted', { expires: '1Y' });
                        this.initMap(position);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        VueCookie.set('locationPermission', 'denied', { expires: '1Y' });
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        },
        initMap(position) {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            this.map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 15
            });

            new google.maps.Marker({
                position: pos,
                map: this.map,
                title: 'Your location'
            });
        },
        handleLocationError(browserHasGeolocation, map, pos) {
            alert(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            if (map) map.setCenter(pos);
        },
        logout() {
            this.$store.commit('clearAuthToken');
            this.$router.push({ name: 'login' });
        },
        toggleModal(type) {
            if (type === 'LED') {
                this.showLEDPopup = !this.showLEDPopup;
            } else if (type === 'Sensor') {
                this.showSensorPopup = !this.showSensorPopup;
            }
        },
        async setLED(index) {
            const ledState = this.leds[index].status;
            try {
                console.log("10.0.2.2");
                await axios.post('https://rm2-backend-f78fbf915aa5.herokuapp.com/api/button/set', { index: index, result: ledState });
            } catch (error) {
                console.error('Error updating LED state:', error);
                this.leds[index].status = !ledState;
                alert('Failed to update LED state.');
            }
        },
        async fetchSensorData() {
            try {
                const deviceId = this.deviceId;
                const response = await axios.get(`https://rm2-backend-f78fbf915aa5.herokuapp.com/api/statistics?device_id=${deviceId}`, {
                    headers: { Authorization: `Bearer ${this.$store.state.authToken}` }
                });
                const latestData = response.data.statistics.slice(-1)[0];
                const c1 = -8.78469475556;
                const c2 = 1.61139411;
                const c3 = 2.33854883889;
                const c4 = -0.14611605;
                const c5 = -0.012308094;
                const c6 = -0.0164248277778;
                const c7 = 0.002211732;
                const c8 = 0.00072546;
                const c9 = -0.000003582;

                if (latestData) {
                    const [humidity, temperature, presence, gasValue, gasDetected, uvValue] = latestData.split(',');
                    this.sensorData.humidity = parseFloat(humidity);
                    this.sensorData.temperature = parseFloat(temperature);
                    this.sensorData.presence = parseInt(presence) === 1;
                    this.sensorData.gasValue = parseInt(gasValue);
                    this.sensorData.gasDetected = parseInt(gasDetected) === 1;
                    this.sensorData.uvValue = parseInt(uvValue);

                    // Calculate heat index
                    const T = parseFloat(temperature);
                    const RH = parseFloat(humidity) / 100;

                    const heatIndex = c1 +
                        c2 * T +
                        c3 * RH +
                        c4 * T * RH +
                        c5 * T * T +
                        c6 * RH * RH +
                        c7 * T * T * RH +
                        c8 * T * RH * RH +
                        c9 * T * T * RH * RH;

                    this.sensorData.heatIndex = heatIndex.toFixed(2);
                    this.sensorData.presence = parseInt(presence) === 1;
                }

            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        }
    }
}
</script>



<style scoped>
.map-container {
    height: 400px;
    width: 100%;
}

.map-container img {
    max-width: 100%;
    height: auto;
    border-radius: 0.25rem;
}

.logo {
    height: 50px;

}

.modal {
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    padding-top: 100px;
}

.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.led-control {
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 1rem;
}

.led-light {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-left: 15px;
    background-color: #ccc;
}

.led-light-on {
    background-color: #ff0;
}

.led-light-off {
    background-color: #888;
}

.list-group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text-success {
    color: #28a745;
}

.text-danger {
    color: #dc3545;
}
</style>