<template>
    <div>
        <!-- Modal -->
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
                <q-card-section class="row items-center q-pb-none" style="color: black;">
                 
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <q-input v-model="Vehiculo" label="Placa" style="width: 300px;" v-if="cambio == 0" />
                    <q-input v-model="NumAsientos" label="Numero de Asientos" type="number"
                     style="width: 300px;" v-if="cambio == 0" />
                    <q-input v-model="conductor_id" label="Conductor" style="width: 300px;" />
    
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="primary" v-close-popup />
                    <q-btn flat label="Aceptar" color="primary" @click="editarAgregarBus()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div>
          
            <div class="btn-agregar">
                <q-btn color="secondary" label="Agregar" @click="agregarBus()" />
            </div>
            <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
                        <label for="" v-else style="color: red;">Inactivo</label>

                    </q-td>

                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
                        <q-btn  glossy label="❌" @click="InactivarBus(props.row._id)"
                            v-if="props.row.estado == 1" />
                        <q-btn  glossy label="✔️" @click="ActivarBus(props.row._id)" v-else />
                    </q-td>
                </template>
            </q-table>
        </div>

    </div>
</template>
  
<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useBusStore } from '../stores/Bus.js';
const busStore = useBusStore()

let buses = ref([]);
let rows = ref([]);
let fixed = ref(false)
let Vehiculo = ref('');
let NumAsientos = ref();
let conductor_id = ref('');
let cambio = ref(0)

async function obtenerInfo() {
    try {
        await busStore.obtenerInfoBuses();
        console.log(busStore.buses);
        buses.value = busStore.buses;
        rows.value = busStore.buses;
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    obtenerInfo()
});

const columns = [
    { name: 'Vehiculo', label: 'Placa', field: 'Vehiculo', sortable: true },
    { name: 'NumAsientos', label: 'Numero De Asientos', field: 'NumAsientos', sortable: true },
    { name: 'conductor_id', label: 'Conductor', field: (row)=>row.conductor_id.nombre },
    { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
    {
        name: 'opciones', label: 'Opciones',
        field: row => null,
        "sortable": false,
    },
];

function agregarBus() {
    fixed.value = true;
    cambio.value = 0
}

async function editarAgregarBus() {
    if (cambio.value === 0) {
        await busStore.postBus({
            Vehiculo: Vehiculo.value,
            NumAsientos: NumAsientos.value,
           conductor_id: conductor_id.value,
        })
        limpiar()
        obtenerInfo()

    } else {
        let id = idBus.value;
        if (id) {
            await busStore.putEditarBus(id, {
                Vehiculo: Vehiculo.value,
                conductor_id: conductor_id.value,
                NumAsientos: NumAsientos.value,
            });

            limpiar();
            obtenerInfo()
            fixed.value = false;
        }
    }
}


function limpiar() {
    Vehiculo.value = ""
    NumAsientos.value = ""
    conductor_id = ""
}

let idBus = ref('')
async function EditarBus(id) {
    cambio.value = 1;
    const busSeleccionado = buses.value.find((transporte) => transporte._id === id);
    if (busSeleccionado) {
        idBus.value = String(busSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Bus";
        conductor_id.value = busSeleccionado.conductor_id;
        Vehiculo.value=busSeleccionado.Vehiculo;
        NumAsientos.value=busSeleccionado.NumAsientos;
    }
}

async function InactivarBus(id) {
    await busStore.putInactivarBus(id)
    obtenerInfo()
}

async function ActivarBus(id) {
    await busStore.putActivarBus(id)
    obtenerInfo()
}


</script>
  
<style scoped>
.modal-content {
    width: 400px;
}

.botones button {
    margin: 2px;
}

.btn-agregar {
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
}
</style>