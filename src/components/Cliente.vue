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
                    <q-input v-model="nombre" label="Nombre" style="width: 300px;" v-if="cambio == 0" />
                    <q-input v-model="cedula" label="cedula" type="number" style="width: 300px;" v-if="cambio == 0" />
                    <q-input v-model="telefono" label="Telefono" type="number" style="width: 300px;" v-if="cambio == 0" />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="primary" v-close-popup />
                    <q-btn flat label="Aceptar" color="primary" @click="editarAgregarCliente()" />
                </q-card-actions>
            </q-card>
        </q-dialog>     
        <div>
            <h1>Clientes</h1>
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
import { useClienteStore } from '../stores/Cliente.js';
const busStore = useClienteStore()

let cliente = ref([]);
let rows = ref([]);
let fixed = ref(false)
let nombre = ref('');
let telefono = ref();
let conductor_id = ref('');
let cambio = ref(0)

async function obtenerInfo() {
    try {
        await busStore.obtenerInfoCliente();
        cliente.value = busStore.clientes;
        rows.value = busStore.clientes;
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    obtenerInfo()
});

const columns = [
    { name: 'CC_cliente', label: 'telefono', field: 'CC_cliente', sortable: true },
    { name: 'Nombre_cliente', label: 'Nombre', field: 'Nombre_cliente', sortable: true },
    { name: 'Telefono_cliente', label: 'Telefono', field: 'Telefono_cliente' },
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

async function editarAgregarCliente() {
    if (cambio.value === 0) {
        await busStore.postBus({
            nombre: nombre.value,
            telefono: telefono.value,
            conductor_id: conductor_id.value,
        })
        limpiar()
        obtenerInfo()

    } else {
        let id = idBus.value;
        if (id) {
            await busStore.putEditarBus(id, {
                nombre: nombre.value,
                cedula: cedula.value,
                telefono: telefono.value,
            });

            limpiar();
            obtenerInfo()
            fixed.value = false;
        }
    }
}


function limpiar() {
    nombre.value = ""
    telefono.value = ""
    conductor_id = ""
}

let idCliente = ref('')
async function EditarBus(id) {
    cambio.value = 1;
    const clienteSeleccionado = cliente.value.find((cliente) => cliente._id === id);
    if (clienteSeleccionado) {
        idCliente.value = String(clienteSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Cliente";
        clientes_id.value = clienteSeleccionado.cliente_id;
        nombre.value=clienteSeleccionado.nombre;
        telefono.value=clienteSeleccionado.telefono;
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
    justify-content: flex-end
}
</style>