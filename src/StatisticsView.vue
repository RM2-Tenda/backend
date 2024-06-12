<template>
    <div id="statistics" class="container">
        <div class="header">
            <h2>Estatísticas da Tenda</h2>
            <button @click="goHome" class="btn btn-secondary btn-sm">Back</button>
        </div>
        
        <div class="filters">
            <div class="form-group">
                <label for="timeRange">Período:</label>
                <select id="timeRange" v-model="timeRange" @change="onTimeRangeChange">
                    <option value="day">Último Dia</option>
                    <option value="week">Última Semana</option>
                    <option value="month">Último Mês</option>
                    <option value="year">Último Ano</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            
            <div class="form-group" v-if="timeRange === 'custom'">
                <label for="startDate">Data Inicio:</label>
                <input type="date" id="startDate" v-model="startDate" @change="fetchStatistics">
                
                <label for="endDate">Data Fim:</label>
                <input type="date" id="endDate" v-model="endDate" @change="fetchStatistics">
            </div>
            
            <div class="form-group">
                <label for="sensorType">Sensor:</label>
                <select id="sensorType" v-model="sensorType" @change="updateCharts">
                    <option value="all">Todos</option>
                    <option value="humidity">Humidade</option>
                    <option value="temperature">Temperatura</option>
                    <option value="presence">Presença</option>
                    <option value="gas">Gas</option>
                    <option value="uv">UV</option>
                </select>
            </div>
            
            <div class="form-group" v-if="currentTab === 'charts'">
                <label for="chartType">Chart Type:</label>
                <select id="chartType" v-model="chartType" @change="updateCharts">
                    <option value="line">Linhas</option>
                    <option value="bar">Barras</option>
                    <option value="radar">Radar</option>
                </select>
            </div>
        </div>
        <div class="tabs">
            <button @click="currentTab = 'charts'" :class="{ active: currentTab === 'charts' }">Geral</button>
            <button @click="currentTab = 'pie'" :class="{ active: currentTab === 'pie' }">Distribuição</button>
            <button @click="currentTab = 'doughnut'" :class="{ active: currentTab === 'doughnut' }">Presença</button>
            <button @click="currentTab = 'scatter'" :class="{ active: currentTab === 'scatter' }">Gas vs UV</button>
        </div>
        <div v-if="currentTab === 'charts'" id="charts">
            <div v-if="sensorType === 'all' || sensorType === 'humidity'" class="chart-container">
                <h3>Humidade (%)</h3>
                <canvas ref="humidityChart"></canvas>
            </div>
            
            <div v-if="sensorType === 'all' || sensorType === 'temperature'" class="chart-container">
                <h3>Temperatura (°C)</h3>
                <canvas ref="temperatureChart"></canvas>
            </div>
            
            <div v-if="sensorType === 'all' || sensorType === 'presence'" class="chart-container">
                <h3>Presence</h3>
                <canvas ref="presenceChart"></canvas>
            </div>
            
            <div v-if="sensorType === 'all' || sensorType === 'gas'" class="chart-container">
                <h3>Gas (ppm)</h3>
                <canvas ref="gasChart"></canvas>
            </div>
            
            <div v-if="sensorType === 'all' || sensorType === 'uv'" class="chart-container">
                <h3>Valor UV</h3>
                <canvas ref="uvChart"></canvas>
            </div>
        </div>

        <div v-if="currentTab === 'pie'" class="chart-container-small">
            <h3>Distribuição de Sensores</h3>
            <canvas ref="pieChart"></canvas>
        </div>

        <div v-if="currentTab === 'doughnut'" class="chart-container-small">
            <h3>Deteção de Presença</h3>
            <canvas ref="doughnutChart"></canvas>
        </div>
        
        <div v-if="currentTab === 'scatter'" class="chart-container-small">
            <h3>Gas vs. UV</h3>
            <canvas ref="scatterChart"></canvas>
        </div>
        
        <div class="summary">
            <h3>Resumo</h3>
            <p>Período: {{ formatDate(startDate) }} - {{ formatDate(endDate) }}</p>
            
            <div class="summary-item">
                <span>Humidade Média:</span>
                <span>{{ averageHumidity }}%</span>
            </div>
            
            <div class="summary-item">
                <span>Temperatura Média:</span>
                <span>{{ averageTemperature }}°C</span>
            </div>
            
            <div class="summary-item">
                <span>Presenças detetadas:</span>
                <span>{{ presenceCount }} times</span>
            </div>
            
            <div class="summary-item">
                <span>Gás Detetado:</span>
                <span>{{ gasDetectedCount }} times</span>
            </div>
            
            <div class="summary-item">
                <span>Valor UV Máximo:</span>
                <span>{{ maxUVValue }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

export default {
    watch: {
    currentTab() {
        this.$nextTick(() => {
            if (this.currentTab === 'charts') {
                this.updateCharts();
            } else if (this.currentTab === 'pie') {
                this.createPieChart();
            } else if (this.currentTab === 'doughnut') {
                this.createDoughnutChart();
            } else if (this.currentTab === 'scatter') {
                this.createScatterChart();
            }
        });
    },
    startDate() {
        if (this.timeRange === 'custom') {
            this.fetchStatistics();
        }
    },
    endDate() {
        if (this.timeRange === 'custom') {
            this.fetchStatistics();
        }
    }
},
    props: ['deviceId'],
    data() {
        return {
            timeRange: 'day',
            sensorType: 'all',
            chartType: 'line',
            startDate: new Date().toISOString().substr(0, 10),
            endDate: new Date().toISOString().substr(0, 10),
            statistics: [],
            currentTab: 'charts'
        };
    },
    computed: {
        averageHumidity() {
            if (this.statistics.length === 0) return 0;
            const sum = this.statistics.reduce((acc, stat) => acc + stat.humidity, 0);
            return (sum / this.statistics.length).toFixed(2);
        },
        averageTemperature() {
            if (this.statistics.length === 0) return 0;
            const sum = this.statistics.reduce((acc, stat) => acc + stat.temperature, 0);
            return (sum / this.statistics.length).toFixed(2);
        },
        presenceCount() {
            return this.statistics.filter(stat => stat.presence).length;
        },
        gasDetectedCount() {
            return this.statistics.filter(stat => stat.gas_detected).length;
        },
        maxUVValue() {
            if (this.statistics.length === 0) return 0;
            return Math.max(...this.statistics.map(stat => stat.uv_value));
        }
    },
    created() {
        this.fetchStatistics();
    },
    methods: {
        goHome() {
            this.$router.push({ name: 'home' });
        },
        async fetchStatistics() {
        try {
            const params = {
                device_id: this.deviceId,
                time_range: this.timeRange,
                start_date: this.startDate,
                end_date: this.endDate
            };
            const response = await axios.get('https://rm2-backend-f78fbf915aa5.herokuapp.com/api/statistics/history', { params });
            this.statistics = response.data.statistics;
            this.$nextTick(() => {
                this.updateCharts();
                this.createPieChart();
                this.createDoughnutChart();
                this.createScatterChart();
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    },
    onTimeRangeChange() {
        if (this.timeRange !== 'custom') {
            const now = new Date();
            this.endDate = now.toISOString().substr(0, 10);
            if (this.timeRange === 'day') {
                this.startDate = new Date(now.setDate(now.getDate() - 1)).toISOString().substr(0, 10);
            } else if (this.timeRange === 'week') {
                this.startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().substr(0, 10);
            } else if (this.timeRange === 'month') {
                this.startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString().substr(0, 10);
            } else if (this.timeRange === 'year') {
                this.startDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().substr(0, 10);
            }
            this.fetchStatistics();
        }
    },
        createPieChart() {
            const sensorTypes = ['humidity', 'temperature', 'presence', 'gas', 'uv'];
            const sensorCounts = sensorTypes.map(type => this.statistics.filter(stat => stat[type] !== undefined).length);

            if (this.pieChartInstance) {
                this.pieChartInstance.destroy();
            }

            this.pieChartInstance = new Chart(this.$refs.pieChart, {
                type: 'pie',
                data: {
                    labels: sensorTypes,
                    datasets: [{
                        data: sensorCounts,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        },
        createDoughnutChart() {
            const presenceCount = this.statistics.filter(stat => stat.presence).length;
            const noPresenceCount = this.statistics.length - presenceCount;

            if (this.doughnutChartInstance) {
                this.doughnutChartInstance.destroy();
            }

            this.doughnutChartInstance = new Chart(this.$refs.doughnutChart, {
                type: 'doughnut',
                data: {
                    labels: ['Presence Detected', 'No Presence'],
                    datasets: [{
                        data: [presenceCount, noPresenceCount],
                        backgroundColor: ['#FF6384', '#36A2EB']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        },
        createScatterChart() {
            const gasData = this.statistics.map(stat => stat.gas_value);
            const uvData = this.statistics.map(stat => stat.uv_value);

            if (this.scatterChartInstance) {
                this.scatterChartInstance.destroy();
            }

            this.scatterChartInstance = new Chart(this.$refs.scatterChart, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Gas vs. UV Values',
                        data: gasData.map((value, index) => ({ x: value, y: uvData[index] })),
                        backgroundColor: '#FF6384'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Gas Value (ppm)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'UV Value'
                            }
                        }
                    }
                }
            });
        },
        updateCharts() {
        this.$nextTick(() => {
            const labels = this.statistics.map(stat => new Date(stat.timestamp).toISOString());
            const humidityData = this.statistics.map(stat => stat.humidity);
            const temperatureData = this.statistics.map(stat => stat.temperature);
            const presenceData = this.statistics.map(stat => stat.presence ? 1 : 0);
            const gasData = this.statistics.map(stat => stat.gas_value);
            const uvData = this.statistics.map(stat => stat.uv_value);

            if (this.$refs.humidityChart) {
                this.createChart(this.$refs.humidityChart, 'Humidity (%)', labels, humidityData, 'humidityChartInstance');
            }
            if (this.$refs.temperatureChart) {
                this.createChart(this.$refs.temperatureChart, 'Temperature (°C)', labels, temperatureData, 'temperatureChartInstance');
            }
            if (this.$refs.presenceChart) {
                this.createChart(this.$refs.presenceChart, 'Presence', labels, presenceData, 'presenceChartInstance');
            }
            if (this.$refs.gasChart) {
                this.createChart(this.$refs.gasChart, 'Gas Value (ppm)', labels, gasData, 'gasChartInstance');
            }
            if (this.$refs.uvChart) {
                this.createChart(this.$refs.uvChart, 'UV Value', labels, uvData, 'uvChartInstance');
            }
        });
    },
    createChart(canvas, label, labels, data, chartInstanceName) {
        if (this[chartInstanceName]) {
            this[chartInstanceName].destroy();
        }

        
        console.log(`Creating chart: ${label}`);
        console.log('Labels:', labels);
        console.log('Data:', data);

        
        const filteredData = data.map(value => {
            if (value === 0 && label !== 'Presence') {
                return null;
            }
            return value;
        });

        
        const filteredLabels = labels.filter((_, index) => filteredData[index] !== null);
        const finalData = filteredData.filter(value => value !== null);

        
        const dataWithoutOutliers = label !== 'Presence' ? this.removeOutliers(finalData) : finalData;

        
        const formattedLabels = this.chartType === 'bar' ? filteredLabels.map(date => new Date(date).toLocaleDateString()) : filteredLabels;

        
        console.log('Filtered Labels:', filteredLabels);
        console.log('Filtered Data:', dataWithoutOutliers);

        this[chartInstanceName] = new Chart(canvas, {
            type: this.chartType,
            data: {
                labels: formattedLabels,
                datasets: [{
                    label: label,
                    data: dataWithoutOutliers,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: this.chartType === 'line' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: this.chartType === 'line'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        type: this.chartType === 'line' ? 'time' : 'category',
                        time: {
                            unit: this.getTimeUnit()
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },
    getTimeUnit() {
        if (this.timeRange === 'day') {
            return 'hour';
        } else if (this.timeRange === 'week') {
            return 'day';
        } else if (this.timeRange === 'month') {
            return 'week';
        } else if (this.timeRange === 'year') {
            return 'month';
        } else {
            
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);
            const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

            if (diffInDays <= 1) {
                return 'hour';
            } else if (diffInDays <= 7) {
                return 'day';
            } else if (diffInDays <= 30) {
                return 'week';
            } else {
                return 'month';
            }
        }
    },
        removeOutliers(data) {
            const sortedData = data.slice().sort((a, b) => a - b);
            const q1 = sortedData[Math.floor((sortedData.length / 4))];
            const q3 = sortedData[Math.ceil((sortedData.length * (3 / 4)))];
            const iqr = q3 - q1;
            const lowerBound = q1 - 1.5 * iqr;
            const upperBound = q3 + 1.5 * iqr;

            return data.filter(value => value >= lowerBound && value <= upperBound);
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
    }
}
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    height: 100vh; /* Ensure the container takes the full viewport height */
    overflow-y: auto; /* Enable vertical scrolling */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    flex: 1;
}

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tabs button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.tabs button.active {
    background-color: #0056b3;
}

.tabs button:hover {
    background-color: #0056b3;
}

#charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
}

.chart-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-container-small {
    background-color: #fff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
}

.summary {
    margin-top: 40px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

h2, h3 {
    color: #333;
}

label {
    display: block;
    margin-bottom: 5px;
}

select, input[type="date"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
}
.chart-container-2 {
max-width: 600px;
margin: 0 auto;
}
@media (max-width: 768px) {
.chart-container-2 {
max-width: 100%;
}
}
</style>