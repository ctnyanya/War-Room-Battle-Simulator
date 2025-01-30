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
                                            <button class="btn btn-outline-secondary" 
                                                    @click="adjustUnit(country, action.type, -1)">
                                                -
                                            </button>
                                            
                                            <input type="number" 
                                                   class="form-control text-center" 
                                                   v-model.number="axisForces[country][action.type]"
                                                   min="0"
                                                   readonly>
                                            <!--
                                            <button class="btn btn-outline-secondary" disabled>
                                            {{ axisForces[country][action.type] }}
                                            </button>
                                            -->
                                            <button class="btn btn-outline-secondary"
                                                    @click="adjustUnit(country, action.type, 1)">
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    
                                    <td class="ps-4">{{ action.label }}</td>
                                    
                                    <td v-for="country in alliedCountries" :key="country + action.type">
                                        <div class="input-group input-group-sm">
                                            <button class="btn btn-outline-secondary"
                                                    @click="adjustUnit(country, action.type, -1)">
                                                -
                                            </button>
                                            <input type="number" 
                                                   class="form-control text-center" 
                                                   v-model.number="alliedForces[country][action.type]"
                                                   min="0"
                                                   readonly>
                                            <button class="btn btn-outline-secondary"
                                                    @click="adjustUnit(country, action.type, 1)">
                                                +
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr class="country-list">
                                    <th><img src="./assets/img/germany.png"></th>
                                    <th><img src="./assets/img/japan.png"></th>
                                    <th><img src="./assets/img/italy.png"></th>
                                    
                                    <th><span class="text-danger">Axis</span> vs <span class="text-primary">Allied</span></th>
                                    
                                    <th><img src="./assets/img/uk.png"></th>
                                    <th><img src="./assets/img/ussr.png"></th>
                                    <th><img src="./assets/img/usa.png"></th>
                                    <th><img src="./assets/img/china.png"></th>
                                </tr>

                                <tr v-for="action in surfaceUnits" :key="action.type">

                                    <td v-for="country in axisCountries" :key="country + action.type">
                                        <div class="input-group input-group-sm">
                                            <button class="btn btn-outline-secondary"
                                                    @click="adjustUnit(country, action.type, -1)">
                                                -
                                            </button>
                                            <input type="number" 
                                                   class="form-control text-center" 
                                                   v-model.number="axisForces[country][action.type]"
                                                   min="0"
                                                   readonly>
                                            <button class="btn btn-outline-secondary"
                                                    @click="adjustUnit(country, action.type, 1)">
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    
                                    <td class="ps-4">{{ action.label }}</td>
                                    
                                    <td v-for="country in alliedCountries" :key="country + action.type">
                                        <div class="input-group input-group-sm">
                                            <button class="btn btn-outline-secondary" 
                                                    @click="adjustUnit(country, action.type, -1)">
                                                -
                                            </button>
                                            <input type="number" 
                                                   class="form-control text-center" 
                                                   v-model.number="alliedForces[country][action.type]"
                                                   min="0"
                                                   readonly>
                                            <button class="btn btn-outline-secondary"  
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
            <div class="container">
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
                            <h4 class="mb-0">Simulation Summary</h4>
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
                                            <br>
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
                                        <h5>
                                        Battle Sample #{{ selectedRun }}
