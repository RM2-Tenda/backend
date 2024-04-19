<template>
    <center>
        <div id="home" class="container">
            <div class="text-right">
                <img src="./assets/logo.png" alt="RM2 Logo" class="logo">
                <button @click="logout" class="btn btn-secondary btn-sm">Log out</button>
            </div>
            <h2 class="my-4">Bem-vindo à RM2!</h2>
            <div id="map" class="map-container mb-4"></div>
            <!-- Placeholder for map, replace with actual map integration
                <img src="path_to_map_image" alt="Map" class="img-fluid" /> -->
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
                            <li class="list-group-item">Heat Index: {{ sensorData.heatIndex }}°C</li>
                            <li class="list-group-item">
                                Presence:
                                <span
                                    v-bind:class="{ 'text-success': sensorData.presence, 'text-danger': !sensorData.presence }">
                                    {{ sensorData.presence ? 'Presence detected!' : 'No presence' }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </center>
</template>

<script>
import axios from 'axios'; // Ensure axios is imported to make HTTP requests

export default {
    data() {
        return {
            map: null,
            showLEDPopup: false,
            showSensorPopup: false,
            leds: [
                { status: false } // Initially off; repeat this object to add more LEDs
            ],
            ledState: false,  // This represents the LED on/off state
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
        this.sensorDataInterval = setInterval(this.fetchSensorData, 5000); // Fetch data every 5 seconds
    },
    beforeUnmount() {
        clearInterval(this.sensorDataInterval); // Clear the interval when the component is destroyed
    },
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
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
                }, () => {
                    this.handleLocationError(true, this.map, this.map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                this.handleLocationError(false, this.map, this.map.getCenter());
            }
        },
        handleLocationError(browserHasGeolocation, map, pos) {
            alert(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            if (map) map.setCenter(pos);
        },
        logout() {
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
            // This should now send the index and status of the LED to your API
            const ledState = this.leds[index].status;
            try {
                console.log("10.0.2.2");
                await axios.post('https://rm2-backend-f78fbf915aa5.herokuapp.com/api/button/set', { index: index, result: ledState });
                // Handle the response as needed
            } catch (error) {
                console.error('Error updating LED state:', error);
                // Optionally revert the LED toggle if the request fails
                this.leds[index].status = !ledState;
                alert('Failed to update LED state.');
            }
        },
        async fetchSensorData() {
            try {
                const response = await axios.get('https://rm2-backend-f78fbf915aa5.herokuapp.com/api/statistics');
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
                    const [humidity, temperature, presence] = latestData.split(',');
                    this.sensorData.humidity = parseFloat(humidity);
                    this.sensorData.temperature = parseFloat(temperature);

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