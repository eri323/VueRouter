<template>
  <div class="body">
    <div class="containerBoton">
      <q-btn
        label="Agregar vendedor"
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
            Nombre <br />
            <q-input v-model="nombreNuevo" type="text"></q-input>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Password <br />
            <q-input v-model="passwordNueva" type="text"></q-input>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn flat label="Aceptar" @click="agregarvendedor" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div class="q-pa-md">
      <q-table title="Vendedores" :rows="rows" :columns="columns" row-key="name">
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

const nombreNuevo = ref("");
const passwordNueva = ref("");

async function agregarvendedor() {
  const data = {
    Nombre: nombreNuevo.value,
    password: passwordNueva.value,
    estado: 1,
  };
  try {
    const response = await axios.post("vendedor/vendedorcrear", data);
    if (response.status === 200) {
      datos.value.push(data);
      nombreNuevo.value = "";
      passwordNueva.value = "";

      medium.value = false;
      DatosvendedorPush();
    } else {
      console.log(
        "Error en la solicitud HTTP:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error al agregar vendedor:", error);

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
let titleModal = ref("Nuevo vendedor");
const medium = ref(false);
async function ObtenerDatos() {
  const response = await axios.get("vendedor/vendedorbusca");
  const data = response.data;
  rows.value = data.vendedor;
  colums.value = data.vendedor;
  console.log(data);
}
async function DatosvendedorPush() {
  try {
    const response = await axios.get(`vendedor/vendedorbusca`);
    const data = response.data;

    if (data.vendedor.length > 0) {
      for (const vendedor of data.vendedor) {
        datos.value.push({
          Nombre: vendedor.Nombre,
          password: vendedor.password,
          estado: vendedor.estado,
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
    name: "Nombre",
    align: "center",
    label: "Nombre",
    field: "Nombre",
    sortable: true,
  },
  {
    name: "password",
    align: "center",
    label: "Password",
    field: "password",
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
