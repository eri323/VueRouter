<template>
  <div class="body">
    <div class="containerBoton">
      <q-btn
        label="Agregar Ruta"
        class="text-black"
        color="secondary"
        @click="medium = true"
      />
      <q-dialog v-model="medium">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section>
            <div class="text-h6">{{ titleModal }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Sucursal <br />
            <q-input v-model="sucursalNueva" type="text"></q-input>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Origen <br />
            <q-input v-model="origenNuevo" type="text"></q-input>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Destino <br />
            <q-input v-model="destinoNuevo" type="text"></q-input>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Fecha De Salida
            <q-input v-model="fecha_salidaNueva" type="date"></q-input>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn flat label="Aceptar" @click="agregarRuta" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div class="q-pa-md">
      <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">
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
let formData = ref({
  sucursal: "",
  Origen: "",
  Destino: "",
  fecha_salida: "",
});
const sucursalNueva = ref("");
const origenNuevo = ref("");
const destinoNuevo = ref("");
const fecha_salidaNueva = ref("");
async function agregarRuta() {
  const fechaActual = new Date();
  const data = {
    sucursal: sucursalNueva.value,
    Origen: origenNuevo.value,
    Destino: destinoNuevo.value,
    fecha_salida: fecha_salidaNueva.value,
    estado: 1,
    createdAt: fechaActual.toISOString(),
  };
  try {
    const response = await axios.post("ruta/rutacrear", data);
    if (response.status === 200) {
      datos.value.push(data);
      sucursalNueva.value = "";
      origenNuevo.value = "";
      destinoNuevo.value = "";
      fecha_salidaNueva.value = "";
     
      medium.value = false;
      DatosRutaPush()
      
    }else{
      console.log('Error en la solicitud HTTP:', response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error al agregar ruta:", error);

    if (error.response) {
      console.log('Respuesta de error:', error.response.status, error.response.data);
    }
  }
}
const datos = ref([]);
let rows = ref([]);
let colums = ref([]);
let titleModal = ref("Nueva Ruta");
const medium = ref(false);
async function ObtenerDatos() {
  const response = await axios.get("ruta/rutabusca");
  const data = response.data;
  rows.value = data.ruta;
  colums.value = data.ruta;

  console.log(data);
}
async function DatosRutaPush() {
  try {
    const response = await axios.get(`ruta/rutabusca`);
    const data = response.data;

    if (data.ruta.length > 0) {
      for (const ruta of data.ruta) {
        datos.value.push({
          sucursal: ruta.sucursal,
          Origen: ruta.Origen,
          Destino: ruta.Destino,
          fecha_salida: ruta.fecha_salida,
          estado: ruta.estado,
          createdAt: ruta.createdAt,
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
    name: "Sucursal",
    align: "center",
    label: "Sucursal",
    field: "sucursal",
    sortable: true,
  },
  {
    name: "Origen",
    align: "center",
    label: "Origen",
    field: "Origen",
    sortable: true,
  },
  {
    name: "Destino",
    align: "center",
    label: "Destino",
    field: "Destino",
    sortable: true,
  },
  {
    name: "Fecha Salida",
    label: "Fecha Salida",
    align: "center",
    field: "fecha_salida",
    sortable: true,
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
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
  DatosRutaPush();
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