<span data-toggle="tooltip" title="Sample runs are ordered by luckiness. 
Left-most: Best luck for the Axis
Right-most: Best luck for the Allied">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16" >
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
</svg>
</span>
                                        </h5>
                                        <span class="text-danger h5">Axis luckiest  </span>
                                        <input type="range" 
                                               class="custom-range" 
                                               v-model="selectedRun" 
                                               :min="1" 
                                               :max="simulationRuns" >
                                        <span class="text-primary h5">  Allied luckiest</span>
                                        <div class="table-responsive">
                                        <table class="table table-bordered align-middle">
                                            <tbody>
                                                <tr>  
                                                    <td><span class="text-danger h6">Bomber</span></td>
                                                    <td><span class="text-success h6">Fighter</span></td>
                                                    <td><span class="text-success h6">Armor</span></td>
                                                    <td><span class="text-primary h6">Artillery</span></td>
                                                    <td><span class="text-warning h6">Infantry</span></td>
                                                    <td><span class="text-danger h6">Axis</span> / <span class="text-primary h6">Allied</span></td>
                                                    <td><span class="text-warning h6">Infantry</span></td>
                                                    <td><span class="text-primary h6">Artillery</span></td>
                                                    <td><span class="text-success h6">Armor</span></td>
                                                    <td><span class="text-success h6">Fighter</span></td>
                                                    <td><span class="text-danger h6">Bomber</span></td>
                                                </tr>
                                                <tr>
                                                    <td>{{ axisCommited['bomber'] }}</td>
                                                    <td>{{ axisCommited['fighter'] }}</td>
                                                    <td>{{ axisCommited['armor'] }}</td>
                                                    <td>{{ axisCommited['artillery'] }}</td>
                                                    <td>{{ axisCommited['infantry'] }}</td>
                                                    <td><span class="h6">Commited</span></td>
                                                    <td>{{ alliedCommited['infantry'] }}</td>
                                                    <td>{{ alliedCommited['artillery'] }}</td>
                                                    <td>{{ alliedCommited['armor'] }}</td>
                                                    <td>{{ alliedCommited['fighter'] }}</td>
                                                    <td>{{ alliedCommited['bomber'] }}</td>                                       
                                                </tr>
                                                <tr>
                                                    <td>{{ selectedAxisStat['survived']['bomber'] }}</td>
                                                    <td>{{ selectedAxisStat['survived']['fighter'] }}</td>
                                                    <td>{{ selectedAxisStat['survived']['armor'] }}</td>
                                                    <td>{{ selectedAxisStat['survived']['artillery'] }}</td>
                                                    <td>{{ selectedAxisStat['survived']['infantry'] }}</td>
                                                    <td><p class="text-success h6">Survived</p></td>
                                                    <td>{{ selectedAlliedStat['survived']['infantry'] }}</td>
                                                    <td>{{ selectedAlliedStat['survived']['artillery'] }}</td>
                                                    <td>{{ selectedAlliedStat['survived']['armor'] }}</td>
                                                    <td>{{ selectedAlliedStat['survived']['fighter'] }}</td>
                                                    <td>{{ selectedAlliedStat['survived']['bomber'] }}</td>
                                                </tr>
                                                <tr>
                                                    <td>{{ selectedAxisStat['damaged']['bomber'] }}</td>
                                                    <td>{{ selectedAxisStat['damaged']['fighter'] }}</td>
                                                    <td>{{ selectedAxisStat['damaged']['armor'] }}</td>
                                                    <td>{{ selectedAxisStat['damaged']['artillery'] }}</td>
                                                    <td>{{ selectedAxisStat['damaged']['infantry'] }}</td>
                                                    <td><p class="text-danger h6">Damaged</p></td>
                                                    <td>{{ selectedAlliedStat['damaged']['infantry'] }}</td>
                                                    <td>{{ selectedAlliedStat['damaged']['artillery'] }}</td>
                                                    <td>{{ selectedAlliedStat['damaged']['armor'] }}</td>
                                                    <td>{{ selectedAlliedStat['damaged']['fighter'] }}</td>
                                                    <td>{{ selectedAlliedStat['damaged']['bomber'] }}</td>
                                                </tr>
                                                <tr>
                                                    <td>{{ selectedAxisStat['destroyed']['bomber'] }}</td>
                                                    <td>{{ selectedAxisStat['destroyed']['fighter'] }}</td>
                                                    <td>{{ selectedAxisStat['destroyed']['armor'] }}</td>
                                                    <td>{{ selectedAxisStat['destroyed']['artillery'] }}</td>
                                                    <td>{{ selectedAxisStat['destroyed']['infantry'] }}</td>
                                                    <td><p class="text-muted h6">Destroyed</p></td>
                                                    <td>{{ selectedAlliedStat['destroyed']['infantry'] }}</td>
                                                    <td>{{ selectedAlliedStat['destroyed']['artillery'] }}</td>
                                                    <td>{{ selectedAlliedStat['destroyed']['armor'] }}</td>
                                                    <td>{{ selectedAlliedStat['destroyed']['fighter'] }}</td>
                                                    <td>{{ selectedAlliedStat['destroyed']['bomber'] }}</td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>
                                        </div>
                                        <div class="bar-container">
                                            <div class="bar" :style="barStyle(selectedAxisStat['casualties'], selectedAlliedStat['casualties'])"></div>
                                            <div class="label label-left">Axis Casualties: {{ selectedAxisStat['casualties'] }}</div>
                                            <div class="label label-right">{{ selectedAlliedStat['casualties'] }} :Allied Casualties</div>
                                        </div>
                                        
                                        <div class="table-responsive">
                                        <table class="table table-bordered align-middle">
                                            <tbody>
                                            <tr>
                                                    <td colspan="5">
                                                        <div v-if="selectedAxisStat['airDice'][0]" class="h6 text-start">
                                                            First batch:
                                                            <div v-for="(count, color) in selectedAxisStat['airDice'][0]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                        <div v-if="selectedAxisStat['airDice'][1]" class="h6 text-start">
                                                            Second batch:
                                                            <div v-for="(count, color) in selectedAxisStat['airDice'][1]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                        <div v-if="selectedAxisStat['airDice'][2]" class="h6 text-start">
                                                            Third batch:
                                                            <div v-for="(count, color) in selectedAxisStat['airDice'][2]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><p class="h6">Air Dice</p></td>
                                                    <td colspan="5">
                                                        <div v-if="selectedAlliedStat['airDice'][0]" class="h6 text-start">
                                                            First batch:
                                                            <div v-for="(count, color) in selectedAlliedStat['airDice'][0]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                        <div v-if="selectedAlliedStat['airDice'][1]" class="h6 text-start">
                                                            Second batch:
                                                            <div v-for="(count, color) in selectedAlliedStat['airDice'][1]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                        <div v-if="selectedAlliedStat['airDice'][2]" class="h6 text-start">
                                                            Third batch:
                                                            <div v-for="(count, color) in selectedAlliedStat['airDice'][2]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="5">
                                                        <div v-if="selectedAxisStat['surfaceDice'][0]" class="h6 text-start">
                                                            First batch:
                                                            <div v-for="(count, color) in selectedAxisStat['surfaceDice'][0]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                        <div v-if="selectedAxisStat['surfaceDice'][1]" class="h6 text-start">
                                                            Second batch:
                                                            <div v-for="(count, color) in selectedAxisStat['surfaceDice'][1]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                        <div v-if="selectedAxisStat['surfaceDice'][2]" class="h6 text-start">
                                                            Third batch:
                                                            <div v-for="(count, color) in selectedAxisStat['surfaceDice'][2]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><p class="h6">Surface Dice</p></td>
                                                    <td colspan="5">
                                                        <div v-if="selectedAlliedStat['surfaceDice'][0]" class="h6 text-start">
                                                            First batch:
                                                            <div v-for="(count, color) in selectedAlliedStat['surfaceDice'][0]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                        <div v-if="selectedAlliedStat['surfaceDice'][1]" class="h6 text-start">
                                                            Second batch:
                                                            <div v-for="(count, color) in selectedAlliedStat['surfaceDice'][1]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                        <div v-if="selectedAlliedStat['surfaceDice'][2]" class="h6 text-start">
                                                            Third batch:
                                                            <div v-for="(count, color) in selectedAlliedStat['surfaceDice'][2]" :key="color" class="color-count">
                                                                <div :style="{ backgroundColor: color }" class="color-box"></div>
                                                                {{ count }}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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
                            
                            <!-- Causlties Distribution -->
                            <div v-show="results" class="row mb-4">
                                <div class="text-center h5">Casualties Distribution</div>
                                <canvas id="casualties-dist" width="400" height="200"></canvas>
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
            axisRemainSurfacePower: 0, // update the surface power after air battle (some air unit might be destroyed)
            alliedRemainSurfacePower: 0,
            // Result 
            alliedCommited: {},
            axisCommited: {},
            alliedStats: [],
            axisStats: [],
            results: null,
            selectedRun: 1,
            chart: null,
            
            
            
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

        selectedAlliedStat(){
            return this.alliedStats[this.selectedRun];
        },
        selectedAxisStat(){
            return this.axisStats[this.selectedRun];
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
                var output = this.battle('air', 'axis');
                var result = output['defenders'];
                axisStat['airDice'] = output['diceRolls'];
                
                alliedStat['damaged']['bomber'] = result['damaged']['bomber_strategic'] + result['damaged']['bomber_air_ground'];
                alliedStat['damaged']['fighter'] = result['damaged']['fighter_air'] + result['damaged']['fighter_ground'];
                delete result['damaged'];
                for (const country in result){
                    alliedStat['survived']['bomber'] += result[country]['bomber_strategic'] + result[country]['bomber_air_ground'];
                    alliedStat['survived']['fighter'] += result[country]['fighter_air'] + result[country]['fighter_ground'];
                }
                this.alliedRemainSurfacePower = this.computeSurface(result);

                var output = this.battle('air', 'allied');
                var result = output['defenders'];
                alliedStat['airDice'] = output['diceRolls'];
                
                axisStat['damaged']['bomber'] = result['damaged']['bomber_strategic'] + result['damaged']['bomber_air_ground'];
                axisStat['damaged']['fighter'] = result['damaged']['fighter_air'] + result['damaged']['fighter_ground'];
                delete result['damaged'];
                for (const country in result){
                    axisStat['survived']['bomber'] += result[country]['bomber_strategic'] + result[country]['bomber_air_ground'];
                    axisStat['survived']['fighter'] += result[country]['fighter_air'] + result[country]['fighter_ground'];
                }
                this.axisRemainSurfacePower = this.computeSurface(result);
               
                
                
                
                // Surface Battles
                
                var output = this.battle('surface', 'axis');
                var result = output['defenders'];
                axisStat['surfaceDice'] = output['diceRolls'];
                
                alliedStat['damaged']['armor'] = result['damaged']['armor_defensive'] + result['damaged']['armor_offensive'];
                alliedStat['damaged']['artillery'] = result['damaged']['artillery_antiair'] + result['damaged']['artillery_ground'];
                alliedStat['damaged']['infantry'] = result['damaged']['infantry_defensive'];
                delete result['damaged'];
                for (const country in result){
                    alliedStat['survived']['armor'] += result[country]['armor_defensive'] + result[country]['armor_offensive'];
                    alliedStat['survived']['artillery'] += result[country]['artillery_antiair'] + result[country]['artillery_ground'];
                    alliedStat['survived']['infantry'] += result[country]['infantry_defensive'] + result[country]['infantry_offensive'];
                }
                
                var output = this.battle('surface', 'allied');
                var result = output['defenders'];
                alliedStat['surfaceDice'] = output['diceRolls'];
                
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
            
            var casualtiesDiff = [];
            for (let i = 0; i < this.simulationRuns; i++){
                var temp = {};
                temp['idx'] = i;
                temp['val'] = this.axisStats[i]['casualties'] - this.alliedStats[i]['casualties'];
                casualtiesDiff.push(temp);
            }
            casualtiesDiff.sort((a, b) => a.val - b.val);
            var sortedAlliedStats = [];
            var sortedAxisStats = [];
            for (let i = 0; i < this.simulationRuns; i++){
                sortedAlliedStats.push(this.alliedStats[casualtiesDiff[i]['idx']]);
                sortedAxisStats.push(this.axisStats[casualtiesDiff[i]['idx']]);
            }
            this.alliedStats = sortedAlliedStats;
            this.axisStats = sortedAxisStats;
            
            this.results = {};

            
            
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
            
            // default sample run set to median
            this.selectedRun = Math.floor(this.simulationRuns / 2);
            // reset simulation
            this.isSimulating = false;
            this.currentRun = 0;
            
            // plot graph
            this.renderChart();
            
           
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
                power = this.alliedRemainSurfacePower;
            } else if (type == 'surface' && attacker == 'axis'){
                power = this.axisRemainSurfacePower;
            }
            var defenders = {};
            var diceRolls = [];
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
                diceRolls.push(colors);
                if (type == 'air'){
                    // resolve green
                    var green = colors['green'];
                    while (green > 0){
                        green -= 1;
                        if (damaged['fighter_ground'] > 0){
                            damaged['fighter_ground'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_air'] > 0){
                            damaged['fighter_air'] -= 1;
                            continue;
                        }
                        for (const country in defenders){
                            if (defenders[country]['fighter_ground'] > 0){
                                defenders[country]['fighter_ground'] -= 1;
                                damaged['fighter_ground'] += 1;
                                break;
                            } else if (defenders[country]['fighter_air'] > 0){
                                defenders[country]['fighter_air'] -= 1;
                                damaged['fighter_air'] += 1;
                                break;
                            }
                        }
                        
                    }
                    // resolve red
                    var red = colors['red'];
                    while (red > 0){
                        red -= 1;
                        if (damaged['bomber_air_ground'] > 0){
                            damaged['bomber_air_ground'] -= 1;
                            continue;
                        }
                        if (damaged['bomber_strategic'] > 0){
                            damaged['bomber_strategic'] -= 1;
                            continue;
                        }
                        for (const country in defenders){
                            if (defenders[country]['bomber_air_ground'] > 0){
                                defenders[country]['bomber_air_ground'] -= 1;
                                damaged['bomber_air_ground'] += 1;
                                break;
                            } else if (defenders[country]['bomber_strategic'] > 0){
                                defenders[country]['bomber_strategic'] -= 1;
                                damaged['bomber_strategic'] += 1;
                                break;
                            } 
                        }
                    } 
                    // resolve black
                    var black = colors['black'];
                    while (black > 0){
                        black -= 1;
                        if (damaged['bomber_air_ground'] > 0){
                            damaged['bomber_air_ground'] -= 1;
                            continue;
                        }
                        if (damaged['bomber_strategic'] > 0){
                            damaged['bomber_strategic'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_ground'] > 0){
                            damaged['fighter_ground'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_air'] > 0){
                            damaged['fighter_air'] -= 1;
                            continue;
                        }
                        for (const country in defenders){
                            if (defenders[country]['bomber_air_ground'] > 0){
                                defenders[country]['bomber_air_ground'] -= 1;
                                damaged['bomber_air_ground'] += 1;
                                break;
                            } else if (defenders[country]['bomber_strategic'] > 0){
                                defenders[country]['bomber_strategic'] -= 1;
                                damaged['bomber_strategic'] += 1;
                                break;
                            } else if (defenders[country]['fighter_ground'] > 0){
                                defenders[country]['fighter_ground'] -= 1;
                                damaged['fighter_ground'] += 1;
                                break;
                            } else if (defenders[country]['fighter_air'] > 0){
                                defenders[country]['fighter_air'] -= 1;
                                damaged['fighter_air'] += 1;
                                break;
                            } 
                        }
                    }
                    // resolve white
                    var white = colors['white'];
                    while (white > 0){
                        white -= 1;
                        if (damaged['bomber_air_ground'] > 0){
                            damaged['bomber_air_ground'] -= 1;
                            continue;
                        } 
                        if (damaged['bomber_strategic'] > 0){
                            damaged['bomber_strategic'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_ground'] > 0){
                            damaged['fighter_ground'] -= 1;
                            continue;
                        }
                        if (damaged['fighter_air'] > 0){
                            damaged['fighter_air'] -= 1;
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
                        // 1. damaged green
                        if (damaged['armor_defensive'] > 0){
                            damaged['armor_defensive'] -= 1;
                            continue;
                        } else if (damaged['armor_offensive'] > 0){
                            damaged['armor_offensive'] -= 1;
                            continue;
                        }

                        // 2. 2hp green
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
                        // 3. damaged blue
                        if (damaged['artillery_antiair'] > 0){
                            damaged['artillery_antiair'] -= 1;
                            continue;
                        } else if (damaged['artillery_ground'] > 0){
                            damaged['artillery_ground'] -= 1;
                            continue;
                        }
              
                        // 4. 3hp green -> blue
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
                        // 4. 1hp yellow offensive infantry without defensive
                        for (const country in defenders){
                            if (defenders[country]['infantry_offensive'] > 0 && defenders[country]['infantry_defensive'] == 0){
                                defenders[country]['infantry_offensive'] -= 1;
                                found = true;
                                break;
                            }
                        }
                        
                        if (found) { continue; }
                        if (damaged['infantry_defensive'] > 0){
                            damaged['infantry_defensive'] -= 1;
                            continue;
                        } 
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
            
            var output = {};
            output['defenders'] = defenders;
            output['diceRolls'] = diceRolls;
            return output;
            
            
            
            
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
                black: 0,
                white: 0
            };

            // Roll the dice n times
            for (let i = 0; i < n; i++) {
                const roll = sides[Math.floor(Math.random() * sides.length)];
                result[roll]++;
            }

            return result;
        },

        renderChart() {
            const ctx = document.getElementById('casualties-dist').getContext('2d');
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: this.simulationRuns }, (_, i) => `#${i + 1}`),
                    datasets: [
                        {
                            label: 'Axis',
                            data: this.axisStats.map(obj => obj.casualties),
                            borderColor: 'rgb(244, 67, 54)',
                            fill: false,
                        },
                        {
                            label: 'Allied',
                            data: this.alliedStats.map(obj => obj.casualties),
                            borderColor: 'rgb(33, 150, 243)',
                            fill: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Run number (From Axis luckiest to Allied luckiest)' 
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10 // Limit number of ticks on x-axis
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Casualties' 
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
});

landApp.mount('#land-battle');