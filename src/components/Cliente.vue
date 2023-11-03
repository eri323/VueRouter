<template>
    <div>
        <div>
      <h1 style="text-align: center;">Clientes</h1>
      <hr>
    </div>
        <!-- Modal -->
        <q-dialog v-model="fixed">
            <q-card class="modal-content">
                <div class="contorno">
                    <q-card-section class="row items-center q-pb-none" style="color: black;">
                    <div class="text-h6">{{ text }}</div>
                    <q-space />
                </q-card-section>
                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <q-input v-model="Nombre" label="Nombre" style="width: 300px;" />
                    <q-input v-model="cedula" label="cedula" type="number" style="width: 300px;" />
                    <q-input v-model="telefono" label="Telefono" type="number" style="width: 300px;"  />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="primary" v-close-popup />
                    <q-btn flat label="Aceptar" color="primary" @click="AgregarCliente()" />
                </q-card-actions>
                </div>
            </q-card>
        </q-dialog>
        <div>
            <div class="btn-agregar">
                <q-btn class="bg-secondary" label="Agregar cliente" @click="agregarCliente()" />
            </div>
            <q-table title="Clientes" :rows="rows" :columns="columns" row-key="name">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
                        <label for="" v-else style="color: red;">Inactivo</label>

                    </q-td>

                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <q-btn color="white" text-color="black" label="🖋️" @click="EditarCliente(props.row._id)" />
                        <q-btn  glossy label="❌" @click="InactivarCliente(props.row._id)"
                            v-if="props.row.estado == 1" />
                        <q-btn  glossy label="✔️" @click="putActivarCliente(props.row._id)" v-else />
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
const clienteStore = useClienteStore()
let text = ref('')
let cliente = ref([]);
let rows = ref([]);
let fixed = ref(false)
let Nombre = ref('');
let telefono = ref();
let cedula= ref ()
let cambio = ref(0)

async function obtenerInfo() {
    try {
        await clienteStore.obtenerInfoCliente();
        cliente.value = clienteStore.clientes;
        rows.value = clienteStore.clientes;
    } catch (error) {
        console.log(error);
    }
}



const columns = [
    { name: 'CC_cliente', label: 'Cedula', field: 'CC_cliente', sortable: true },
    { name: 'Nombre_cliente', label: 'Nombre', field: 'Nombre_cliente', sortable: true },
    { name: 'Telefono_cliente', label: 'Telefono', field: 'Telefono_cliente' },
    { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
    {
        name: 'opciones', label: 'Opciones',
        field: row => null,
        "sortable": false,
    },
];

function agregarCliente() {
    text.value="Agregar Cliente"
    fixed.value = true;
    cambio.value = 0;
    limpiar()
}

async function AgregarCliente() {
    if (cambio.value === 0) {
        await clienteStore.postcliente({
            Nombre_cliente: Nombre.value,
            Telefono_cliente: telefono.value,
            CC_cliente: cedula.value,
        })
        limpiar()
        obtenerInfo()

    } else {
        let id = idCliente.value;
        if (id) {
            await clienteStore.putEditarCliente(id, {
                Nombre_cliente: Nombre.value,
                Telefono_cliente: telefono.value,
                CC_cliente: cedula.value,
            });

            limpiar();
            obtenerInfo()
            fixed.value = false;
        }
    }
}


function limpiar() {
    Nombre.value = ""
    telefono.value = ""
    cedula.value = ""
}

let idCliente = ref('')
async function EditarCliente(id) {
    cambio.value = 1;
    const clienteSeleccionado = cliente.value.find((cliente) => cliente._id === id);
    if (clienteSeleccionado) {
        idCliente.value = String(clienteSeleccionado._id);
        fixed.value = true;
        text.value = "Editar Cliente";
        Nombre.value=clienteSeleccionado.Nombre_cliente;
        cedula.value=clienteSeleccionado.CC_cliente;
        telefono.value=clienteSeleccionado.Telefono_cliente;
        console.log(id);
    }
}

async function InactivarCliente(id) {
    await clienteStore.putInactivarCliente(id)
    obtenerInfo()
}

async function putActivarCliente(id) {
    await clienteStore.putActivarCliente(id)
    obtenerInfo()
}

onMounted(async () => {
    obtenerInfo()
});
</script>
  
<style scoped>
.modal-content {
  width: 480px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
  border-radius: 3%;
}

.botones button {
  margin: 2px;
}

.btn-agregar {
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  justify-content: right;
  color: black;
}

hr {
  background-color: green;
    height: 2px;
    border: none;
    width: 363px;
    margin-bottom: 1%;

}

h1 {
  font-family: "Letra";
  text-align: center;
  font-size: px;
  margin: 0;
  align-items: center;
  margin-top: 2%;
}

.text-h6 {
  font-size: 28px;
  margin-bottom: 30px;
}
.contorno{
  background-color: white;
    height: 90%;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.q-card__actions{
     margin-top: 10px;
}

</style>