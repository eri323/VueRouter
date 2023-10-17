<template>
    <div class="body">
        <div class="containerBoton">
            <q-btn label="Agregar bus" class="text-black" color="secondary" @click="medium = true" />
            <q-dialog v-model="medium">
                <q-card style="width: 700px; max-width: 80vw">
                    <q-card-section>
                        <div class="text-h6">{{ titleModal }}</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        Placa <br />
                        <q-input v-model="placaNueva" type="text"></q-input>
                    </q-card-section>
                    <q-card-section class="q-pt-none">
                        Numero De Asientos <br />
                        <q-input v-model="numasientosNuevo" type="number"></q-input>
                    </q-card-section>
                    <q-card-section class="q-pt-none">
                        Horario <br />
                        <q-input v-model="horarioNuevo" type="text"></q-input>
                    </q-card-section>

                    <q-card-actions align="right" class="bg-white text-teal">
                        <q-btn flat label="Cancelar" v-close-popup />
                        <q-btn flat label="Aceptar" @click="agregarbus" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>

        <div class="q-pa-md">
            <q-table title="bus" :rows="rows" :columns="columns" row-key="name">
                <template v-slot:body-cell-Opciones="{ row: route }">
                    <q-td :props="props">
                        <q-btn v-if="route.estado">❌</q-btn>
                        <q-btn v-if="route.estado">✍️</q-btn>
                        <q-btn v-else>✔️</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";

const placaNueva = ref("");
const numasientosNuevo = ref("");
const horarioNuevo = ref("");

async function agregarbus() {
    const data = {
        Placa: placaNueva.value,
        NumeroDeAsientos: numasientosNuevo.value,
        Horario: horarioNuevo.value,
        estado: 1,
    };
    try {
        const response = await axios.post("transporte/transcrear", data);
        if (response.status === 200) {
            datos.value.push(data);
            placaNueva.value = "";
            numasientosNuevo.value = "";
            horarioNuevo.value="";

            medium.value = false;
            DatosbusPush();
        } else {
            console.log(
                "Error en la solicitud HTTP:",
                response.status,
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error al agregar bus:", error);

        if (error.response) {
            console.log(
                "Respuesta de error:",
                error.response.status,
                error.response.data
            );
        }
    }
}
const datos = ref([]);
let rows = ref([]);
let colums = ref([]);
let titleModal = ref("Nuevo bus");
const medium = ref(false);
async function ObtenerDatos() {
    const response = await axios.get("transporte/transbusca");
    const data = response.data;
    rows.value = data.bus;
    colums.value = data.bus;
    console.log(data);
}
async function DatosbusPush() {
    try {
        const response = await axios.get(`transporte/transbusca`);
        const data = response.data;

        if (data.transporte.length > 0) {
            for (const transporte of data.transporte) {
                datos.value.push({
                    Placa: transporte.PLaca,
                    NumeroDeAsientos: transporte.NumeroDeAsientos,
                    Horario: transporte.Horario,
                    estado: transporte.estado,
                });
            }
            rows.value = datos.value;
        }
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}
const columns = [
    {
        name: "PLaca",
        align: "center",
        label: "PLaca",
        field: "Vehiculo",
        sortable: true,
    },
    {
        name: "NumeroDeAsientos",
        align: "center",
        label: "Numero De Asientos",
        field: "NumAsientos",
        sortable: true,
    },
 {
        name: "Horario",
        align: "center",
        label: "Horario",
        field: "horario",
        sortable: true,
    },
    {
        name: "Estado",
        label: "Estado",
        field: "estado",
        sortable: true,
        align: "center",
        format: (val) => (val ? "Activo" : "Inactivo"),
    },
    {
        name: "Opciones",
        align: "center",
        label: "Opciones",
        field: "Opciones",
        sortable: true,
    },
];

onMounted(() => {
    ObtenerDatos();
});
</script>

<style scoped>
.body {
    padding: 30px;
    margin: 0;
    text-transform: capitalize;
}

.containerBoton {
    display: flex;
    justify-content: center;
}
</style>
