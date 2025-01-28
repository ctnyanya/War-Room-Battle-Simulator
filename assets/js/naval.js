const landApp = createApp({
    template: `
        <div class="land-battle">
            <div class="row mb-4">
            </div>
            <div class="row">
                <!-- Axis Forces -->
                <div id="axis-force">
                    <div class="col-12">
                        <h3 class="text-warning mb-4">Axis Forces</h3>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle">
                                <tbody>
                                    <tr v-for="action in airUnits" :key="action.type">
                                        <td class="ps-4">{{ action.label }}</td>
                                        <td v-for="country in axisCountries" :key="country + action.type">
                                            <div class="input-group input-group-sm">
                                                <button class="btn btn-outline-secondary" style="width:30%;"
                                                        @click="adjustUnit(country, action.type, -1)">
                                                    -
                                                </button>
                                                <input type="number" 
                                                       class="form-control text-center" 
                                                       v-model.number="axisForces[country][action.type]"
                                                       min="0"
                                                       readonly>
                                                <button class="btn btn-outline-secondary" style="width:30%;"
                                                        @click="adjustUnit(country, action.type, 1)">
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th style="width: 25%">Axis Commands</th>
                                        <th v-for="country in axisCountries" :key="'axis-' + country">
                                            {{ country }}
                                        </th>
                                    </tr>

                                    <tr v-for="action in surfaceUnits" :key="action.type">
                                        <td class="ps-4">{{ action.label }}</td>
                                        <td v-for="country in axisCountries" :key="country + action.type">
                                            <div class="input-group input-group-sm">
                                                <button class="btn btn-outline-secondary" style="width:30%;"
                                                        @click="adjustUnit(country, action.type, -1)">
                                                    -
                                                </button>
                                                <input type="number" 
                                                       class="form-control text-center" 
                                                       v-model.number="axisForces[country][action.type]"
                                                       min="0"
                                                       readonly>
                                                <button class="btn btn-outline-secondary" style="width:30%;" 
                                                        @click="adjustUnit(country, action.type, 1)">
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Score board -->

                <div id="score-board">
                    <div class="col-12">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle">
                                <tbody>

                                    <tr>
                                        <th>Test</th>

                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Allied Forces -->
                <div id="allied-force">
                    <div class="col-12">
                        <h3 class="text-success mb-4">Allied Forces</h3>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle">
                                <tbody>
                                    <tr v-for="action in airUnits" :key="action.type">
                                        
                                        <td v-for="country in alliedCountries" :key="country + action.type">
                                            <div class="input-group input-group-sm">
                                                <button class="btn btn-outline-secondary" style="width:30%;"
                                                        @click="adjustUnit(country, action.type, -1)">
                                                    -
                                                </button>
                                                <input type="number" 
                                                       class="form-control text-center" 
                                                       v-model.number="alliedForces[country][action.type]"
                                                       min="0"
                                                       readonly>
                                                <button class="btn btn-outline-secondary" style="width:30%;"
                                                        @click="adjustUnit(country, action.type, 1)">
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td class="ps-4">{{ action.label }}</td>
                                    </tr>

                                    <tr>   
                                        <th v-for="country in alliedCountries" :key="'allied-' + country">
                                            {{ country }}
                                        </th>
                                        <th style="width: 25%">Allied Commands</th>
                                    </tr>

                                    <tr v-for="action in surfaceUnits" :key="action.type">
                                        
                                        <td v-for="country in alliedCountries" :key="country + action.type">
                                            <div class="input-group input-group-sm">
                                                <button class="btn btn-outline-secondary" style="width:30%;"
                                                        @click="adjustUnit(country, action.type, -1)">
                                                    -
                                                </button>
                                                <input type="number" 
                                                       class="form-control text-center" 
                                                       v-model.number="alliedForces[country][action.type]"
                                                       min="0"
                                                       readonly>
                                                <button class="btn btn-outline-secondary" style="width:30%;"
                                                        @click="adjustUnit(country, action.type, 1)">
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td class="ps-4">{{ action.label }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>




            <!-- Power Preview -->
            <div class="container mt-5">
                <div class="bar-container">
                    <div class="bar" :style="barStyleA"></div>
                    <div class="label label-left">Axis Air Power: {{ axisAir }}</div>
                    <div class="label label-right">{{ alliedAir }} :Allied Air Power</div>
                </div>
                <div class="bar-container">
                    <div class="bar" :style="barStyleS"></div>
                    <div class="label label-left">Axis Surface Power: {{ axisSurface }}</div>
                    <div class="label label-right">{{ alliedSurface }} :Allied Surface Power</div>
                </div>
            </div>

            <!-- Simulation Controls -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card shadow">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="w-50 me-3">
                                    <label class="form-label">Simulation Runs</label>
                                    <input type="number" min="1" max="100000" 
                                           class="form-control" 
                                           v-model.number="simulationRuns"
                                           :disabled="isSimulating">
                                </div>
                                <button class="btn btn-lg btn-primary" 
                                        :class="{ 'disabled': isSimulating }"
                                        @click="runSimulation">
                                    {{ isSimulating ? 'Simulating...' : 'Start Simulation' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Panel -->
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div class="card-header bg-info text-white">
                            <h4 class="mb-0">Battle Results</h4>
                        </div>
                        <div class="card-body">
                            <div v-if="results" class="row g-4">
                                <!-- Allied Results -->
                                <div class="col-md-4">
                                    <div class="text-center">
                                        <h5 class="text-success">Allied Victory</h5>
                                        <div class="display-4">{{ results.alliedWinRate }}%</div>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-success" 
                                                 :style="{ width: results.alliedWinRate + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Axis Results -->
                                <div class="col-md-4">
                                    <div class="text-center">
                                        <h5 class="text-warning">Axis Victory</h5>
                                        <div class="display-4">{{ results.axisWinRate }}%</div>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-warning" 
                                                 :style="{ width: results.axisWinRate + '%' }"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Loss Statistics -->
                                <div class="col-md-4">
                                    <div class="text-center">
                                        <h5>Average Casualties</h5>
                                        <div class="mb-2">
                                            <span class="text-success">Allied: {{ results.avgAlliedLosses }}</span><br>
                                            <span class="text-warning">Axis: {{ results.avgAxisLosses }}</span>
                                        </div>
                                        <div class="badge bg-secondary">
                                            {{ simulationRuns.toLocaleString() }} simulations
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Empty State -->
                            <div v-else class="text-center text-muted py-4">
                                <i class="bi bi-clipboard-data display-6"></i>
                                <p class="mt-2">No simulation data available<br>
                                <small>Configure forces and run simulation</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            // input config
            alliedCountries: ['UK', 'USSR', 'USA', 'China'],
            axisCountries: ['Germany', 'Japan', 'Italy'],
            airUnits: [
                { type: 'bomber_strategic', label: 'Bomber (Strategic)' },
                { type: 'bomber_air_ground', label: 'Bomber (Air/Ground)' },
                { type: 'fighter_air', label: 'Fighter (Air)' },
                { type: 'fighter_ground', label: 'Fighter (Ground)' },
            ],
            surfaceUnits: [
                { type: 'armor_defensive', label: 'Armor (Defensive)' },
                { type: 'armor_offensive', label: 'Armor (Offensive)' },
                { type: 'artillery_antiair', label: 'Artillery (Anti-air)' },
                { type: 'artillery_ground', label: 'Artillery (Ground)' },
                { type: 'infantry_offensive', label: 'Infantry (Offensive)' },
                { type: 'infantry_defensive', label: 'Infantry (Defensive)' }       
            ],
            // input data
            alliedForces: this.initForces(['UK', 'USSR', 'USA', 'China']),
            axisForces: this.initForces(['Germany', 'Japan', 'Italy']),
            // Simulation controls
            simulationRuns: 1000,
            stats: [],
            results: null,
            isSimulating: false
        }
    },
    computed: {
        alliedAir(){
            return this.computeAir(this.alliedForces);
        },
        axisAir(){
            return this.computeAir(this.axisForces);
        },
        alliedSurface(){
            return this.computeSurface(this.alliedForces);
        },
        axisSurface(){
            return this.computeSurface(this.axisForces);
        },
        barStyleA() {
            const totalPower = this.alliedAir + this.axisAir;

            // If both powers are equal, set bar to 50% green and 50% blue
            if (this.alliedAir === this.axisAir) {
                return {
                    width: '100%',
                    background: 'linear-gradient(to right, #F44336 50%, #2196F3 50%)'
                };
            }

            // Calculate width for Player 1
            const width1 = (this.axisAir / totalPower) * 100;
            const width2 = 100 - width1;
            return {
                width: '100%',
                background: `linear-gradient(to right, #F44336 ${width1}%, #2196F3 ${width1}%, #2196F3 ${width2}%)`
            };
        },
        barStyleS() {
            const totalPower = this.alliedSurface + this.axisSurface;

            // If both powers are equal, set bar to 50% green and 50% blue
            if (this.alliedSurface === this.axisSurface) {
                return {
                    width: '100%',
                    background: 'linear-gradient(to right, #F44336 50%, #2196F3 50%)'
                };
            }

            // Calculate width for Player 1
            const width1 = (this.axisSurface / totalPower) * 100;
            const width2 = 100 - width1;
            return {
                width: '100%',
                background: `linear-gradient(to right, #F44336 ${width1}%, #2196F3 ${width1}%, #2196F3 ${width2}%)`
            };
        },
    },
    mounted(){
        window.vm = this;
        /*
        const types = [
            ...this.airUnits.map(unit => unit.type),
            ...this.surfaceUnits.map(unit => unit.type)
        ];
        types.forEach(type => {
            this.alliedForces[type] = {};
            this.alliedCountries.forEach(country => {
                this.alliedForces[type][country] = 0;
            });
            
            this.axisForces[type] = {};
            this.axisCountries.forEach(country => {
                this.axisForces[type][country] = 0;
            });          
            
        });
        */
    },
    methods: {
        initForces(countries) {
            
            return countries.reduce((acc, country) => {
                acc[country] = {
                    bomber_strategic: 0,
                    bomber_air_ground: 0,
                    fighter_air: 0,
                    fighter_ground: 0,
                    armor_defensive: 0,
                    armor_offensive: 0,
                    artillery_antiair: 0,
                    artillery_ground: 0,
                    infantry_offensive: 0,
                    infantry_defensive: 0,
                };
                return acc;
            }, {});
            
        },
        computeAir(forces){
            var power = 0;
            for (const country in forces){
                const units = forces[country];
                power += units['bomber_strategic'];
                power += units['bomber_air_ground'];
                power += units['fighter_air'] * 3;
                power += units['armor_defensive'];
                power += units['artillery_antiair'] * 2;
            }
            return Math.min(power, this.countSurfaceType(forces) * 10, 30);
        },
        computeSurface(forces){
            var power = 0;
            for (const country in forces){
                const units = forces[country];
                power += units['bomber_air_ground'] * 4;
                power += units['fighter_ground'] * 3;
                power += units['armor_defensive'] * 2;
                power += units['armor_offensive'] * 4;
                power += units['artillery_antiair'];
                power += units['artillery_ground'] * 2;
                power += units['infantry_offensive'] * 2;
                power += units['infantry_defensive'];
            }
            return Math.min(power, this.countSurfaceType(forces) * 10, 30);
        },
        countSurfaceType(forces){
            var hasInfantry = false;
            var hasArtillery = false;
            var hasArmor = false;
            for (const country in forces){
                const units = forces[country];
                if (units['infantry_offensive'] + units['infantry_defensive'] != 0){
                    hasInfantry = true;
                }
                if (units['artillery_antiair'] + units['artillery_ground'] != 0){
                    hasArtillery = true;
                }
                if (units['armor_defensive'] + units['armor_offensive'] != 0){
                    hasArmor = true;
                }
            }
            return hasInfantry * 1 + hasArtillery * 1 + hasArmor * 1;
        },
        adjustUnit(country, action, delta) {
            if (this.alliedForces[country]) {
                this.alliedForces[country][action] = Math.max(
                    this.alliedForces[country][action] + delta,
                    0
                );
            } else {
                this.axisForces[country][action] = Math.max(
                    this.axisForces[country][action] + delta,
                    0
                );
            }
        },
        runSimulation() {
            // Simulation logic here
            console.log('Allied Forces:', JSON.parse(JSON.stringify(this.alliedForces)));
            console.log('Axis Forces:', JSON.parse(JSON.stringify(this.axisForces)));
            
            this.isSimulating = true;
            this.stats = [];
            this.battle();
            setTimeout(() => {
                this.results = {
                    alliedWinRate: 55.2,
                    axisWinRate: 44.8,
                    avgAlliedLosses: '24,500',
                    avgAxisLosses: '31,200'
                };
                this.isSimulating = false;
            }, 2000);
        },
        battle(){
            // Phase I: Dice roll
            
        },
    }
});

landApp.mount('#naval-battle');