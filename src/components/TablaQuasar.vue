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
            <q-input type="text"></q-input>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Origen <br />
            <q-input type="text"></q-input>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Destino <br />
            <q-input type="text"></q-input>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Fecha De Salida
            <q-input type="date"></q-input>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup />
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
let DatosData = ref([]);
let rows = ref([]);
let colums = ref([]);
let titleModal = ref("Nueva Ruta");
const medium = ref(false);
async function ObtenerDatos() {


    const response = await axios.get("ruta/rutabusca");
    const data = response.data
    rows.value = data.ruta;
    colums.value = data.ruta;

    console.log(data);
  
}

/* function formatoHora(hora) {
  const fechaHora = new Date(hora);
  const opcionesDeFormato = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return fechaHora.toLocaleTimeString("es-ES", opcionesDeFormato);
} */
/* function formatoFecha(fecha) {
    const fechaHora = new Date(fecha);
    const opcionesDeFormato = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return fechaHora.toLocaleDateString("es-ES", opcionesDeFormato);
} */

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
});
</script>

<style scoped>
.body {
  padding: 30px;
  margin: 0;
}
.containerBoton {
  display: flex;
  justify-content: center;
}
</style>
