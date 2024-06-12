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
                <div class="form-group">
                    <label for="ledPattern">LED Pattern:</label>
                    <select id="ledPattern" v-model="ledPattern" @change="setLEDPattern">
                        <option value="0">Red</option>
                        <option value="1">Green</option>
                        <option value="2">Blue</option>
                        <option value="3">Rainbow</option>
                        <option value="4">Blink</option>
                        <option value="5">Yellow Wipe</option>
                        <option value="6">White Chase</option>
                        <option value="7">Theater Chase Rainbow</option>
                        <option value="8">Color Wipe Rainbow</option>
                        <option value="9">Off</option>
                    </select>
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
                    <li class="list-group-item">
                        Humidity: <span class="value">{{ sensorData.humidity }}%</span>
                    </li>
                    <li class="list-group-item">
                        Temperature: <span class="value">{{ sensorData.temperature }}°C</span>
                    </li>
                    <li class="list-group-item">
                        Heat Index:
                        <span class="heat-index" :class="getHeatIndexClass(sensorData.heatIndex)">
                            {{ sensorData.heatIndex }}°C
                        </span>
                    </li>
                    <li class="list-group-item">
                        Presence: <span class="value"
                            :class="sensorData.presence ? 'text-success' : 'text-danger'">{{ sensorData.presence
        ? 'Detected' : 'Not Detected' }}</span>
                    </li>
                    <li class="list-group-item">
                        Gas Value: <span class="value">{{ sensorData.gasValue }} ppm</span>
                    </li>
                    <li class="list-group-item">
                        Gas Detected: <span class="value"
                            :class="sensorData.gasDetected ? 'text-success' : 'text-danger'">{{
        sensorData.gasDetected
            ? 'Yes' : 'No' }}</span>
                    </li>
                    <li class="list-group-item">
                        UV Value: {{ sensorData.uvValue }}
                        <span class="uv-index" :class="getUVIndexClass(sensorData.uvValue)">
                            {{ getUVIndex(sensorData.uvValue) }}
                        </span>
                    </li>
                </ul>
            </div>
</div>
</div>
</div>

<!-- Modal for Alarm Configuration -->
<div class="modal" tabindex="-1" role="dialog" v-show="showAlarmPopup">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Alarm Configuration</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    @click="toggleModal('Alarm')">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
<div class="modal-body">
                <div class="form-group">
                    <label for="sensor">Sensor:</label>
                    <select id="sensor" v-model="alarmConfig.sensor">
                        <option value="TEMP">Temperature</option>
                        <option value="HUMID">Humidity</option>
                        <option value="GAS">Gas</option>
                        <option value="UV">UV</option>
                    </select>
                </div>
<div class="form-group">
                    <label for="condition">Condition:</label>
                    <select id="condition" v-model="alarmConfig.condition">
                        <option value="VALUE">Value</option>
                        <option value="PRESENCE">Presence</option>
                    </select>
                </div>
<div class="form-group">
                    <label for="comparison">Comparison:</label>
                    <select id="comparison" v-model="alarmConfig.comparison">
                        <option value="ABOVE">Above</option>
                        <option value="BELOW">Below</option>
                    </select>
                </div>
<div class="form-group">
                    <label for="value">Value:</label>
                    <input type="number" id="value" v-model="alarmConfig.value">
                </div>
<div class="form-group">
                    <label for="days">Days:</label>
                    <input type="text" id="days" v-model="alarmConfig.days">
                </div>
<div class="form-group">
                    <label for="startTime">Start Time:</label>
                    <input type="time" id="startTime" v-model="alarmConfig.startTime">
                </div>
<div class="form-group">
                    <label for="endTime">End Time:</label>
                    <input type="time" id="endTime" v-model="alarmConfig.endTime">
                </div>
</div>
<div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="setAlarm">Set Alarm</button>
                <button type="button" class="btn btn-danger" @click="deleteAlarm">Delete Alarm</button>
                <button type="button" class="btn btn-secondary" @click="toggleModal('Alarm')">Close</button>
            </div>
</div>
</div>
</div>