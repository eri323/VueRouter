<template>
    <div>
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
                        <q-input v-model="cedula" label="Cedula" type="number" style="width: 300px;" />



                    </q-card-section>

                    <q-separator />

                    <q-card-actions align="right" style="gap: 30px; margin-top: 10px;"  >
                        <q-btn flat label="Cancelar" color="primary" v-close-popup />
                        <q-btn flat label="Aceptar" color="primary" @click="AgregarConductor()" />
                    </q-card-actions>
                </div>
            </q-card>
        </q-dialog>
        <div>
            <div class="containerheader">
                <div>
                    <h1>Conductores</h1>
                    <hr>
                </div>
                <div class="btn-agregar">
                    <q-btn class="bg-secondary" label="Agregar Conductor" @click="agregarConductor()"> </q-btn>
                </div>
            </div>
            <div class="containerheader">
                <q-table :rows="rows" :columns="columns" row-key="name">
                    <template v-slot:body-cell-estado="props">
                        <q-td :props="props">
                            <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
                            <label for="" v-else style="color: red;">Inactivo</label>

                        </q-td>

                    </template>
                    <template v-slot:body-cell-opciones="props">
                        <q-td :props="props" class="botones">
                            <q-btn color="white" text-color="black" label="🖋️" @click="EditarConductor(props.row._id)" />
                            <q-btn glossy label="❌" @click="InactivarConductor(props.row._id)"
                                v-if="props.row.estado == 1" />
                            <q-btn glossy label="✔️" @click="putActivarConductor(props.row._id)" v-else />
                        </q-td>
                    </template>
                </q-table>
            </div>

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
let cedula = ref()
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
    text.value = "Agregar Conductor"
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
        Nombre.value = conductorSeleccionado.nombre;
        cedula.value = conductorSeleccionado.cedula;
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
  width: 480px;
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
  border-radius: 3%;
}

.contorno {
     background-color: white;
    height: 80%;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.text-h6 {
    font-size: 28px;
    margin-bottom: 25px;
}

.botones button {
    margin: 2px;
}

.btn-agregar {
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  justify-content: right;
  color: black;
}

.containerheader {
    width: 100%;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
/* .containerheader div hr {
  background-color: green;
  height: 4px;
  border: none;
  width: 450px;
} */
.containerheader div h1 {
  font-family: "Letra";
  text-align: center;
  font-size: 105px;
  margin: 0;
  align-items: center;
  margin-top: 4%;
}
hr {
    background-color: green;
    height: 2px;
    border: none;
    width: 363px;
    margin-bottom: 1%;

}

</style>