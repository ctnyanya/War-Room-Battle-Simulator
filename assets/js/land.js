const landApp = createApp({
    template: `
        <div class="land-battle">
            <div class="row">
            
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-bordered align-middle">
                            <tbody>
                                <tr v-for="action in airUnits" :key="action.type">
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
                                    
                                    <td class="ps-4">{{ action.label }}</td>
                                    
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
                                </tr>

                                <tr>
                                    <th v-for="country in axisCountries" :key="'axis-' + country">
                                        {{ country }}
                                    </th>
                                    
                                    <th><span class="text-danger">Axis</span> vs <span class="text-primary">Allied</span></th>
                                    
                                    <th v-for="country in alliedCountries" :key="'allied-' + country">
                                        {{ country }}
                                    </th>
                                </tr>

                                <tr v-for="action in surfaceUnits" :key="action.type">

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
                                    
                                    <td class="ps-4">{{ action.label }}</td>
                                    
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
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>




            <!-- Power Preview -->
            <div class="container mt-5">
                <div class="bar-container">
                    <div class="bar" :style="barStyle(axisAir, alliedAir)"></div>
                    <div class="label label-left">Axis Air Power: {{ axisAir }}</div>
                    <div class="label label-right">{{ alliedAir }} :Allied Air Power</div>
                </div>
                <div class="bar-container">
                    <div class="bar" :style="barStyle(axisSurface, alliedSurface)"></div>
                    <div class="label label-left">Axis Surface Power: {{ axisSurface }} <span v-if="countSurfaceType(axisForces) > countSurfaceType(alliedForces)">(FORCE ADVANTAGE!)</span></div>
                    <div class="label label-right"><span v-if="countSurfaceType(axisForces) < countSurfaceType(alliedForces)">(FORCE ADVANTAGE!)</span> {{ alliedSurface }} :Allied Surface Power</div>
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
                                    <div>
                                        <input type="number" min="1" max="100000" 
                                               class="form-control" 
                                               v-model.number="simulationRuns"
                                               :disabled="isSimulating">
                                    </div>
                                    <!--
                                    <div v-show="false">
                                        <div class="progress">
                                          <div
                                            class="progress-bar"
                                            role="progressbar"
                                            :style="{ width: progressPercentage + '%' }"
                                            aria-valuenow="progressPercentage"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                          >
                                            {{ currentRun }} / {{ simulationRuns }}
                                          </div>
                                        </div>
                                        <p>Current Round: {{ currentRun }} of {{ simulationRuns }}</p>
                                    </div>
                                    -->

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
                        <div class="card-body flex-grow-1">
                            <div v-if="results">
                                <div class="row mb-4">
                                <!-- Axis Results -->
                                <div class="col-md-2">
                                    <div class="text-center">
                                        <h5 class="text-danger">Eliminate all air</h5>
                                        <div class="display-4-small">{{ results.axisElimAllAir }}%</div>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-danger" 
                                                 :style="{ width: results.axisElimAllAir + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="text-center">
                                        <h5 class="text-danger">Eliminate all surface</h5>
                                        <div class="display-4-small">{{ results.axisElimAllSurface }}%</div>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-danger" 
                                                 :style="{ width: results.axisElimAllSurface + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Allied Results -->
                                <div class="col-md-2">
                                    <div class="text-center">
                                        <h5 class="text-primary">Eliminate all air</h5>
                                        <div class="display-4-small">{{ results.alliedElimAllAir }}%</div>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-primary" 
                                                 :style="{ width: results.alliedElimAllAir + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="text-center">
                                        <h5 class="text-primary">Eliminate all surface</h5>
                                        <div class="display-4-small">{{ results.alliedElimAllSurface }}%</div>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-primary" 
                                                 :style="{ width: results.alliedElimAllSurface + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Loss Statistics -->
                                <div class="col-md-4">
                                    <div class="text-center">
                                        <h5>Average Casualties</h5>
                                        <div class="mb-2">
                                            <span class="text-danger">Axis: {{ results.axisAvgCasualties }}</span>
                                            <span class="text-primary">Allied: {{ results.alliedAvgCasualties }}</span><br>
                                            
                                        </div>
                                        <div class="badge bg-secondary">
                                            {{ simulationRuns.toLocaleString() }} simulations
                                        </div>
                                    </div>
                                </div>
                                </div>

                                <div class="row mb-4">
                                    <div class="text-center">
                                        <h5>Random Run Sample</h5>
                                        <table class="table table-bordered align-middle">
                                            <tbody>
                                                <tr>  
                                                    <td><p class="text-danger">Bomber</p></td>
                                                    <td><p class="text-success">Fighter</p></td>
                                                    <td><p class="text-success">Armor</p></td>
                                                    <td><p class="text-primary">Artillery</p></td>
                                                    <td><p class="text-warning">Infantry</p></td>
                                                    <td><span class="text-danger">Axis</span> / <span class="text-primary">Allied</span></td>
                                                    <td><p class="text-warning">Infantry</p></td>
                                                    <td><p class="text-primary">Artillery</p></td>
                                                    <td><p class="text-success">Armor</p></td>
                                                    <td><p class="text-success">Fighter</p></td>
                                                    <td><p class="text-danger">Bomber</p></td>
                                                </tr>
                                                <tr>
                                                    <td>{{ axisCommited['bomber'] }}</td>
                                                    <td>{{ axisCommited['fighter'] }}</td>
                                                    <td>{{ axisCommited['armor'] }}</td>
                                                    <td>{{ axisCommited['artillery'] }}</td>
                                                    <td>{{ axisCommited['infantry'] }}</td>
                                                    <td><b>Commited</b></td>
                                                    <td>{{ alliedCommited['infantry'] }}</td>
                                                    <td>{{ alliedCommited['artillery'] }}</td>
                                                    <td>{{ alliedCommited['armor'] }}</td>
                                                    <td>{{ alliedCommited['fighter'] }}</td>
                                                    <td>{{ alliedCommited['bomber'] }}</td>                                       
                                                </tr>
                                                <tr>
                                                    <td>{{ firstAxisStat['survived']['bomber'] }}</td>
                                                    <td>{{ firstAxisStat['survived']['fighter'] }}</td>
                                                    <td>{{ firstAxisStat['survived']['armor'] }}</td>
                                                    <td>{{ firstAxisStat['survived']['artillery'] }}</td>
                                                    <td>{{ firstAxisStat['survived']['infantry'] }}</td>
                                                    <td><p class="text-success">Survived</p></td>
                                                    <td>{{ firstAlliedStat['survived']['infantry'] }}</td>
                                                    <td>{{ firstAlliedStat['survived']['artillery'] }}</td>
                                                    <td>{{ firstAlliedStat['survived']['armor'] }}</td>
                                                    <td>{{ firstAlliedStat['survived']['fighter'] }}</td>
                                                    <td>{{ firstAlliedStat['survived']['bomber'] }}</td>
                                                </tr>
                                                <tr>
                                                    <td>{{ firstAxisStat['damaged']['bomber'] }}</td>
                                                    <td>{{ firstAxisStat['damaged']['fighter'] }}</td>
                                                    <td>{{ firstAxisStat['damaged']['armor'] }}</td>
                                                    <td>{{ firstAxisStat['damaged']['artillery'] }}</td>
                                                    <td>{{ firstAxisStat['damaged']['infantry'] }}</td>
                                                    <td><p class="text-danger">Damaged</p></td>
                                                    <td>{{ firstAlliedStat['damaged']['infantry'] }}</td>
                                                    <td>{{ firstAlliedStat['damaged']['artillery'] }}</td>
                                                    <td>{{ firstAlliedStat['damaged']['armor'] }}</td>
                                                    <td>{{ firstAlliedStat['damaged']['fighter'] }}</td>
                                                    <td>{{ firstAlliedStat['damaged']['bomber'] }}</td>
                                                </tr>
                                                <tr>
                                                    <td>{{ firstAxisStat['destroyed']['bomber'] }}</td>
                                                    <td>{{ firstAxisStat['destroyed']['fighter'] }}</td>
                                                    <td>{{ firstAxisStat['destroyed']['armor'] }}</td>
                                                    <td>{{ firstAxisStat['destroyed']['artillery'] }}</td>
                                                    <td>{{ firstAxisStat['destroyed']['infantry'] }}</td>
                                                    <td><p class="text-muted">Destroyed</p></td>
                                                    <td>{{ firstAlliedStat['destroyed']['infantry'] }}</td>
                                                    <td>{{ firstAlliedStat['destroyed']['artillery'] }}</td>
                                                    <td>{{ firstAlliedStat['destroyed']['armor'] }}</td>
                                                    <td>{{ firstAlliedStat['destroyed']['fighter'] }}</td>
                                                    <td>{{ firstAlliedStat['destroyed']['bomber'] }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="bar-container">
                                            <div class="bar" :style="barStyle(firstAxisStat['casualties'], firstAlliedStat['casualties'])"></div>
                                            <div class="label label-left">Axis Casualties: {{ firstAxisStat['casualties'] }}</div>
                                            <div class="label label-right">{{ firstAlliedStat['casualties'] }} :Allied Casualties</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-4">
                                    <div class="text-center">
                                        <h5>Median Run Sample</h5>
                                        <table class="table table-bordered align-middle">
                                            <tbody>
                                                <tr>  
                                                    <td><p class="text-danger">Bomber</p></td>
                                                    <td><p class="text-success">Fighter</p></td>
                                                    <td><p class="text-success">Armor</p></td>
                                                    <td><p class="text-primary">Artillery</p></td>
                                                    <td><p class="text-warning">Infantry</p></td>
                                                    <td><span class="text-danger">Axis</span> / <span class="text-primary">Allied</span></td>
                                                    <td><p class="text-warning">Infantry</p></td>
                                                    <td><p class="text-primary">Artillery</p></td>
                                                    <td><p class="text-success">Armor</p></td>
                                                    <td><p class="text-success">Fighter</p></td>
                                                    <td><p class="text-danger">Bomber</p></td>
                                                </tr>
                                                <tr>
                                                    <td>{{ axisCommited['bomber'] }}</td>
                                                    <td>{{ axisCommited['fighter'] }}</td>
                                                    <td>{{ axisCommited['armor'] }}</td>
                                                    <td>{{ axisCommited['artillery'] }}</td>
                                                    <td>{{ axisCommited['infantry'] }}</td>
                                                    <td><b>Commited</b></td>
                                                    <td>{{ alliedCommited['infantry'] }}</td>
                                                    <td>{{ alliedCommited['artillery'] }}</td>
                                                    <td>{{ alliedCommited['armor'] }}</td>
                                                    <td>{{ alliedCommited['fighter'] }}</td>
                                                    <td>{{ alliedCommited['bomber'] }}</td>                                       
                                                </tr>
                                                <tr>
                                                    <td>{{ medianAxisStat['survived']['bomber'] }}</td>
                                                    <td>{{ medianAxisStat['survived']['fighter'] }}</td>
                                                    <td>{{ medianAxisStat['survived']['armor'] }}</td>
                                                    <td>{{ medianAxisStat['survived']['artillery'] }}</td>
                                                    <td>{{ medianAxisStat['survived']['infantry'] }}</td>
                                                    <td><p class="text-success">Survived</p></td>
                                                    <td>{{ medianAlliedStat['survived']['infantry'] }}</td>
                                                    <td>{{ medianAlliedStat['survived']['artillery'] }}</td>
                                                    <td>{{ medianAlliedStat['survived']['armor'] }}</td>
                                                    <td>{{ medianAlliedStat['survived']['fighter'] }}</td>
                                                    <td>{{ medianAlliedStat['survived']['bomber'] }}</td>
                                                </tr>
                                                <tr>
                                                    <td>{{ medianAxisStat['damaged']['bomber'] }}</td>
                                                    <td>{{ medianAxisStat['damaged']['fighter'] }}</td>
                                                    <td>{{ medianAxisStat['damaged']['armor'] }}</td>
                                                    <td>{{ medianAxisStat['damaged']['artillery'] }}</td>
                                                    <td>{{ medianAxisStat['damaged']['infantry'] }}</td>
                                                    <td><p class="text-danger">Damaged</p></td>
                                                    <td>{{ medianAlliedStat['damaged']['infantry'] }}</td>
                                                    <td>{{ medianAlliedStat['damaged']['artillery'] }}</td>
                                                    <td>{{ medianAlliedStat['damaged']['armor'] }}</td>
                                                    <td>{{ medianAlliedStat['damaged']['fighter'] }}</td>
                                                    <td>{{ medianAlliedStat['damaged']['bomber'] }}</td>
                                                </tr>
                                                <tr>
                                                    <td>{{ medianAxisStat['destroyed']['bomber'] }}</td>
                                                    <td>{{ medianAxisStat['destroyed']['fighter'] }}</td>
                                                    <td>{{ medianAxisStat['destroyed']['armor'] }}</td>
                                                    <td>{{ medianAxisStat['destroyed']['artillery'] }}</td>
                                                    <td>{{ medianAxisStat['destroyed']['infantry'] }}</td>
                                                    <td><p class="text-muted">Destroyed</p></td>
                                                    <td>{{ medianAlliedStat['destroyed']['infantry'] }}</td>
                                                    <td>{{ medianAlliedStat['destroyed']['artillery'] }}</td>
                                                    <td>{{ medianAlliedStat['destroyed']['armor'] }}</td>
                                                    <td>{{ medianAlliedStat['destroyed']['fighter'] }}</td>
                                                    <td>{{ medianAlliedStat['destroyed']['bomber'] }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="bar-container">
                                            <div class="bar" :style="barStyle(medianAxisStat['casualties'], medianAlliedStat['casualties'])"></div>
                                            <div class="label label-left">Axis Casualties: {{ medianAxisStat['casualties'] }}</div>
                                            <div class="label label-right">{{ medianAlliedStat['casualties'] }} :Allied Casualties</div>
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
            currentRun: 0,
            isSimulating: false,
            
            // Result 
            alliedCommited: {},
            axisCommited: {},
            alliedStats: [],
            axisStats: [],
            results: null,
            
            
            
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

        firstAlliedStat(){
            return this.alliedStats[Math.floor(Math.random() * this.alliedStats.length)];
        },
        firstAxisStat(){
            return this.axisStats[Math.floor(Math.random() * this.axisStats.length)];
        },
        medianAlliedStat(){
            return this.alliedStats[Math.floor(this.alliedStats.length / 2)];
        },
        medianAxisStat(){
            console.log(Math.floor(this.axisStats.length / 2))
            return this.axisStats[Math.floor(this.axisStats.length / 2)];
        },
        progressPercentage(){
            return (this.currentRun / this.simulationRuns) * 100;
        }
    },
    mounted(){
        window.vm = this;
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
            return Math.min(power, Math.max(this.countSurfaceType(forces), 1) * 10, 30);
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
            return Math.min(power, Math.max(this.countSurfaceType(forces), 1) * 10, 30);
        },
        barStyle(leftVal, rightVal) {
            const totalPower = leftVal + rightVal;

            // If both powers are equal, set bar to 50% green and 50% blue
            if (leftVal === rightVal) {
                return {
                    width: '100%',
                    background: 'linear-gradient(to right, #F44336 50%, #2196F3 50%)'
                };
            }

            // Calculate width for Player 1
            const width1 = (leftVal / totalPower) * 100;
            const width2 = 100 - width1;
            return {
                width: '100%',
                background: `linear-gradient(to right, #F44336 ${width1}%, #2196F3 ${width1}%, #2196F3 ${width2}%)`
            };
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
            this.isSimulating = true;
            this.alliedStats = [];
            this.axisStats = [];
            
            //count unit commited
            this.alliedCommited['bomber'] = 0;
            this.alliedCommited['fighter'] = 0;
            this.alliedCommited['armor'] = 0;
            this.alliedCommited['artillery'] = 0;
            this.alliedCommited['infantry'] = 0;
            
            this.axisCommited['bomber'] = 0;
            this.axisCommited['fighter'] = 0;
            this.axisCommited['armor'] = 0;
            this.axisCommited['artillery'] = 0;
            this.axisCommited['infantry'] = 0;
            
            for (const country in this.alliedForces){
                this.alliedCommited['bomber'] += this.alliedForces[country]['bomber_air_ground'] + this.alliedForces[country]['bomber_strategic'];
                this.alliedCommited['fighter'] += this.alliedForces[country]['fighter_air'] + this.alliedForces[country]['fighter_ground'];
                this.alliedCommited['armor'] += this.alliedForces[country]['armor_defensive'] + this.alliedForces[country]['armor_offensive'];
                this.alliedCommited['artillery'] += this.alliedForces[country]['artillery_antiair'] + this.alliedForces[country]['artillery_ground'];
                this.alliedCommited['infantry'] += this.alliedForces[country]['infantry_defensive'] + this.alliedForces[country]['infantry_offensive']; 
            }
            
            for (const country in this.axisForces){
                this.axisCommited['bomber'] += this.axisForces[country]['bomber_air_ground'] + this.axisForces[country]['bomber_strategic'];
                this.axisCommited['fighter'] += this.axisForces[country]['fighter_air'] + this.axisForces[country]['fighter_ground'];
                this.axisCommited['armor'] += this.axisForces[country]['armor_defensive'] + this.axisForces[country]['armor_offensive'];
                this.axisCommited['artillery'] += this.axisForces[country]['artillery_antiair'] + this.axisForces[country]['artillery_ground'];
                this.axisCommited['infantry'] += this.axisForces[country]['infantry_defensive'] + this.axisForces[country]['infantry_offensive']; 
            }
            
            for (let i = 0; i < this.simulationRuns; i++){
                this.currentRun = i;
                var axisStat = {
                    survived: {
                        bomber: 0,
                        fighter: 0,
                        armor: 0,
                        artillery: 0,
                        infantry: 0
                    },
                    damaged: {
                        bomber: 0,
                        fighter: 0,
                        armor: 0,
                        artillery: 0,
                        infantry: 0
                    },
                    destroyed: {
                        bomber: 0,
                        fighter: 0,
                        armor: 0,
                        artillery: 0,
                        infantry: 0
                    },
                };
                var alliedStat = {
                    survived: {
                        bomber: 0,
                        fighter: 0,
                        armor: 0,
                        artillery: 0,
                        infantry: 0
                    },
                    damaged: {
                        bomber: 0,
                        fighter: 0,
                        armor: 0,
                        artillery: 0,
                        infantry: 0
                    },
                    destroyed: {
                        bomber: 0,
                        fighter: 0,
                        armor: 0,
                        artillery: 0,
                        infantry: 0
                    },
                };
                
                // Air Battles
                var result = this.battle('air', 'axis');
                alliedStat['damaged']['bomber'] = result['damaged']['bomber_strategic'] + result['damaged']['bomber_air_ground'];
                alliedStat['damaged']['fighter'] = result['damaged']['fighter_air'] + result['damaged']['fighter_ground'];
                delete result['damaged'];
                for (const country in result){
                    alliedStat['survived']['bomber'] += result[country]['bomber_strategic'] + result[country]['bomber_air_ground'];
                    alliedStat['survived']['fighter'] += result[country]['fighter_air'] + result[country]['fighter_ground'];
                }

                result = this.battle('air', 'allied');
                axisStat['damaged']['bomber'] = result['damaged']['bomber_strategic'] + result['damaged']['bomber_air_ground'];
                axisStat['damaged']['fighter'] = result['damaged']['fighter_air'] + result['damaged']['fighter_ground'];
                delete result['damaged'];
                for (const country in result){
                    axisStat['survived']['bomber'] += result[country]['bomber_strategic'] + result[country]['bomber_air_ground'];
                    axisStat['survived']['fighter'] += result[country]['fighter_air'] + result[country]['fighter_ground'];
                }
                
                // Surface Battles
                var result = this.battle('surface', 'axis');
                alliedStat['damaged']['armor'] = result['damaged']['armor_defensive'] + result['damaged']['armor_offensive'];
                alliedStat['damaged']['artillery'] = result['damaged']['artillery_antiair'] + result['damaged']['artillery_ground'];
                alliedStat['damaged']['infantry'] = result['damaged']['infantry_defensive'];
                delete result['damaged'];
                for (const country in result){
                    alliedStat['survived']['armor'] += result[country]['armor_defensive'] + result[country]['armor_offensive'];
                    alliedStat['survived']['artillery'] += result[country]['artillery_antiair'] + result[country]['artillery_ground'];
                    alliedStat['survived']['infantry'] += result[country]['infantry_defensive'] + result[country]['infantry_offensive'];
                }
                
                var result = this.battle('surface', 'allied');
                axisStat['damaged']['armor'] = result['damaged']['armor_defensive'] + result['damaged']['armor_offensive'];
                axisStat['damaged']['artillery'] = result['damaged']['artillery_antiair'] + result['damaged']['artillery_ground'];
                axisStat['damaged']['infantry'] = result['damaged']['infantry_defensive'];
                delete result['damaged'];
                for (const country in result){
                    axisStat['survived']['armor'] += result[country]['armor_defensive'] + result[country]['armor_offensive'];
                    axisStat['survived']['artillery'] += result[country]['artillery_antiair'] + result[country]['artillery_ground'];
                    axisStat['survived']['infantry'] += result[country]['infantry_defensive'] + result[country]['infantry_offensive'];
                }  
                
                // Count destroyed units and casualties
                alliedStat['destroyed']['bomber'] = this.alliedCommited['bomber'] - alliedStat['survived']['bomber'] - alliedStat['damaged']['bomber'];
                alliedStat['destroyed']['fighter'] = this.alliedCommited['fighter'] - alliedStat['survived']['fighter'] - alliedStat['damaged']['fighter'];
                alliedStat['destroyed']['armor'] = this.alliedCommited['armor'] - alliedStat['survived']['armor'] - alliedStat['damaged']['armor'];
                alliedStat['destroyed']['artillery'] = this.alliedCommited['artillery'] - alliedStat['survived']['artillery'] - alliedStat['damaged']['artillery'];
                alliedStat['destroyed']['infantry'] = this.alliedCommited['infantry'] - alliedStat['survived']['infantry'] - alliedStat['damaged']['infantry'];
                
                axisStat['destroyed']['bomber'] = this.axisCommited['bomber'] - axisStat['survived']['bomber'] - axisStat['damaged']['bomber'];
                axisStat['destroyed']['fighter'] = this.axisCommited['fighter'] - axisStat['survived']['fighter'] - axisStat['damaged']['fighter'];
                axisStat['destroyed']['armor'] = this.axisCommited['armor'] - axisStat['survived']['armor'] - axisStat['damaged']['armor'];
                axisStat['destroyed']['artillery'] = this.axisCommited['artillery'] - axisStat['survived']['artillery'] - axisStat['damaged']['artillery'];
                axisStat['destroyed']['infantry'] = this.axisCommited['infantry'] - axisStat['survived']['infantry'] - axisStat['damaged']['infantry'];                
                alliedStat['casualties'] = alliedStat['destroyed']['bomber'] * 6 + alliedStat['destroyed']['fighter'] * 4 + alliedStat['destroyed']['armor'] * 4 + alliedStat['destroyed']['artillery'] * 2 + alliedStat['destroyed']['infantry'] * 2;
                
                axisStat['casualties'] = axisStat['destroyed']['bomber'] * 6 + axisStat['destroyed']['fighter'] * 4 + axisStat['destroyed']['armor'] * 4 + axisStat['destroyed']['artillery'] * 2 + axisStat['destroyed']['infantry'] * 2;
                
                //check if all eliminated
                var totalCommited = this.alliedCommited['bomber'] + this.alliedCommited['fighter'];
                var totalDestroyed = alliedStat['destroyed']['bomber'] + alliedStat['destroyed']['fighter'];
                axisStat['elimAllAir'] = (totalCommited == totalDestroyed) ? true : false;
                
                totalCommited = this.alliedCommited['armor'] + this.alliedCommited['artillery'] + this.alliedCommited['infantry'];
                totalDestroyed = alliedStat['destroyed']['armor'] + alliedStat['destroyed']['artillery'] + alliedStat['destroyed']['infantry'];
                axisStat['elimAllSurface'] = (totalCommited == totalDestroyed) ? true : false;
                
                totalCommited = this.axisCommited['bomber'] + this.axisCommited['fighter'];
                totalDestroyed = axisStat['destroyed']['bomber'] + axisStat['destroyed']['fighter'];
                alliedStat['elimAllAir'] = (totalCommited == totalDestroyed) ? true : false;
                
                totalCommited = this.axisCommited['armor'] + this.axisCommited['artillery'] + this.axisCommited['infantry'];
                totalDestroyed = axisStat['destroyed']['armor'] + axisStat['destroyed']['artillery'] + axisStat['destroyed']['infantry'];
                alliedStat['elimAllSurface'] = (totalCommited == totalDestroyed) ? true : false;
                
                this.alliedStats.push(alliedStat);
                this.axisStats.push(axisStat);
            }
            
            // Sort the stat by casualties
            this.alliedStats.sort((a, b) => a.casualties - b.casualties);
            this.axisStats.sort((a, b) => a.casualties - b.casualties);
            
            this.results = {};
            this.results['axisElimAllAir'] = 30;
            this.results['axisElimAllSurface'] = 40;
            this.results['alliedElimAllAir'] = 60;
            this.results['alliedElimAllSurface'] = 40;
            
            
            this.results['axisAvgCasualties'] = (this.axisStats.reduce((accumulator, current) => {
              return accumulator + current.casualties;
            }, 0) / this.simulationRuns).toFixed(2);
            this.results['alliedAvgCasualties'] = (this.alliedStats.reduce((accumulator, current) => {
              return accumulator + current.casualties;
            }, 0) / this.simulationRuns).toFixed(2);
            
            this.results['axisElimAllAir'] = (this.axisStats.reduce((accumulator, current) => {
              return accumulator + Number(current.elimAllAir);
            }, 0) / this.simulationRuns * 100).toFixed(2);
            this.results['axisElimAllSurface'] = (this.axisStats.reduce((accumulator, current) => {
              return accumulator + Number(current.elimAllSurface);
            }, 0) / this.simulationRuns * 100).toFixed(2);
            this.results['alliedElimAllAir'] = (this.alliedStats.reduce((accumulator, current) => {
              return accumulator + Number(current.elimAllAir);
            }, 0) / this.simulationRuns * 100).toFixed(2);
            this.results['alliedElimAllSurface'] = (this.alliedStats.reduce((accumulator, current) => {
              return accumulator + Number(current.elimAllSurface);
            }, 0) / this.simulationRuns * 100).toFixed(2);
            
            /*
            setTimeout(() => {
                this.results = {
                    alliedWinRate: 55.2,
                    axisWinRate: 44.8,
                    avgAlliedLosses: '24,500',
                    avgAxisLosses: '31,200'
                };
                this.isSimulating = false;
            }, 0);
            */
            // reset simulation
            this.isSimulating = false;
            this.currentRun = 0;
        },
        /* Output: casualties of the defending side */
        battle(type, attacker){
            // setup
            var power = 0;
            if (type == 'air' && attacker == 'allied'){
                power = this.alliedAir;
            } else if (type == 'air' && attacker == 'axis'){
                power = this.axisAir;
            } else if (type == 'surface' && attacker == 'allied'){
                power = this.alliedSurface;
            } else if (type == 'surface' && attacker == 'axis'){
                power = this.axisSurface;
            }
            var defenders = {};
            var damaged = {
                    bomber_strategic: 0,
                    bomber_air_ground: 0,
                    fighter_air: 0,
                    fighter_ground: 0,
                    armor_defensive: 0,
                    armor_offensive: 0,
                    artillery_antiair: 0,
                    artillery_ground: 0,
                    infantry_defensive: 0,
                };
                
                
            if (attacker == 'axis'){
                defenders = JSON.parse(JSON.stringify(this.alliedForces));
            } else {
                defenders = JSON.parse(JSON.stringify(this.axisForces));
            }
            // for recording number of 2hp defensive armor
            let twoHpArmor = 0;
            while (power > 0){
                var n =  Math.min(power, 10);
                power -= n;
                
                colors = this.diceRoll(n);
                if (type == 'air'){
                    // resolve green
                    var green = colors['green'];
                    while (green > 0){
                        green -= 1;
                        if (damaged['fighter_air'] > 0){
                            damaged['fighter_air'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_ground'] > 0){
                            damaged['fighter_ground'] -= 1;
                            continue;
                        }
                        for (const country in defenders){
                            if (defenders[country]['fighter_air'] > 0){
                                defenders[country]['fighter_air'] -= 1;
                                damaged['fighter_air'] += 1;
                                break;
                            } else if (defenders[country]['fighter_ground'] > 0){
                                defenders[country]['fighter_ground'] -= 1;
                                damaged['fighter_ground'] += 1;
                                break;
                            }
                        }
                        
                    }
                    // resolve red
                    var red = colors['red'];
                    while (red > 0){
                        red -= 1;
                        if (damaged['bomber_strategic'] > 0){
                            damaged['bomber_strategic'] -= 1;
                            continue;
                        }
                        if (damaged['bomber_air_ground'] > 0){
                            damaged['bomber_air_ground'] -= 1;
                            continue;
                        }
                        for (const country in defenders){
                            if (defenders[country]['bomber_strategic'] > 0){
                                defenders[country]['bomber_strategic'] -= 1;
                                damaged['bomber_strategic'] += 1;
                                break;
                            } else if (defenders[country]['bomber_air_ground'] > 0){
                                defenders[country]['bomber_air_ground'] -= 1;
                                damaged['bomber_air_ground'] += 1;
                                break;
                            }
                        }
                    } 
                    // resolve black
                    var black = colors['black'];
                    while (black > 0){
                        black -= 1;
                        if (damaged['bomber_strategic'] > 0){
                            damaged['bomber_strategic'] -= 1;
                            continue;
                        }
                        if (damaged['bomber_air_ground'] > 0){
                            damaged['bomber_air_ground'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_air'] > 0){
                            damaged['fighter_air'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_ground'] > 0){
                            damaged['fighter_ground'] -= 1;
                            continue;
                        }
                        for (const country in defenders){
                            if (defenders[country]['bomber_strategic'] > 0){
                                defenders[country]['bomber_strategic'] -= 1;
                                damaged['bomber_strategic'] += 1;
                                break;
                            } else if (defenders[country]['bomber_air_ground'] > 0){
                                defenders[country]['bomber_air_ground'] -= 1;
                                damaged['bomber_air_ground'] += 1;
                                break;
                            } else if (defenders[country]['fighter_air'] > 0){
                                defenders[country]['fighter_air'] -= 1;
                                damaged['fighter_air'] += 1;
                                break;
                            } else if (defenders[country]['fighter_ground'] > 0){
                                defenders[country]['fighter_ground'] -= 1;
                                damaged['fighter_ground'] += 1;
                                break;
                            }
                        }
                    }
                    // resolve white
                    var white = colors['white'];
                    while (white > 0){
                        white -= 1;
                        if (damaged['bomber_strategic'] > 0){
                            damaged['bomber_strategic'] -= 1;
                            continue;
                        }
                        if (damaged['bomber_air_ground'] > 0){
                            damaged['bomber_air_ground'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_air'] > 0){
                            damaged['fighter_air'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_ground'] > 0){
                            damaged['fighter_ground'] -= 1;
                            continue;
                        }
                    }
                } else if (type == 'surface') {
                    // resolve yellow
                    var yellow = colors['yellow'];
                    while (yellow > 0){
                        yellow -= 1;
                        // 1. country with offensive without defensive 
                        let found = false;
                        for (const country in defenders){
                            if (defenders[country]['infantry_offensive'] > 0 && defenders[country]['infantry_defensive'] == 0){
                                defenders[country]['infantry_offensive'] -= 1;
                                found = true;
                                break;
                            }
                        }
                        if (found) { continue; }
                        // 2. damaged defensive
                        if (damaged['infantry_defensive'] > 0){
                            damaged['infantry_defensive'] -= 1;
                            continue;
                        }
                        // 3. undamaged defensive
                        for (const country in defenders){
                            if (defenders[country]['infantry_defensive'] > 0){
                                defenders[country]['infantry_defensive'] -= 1;
                                damaged['infantry_defensive'] += 1;
                                break;
                            }
                        }
                    }
                    // resolve blue
                    var blue = colors['blue'];
                    while (blue > 0){
                        blue -= 1;
                        // 1. damaged 
                        if (damaged['artillery_antiair'] > 0){
                            damaged['artillery_antiair'] -= 1;
                            continue;
                        } else if (damaged['artillery_ground'] > 0){
                            damaged['artillery_ground'] -= 1;
                            continue;
                        }
                        // 2. undamaged
                        for (const country in defenders){
                            if (defenders[country]['artillery_antiair'] > 0){
                                defenders[country]['artillery_antiair'] -= 1;
                                damaged['artillery_antiair'] += 1;
                                break;
                            } else if (defenders[country]['artillery_ground'] > 0){
                                defenders[country]['artillery_ground'] -= 1;
                                damaged['artillery_ground'] += 1;
                                break;
                            }
                        }
                        
                    }
                    // resolve green
                    var green = colors['green'];
                    while (green > 0){
                        green -= 1;
                        // 1. damaged offensive
                        // 2. damaged defensive
                        if (damaged['armor_offensive'] > 0){
                            damaged['armor_offensive'] -= 1;
                            continue;
                        } else if (damaged['armor_defensive'] > 0){
                            damaged['armor_defensive'] -= 1;
                            continue;
                        }
                        // 3. undamaged offensive without defensive
                        let found = false;
                        for (const country in defenders){
                            if (defenders[country]['armor_offensive'] > 0 && defenders[country]['armor_defensive'] == 0){
                                defenders[country]['armor_offensive'] -= 1;
                                damaged['offensive'] += 1;
                                break;
                            }
                        } 
                        if (found) { continue; }
                        // 4. 2hp defensive
                        if (twoHpArmor > 0){
                            twoHpArmor -= 1;
                            damaged['armor_defensive'] += 1;
                            continue;
                        }
                        // 5. 3hp defensive
                        for (const country in defenders){
                            if (defenders[country]['armor_defensive'] > 0){
                                defenders[country]['armor_defensive'] -= 1;
                                twoHpArmor += 1;
                                break;
                                
                                
                            }
                        }
                    }
                    // check force advantage
                    if (attacker == 'axis' && this.countSurfaceType(this.axisForces) < this.countSurfaceType(this.alliedForces)){
                        continue;
                    }
                    if (attacker == 'allied' && this.countSurfaceType(this.axisForces) > this.countSurfaceType(this.alliedForces)){
                        continue;
                    }
                    // resolve black
                    var black = colors['black'];
                    while (black > 0){
                        black -= 1;
                        // 1. damaged green -> blue -> yellow
                        if (damaged['armor_defensive'] > 0){
                            damaged['armor_defensive'] -= 1;
                            continue;
                        } else if (damaged['armor_offensive'] > 0){
                            damaged['armor_offensive'] -= 1;
                            continue;
                        } else if (damaged['artillery_antiair'] > 0){
                            damaged['artillery_antiair'] -= 1;
                            continue;
                        } else if (damaged['artillery_ground'] > 0){
                            damaged['artillery_ground'] -= 1;
                            continue;
                        } else if (damaged['infantry_defensive'] > 0){
                            damaged['infantry_defensive'] -= 1;
                            continue;
                        } 
                        // 2. undamaged 2hp green -> offensive green without defensive
                        if (twoHpArmor > 0){
                            twoHpArmor -= 1;
                            damaged['armor_defensive'] += 1;
                            continue;
                        }
                        let found = false;
                        for (const country in defenders){
                            if (defenders[country]['armor_offensive'] > 0 && defenders[country]['armor_defensive'] == 0){
                                defenders[country]['armor_offensive'] -= 1;
                                damaged['offensive'] += 1;
                                break;
                            }
                        } 
                        if (found) { continue; }
                        
                        // 3. 3hp green -> blue
                        for (const country in defenders){
                            if (defenders[country]['armor_defensive'] > 0){
                                defenders[country]['armor_defensive'] -= 1;
                                twoHpArmor += 1;
                                found = true;
                                break;
                            } else if (defenders[country]['artillery_antiair'] > 0){
                                defenders[country]['artillery_antiair'] -= 1;
                                damaged['artillery_antiair'] += 1;
                                found = true;
                                break;
                            } else if (defenders[country]['artillery_ground'] > 0){
                                defenders[country]['artillery_ground'] -= 1;
                                damaged['artillery_ground'] += 1;
                                found = true;
                                break;
                            }
                        }
                        if (found) { continue; }
                        // 4. offensive infantry without defensive
                        for (const country in defenders){
                            if (defenders[country]['infantry_offensive'] > 0 && defenders[country]['infantry_defensive'] == 0){
                                defenders[country]['infantry_offensive'] -= 1;
                                found = true;
                                break;
                            }
                        }
                        if (found) { continue; }
                        // 5. defensive infantry
                        for (const country in defenders){
                            if (defenders[country]['infantry_defensive'] > 1){
                                defenders[country]['infantry_defensive'] -= 1;
                                damaged['infantry_defensive'] += 1;
                                break;
                            }
                        }
                    } 
                    // resolve white
                    var white = colors['white'];
                    while (white > 0){
                        white -= 1;
                        // green -> blue -> yellow
                        if (damaged['armor_defensive'] > 0){
                            damaged['armor_defensive'] -= 1;
                            continue;
                        } else if (damaged['armor_offensive'] > 0){
                            damaged['armor_offensive'] -= 1;
                            continue;
                        } else if (damaged['artillery_antiair'] > 0){
                            damaged['artillery_antiair'] -= 1;
                            continue;
                        } else if (damaged['artillery_ground'] > 0){
                            damaged['artillery_ground'] -= 1;
                            continue;
                        } else if (damaged['infantry_defensive'] > 0){
                            damaged['infantry_defensive'] -= 1;
                            continue;
                        }
                    }
                }
            }
            // recover 2hp armor
            for (const country in defenders){
                defenders[country]['armor_defensive'] += twoHpArmor;
                break;
            }
            // Count damaged units and return them to healthy
            defenders['damaged'] = damaged;
            return defenders;
            
            
            
            
        },
        diceRoll(n){
            // Define the sides of the die
            const sides = [
                'yellow', 'yellow', 'yellow', 'yellow', // 4 yellow sides
                'blue', 'blue', 'blue',                   // 3 blue sides
                'green', 'green',                         // 2 green sides
                'red',                                    // 1 red side
                'white',                                  // 1 white side
                'black'                                   // 1 black side
            ];

            // Initialize the result object
            const result = {
                yellow: 0,
                blue: 0,
                green: 0,
                red: 0,
                white: 0,
                black: 0
            };

            // Roll the dice n times
            for (let i = 0; i < n; i++) {
                const roll = sides[Math.floor(Math.random() * sides.length)];
                result[roll]++;
            }

            return result;
        },
        countCasualties(before, after){
            var count = 0;
            
        }
    }
});

landApp.mount('#land-battle');