<template>
    <div>
        <!-- Modal -->
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
                <q-card-section class="row items-center q-pb-none" style="color: black;">
                    <div class="text-h6">{{ text }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <q-input v-model="Nombre" label="Nombre" style="width: 300px;" />
                    <q-input v-model="cedula" label="cedula" type="number" style="width: 300px;" />
                   
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="primary" v-close-popup />
                    <q-btn flat label="Aceptar" color="primary" @click="AgregarConductor()" />
                </q-card-actions>
            </q-card>
        </q-dialog>     
        <div>
            
            <div class="btn-agregar">
                <q-btn class="bg-secondary" label="Agregar Conductores" @click="agregarConductor()" />
            </div>
            <q-table title="Conductores" :rows="rows" :columns="columns" row-key="name">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
                        <label for="" v-else style="color: red;">Inactivo</label>

                    </q-td>

                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <q-btn color="white" text-color="black" label="🖋️" @click="EditarConductor(props.row._id)" />
                        <q-btn  glossy label="❌" @click="InactivarConductor(props.row._id)"
                            v-if="props.row.estado == 1" />
                        <q-btn  glossy label="✔️" @click="putActivarConductor(props.row._id)" v-else />
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
import { useConductorStore } from '../stores/Conductores.js';
const conductorStore = useConductorStore()
let text = ref('')
let conductor = ref([]);
let rows = ref([]);
let fixed = ref(false)
let Nombre = ref('');
let cedula= ref ()
let cambio = ref(0)

async function obtenerInfo() {
    try {
        await conductorStore.obtenerInfoConductor();
        conductor.value = conductorStore.conductores;
        rows.value = conductorStore.conductores;
    } catch (error) {
        console.log(error);
    }
}



const columns = [
    { name: 'nombre', label: 'Nombre', field: 'nombre', sortable: true },
    { name: 'cedula', label: 'Cedula', field: 'cedula' },
    { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
    {
        name: 'opciones', label: 'Opciones',
        field: row => null,
        "sortable": false,
    },
];

function agregarConductor() {
    text.value="agregar Conductor"
    fixed.value = true;
    cambio.value = 0;
    limpiar()
}

async function AgregarConductor() {
    if (cambio.value === 0) {
        await conductorStore.postconductor({
            nombre: Nombre.value,
            cedula: cedula.value,
        })
        limpiar()
        obtenerInfo()

    } else {
        let id = idConductor.value;
        if (id) {
            await conductorStore.putEditarConductor(id, {
                nombre: Nombre.value,
               cedula: cedula.value,
            });

            limpiar();
            obtenerInfo()
            fixed.value = false;
        }
    }
}


function limpiar() {
    Nombre.value = ""
    cedula.value = ""
}

let idConductor = ref('')
async function EditarConductor(id) {
    cambio.value = 1;
    const conductorSeleccionado = conductor.value.find((conductor) => conductor._id === id);
    if (conductorSeleccionado) {
        idConductor.value = String(conductorSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Conductor";
        Nombre.value=conductorSeleccionado.nombre;
        cedula.value=conductorSeleccionado.cedula;
        console.log(id);
    }
}

async function InactivarConductor(id) {
    await conductorStore.putInactivarConductor(id)
    obtenerInfo()
}

async function putActivarConductor(id) {
    await conductorStore.putActivarConductor(id)
    obtenerInfo()
}

onMounted(async () => {
    obtenerInfo()
});
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
.q-table__top relative-position row items-center{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>