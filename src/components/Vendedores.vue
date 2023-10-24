<template>
  <div>
    <div>
      <h1 style="text-align: center;">Vendedores</h1>
      <hr>
    </div>
    <q-dialog v-model="fixed">

      <q-card class="modal-content">

        <q-card-section class="subtabla" style="color: black" id>
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input v-model="Nombre" label="Nombre" style="width: 300px" />
          <q-input v-model="password" label="Contraseña" type="text" style="width: 300px" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="AgregarVendedor()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar Vendedores" @click="agregarVendedor()" />
      </div>

      <q-table title="Vendedores" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-color="black" label="🖋️" @click="EditarVendedor(props.row._id)" />
            <q-btn glossy label="❌" @click="InactivarVendedor(props.row._id)" v-if="props.row.estado == 1" />
            <q-btn glossy label="✔️" @click="putActivarVendedor(props.row._id)" v-else />
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
import { useVendedorStore } from "../stores/Vendedor.js";
const vendedorStore = useVendedorStore();
let text = ref("");
let vendedor = ref([]);
let rows = ref([]);
let fixed = ref(false);
let Nombre = ref("");
let password = ref();
let cambio = ref(0);

async function obtenerInfo() {
  try {
    await vendedorStore.obtenerInfoVendedor();
    vendedor.value = vendedorStore.vendedores;
    rows.value = vendedorStore.vendedores;
  } catch (error) {
    console.log(error);
  }
}

const columns = [
  { name: "Nombre", label: "Nombre", field: "Nombre", sortable: true },
  { name: "password", label: "Contraseña", field: "password" },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    format: (val) => (val ? "Activo" : "Inactivo"),
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
  },
];

function agregarVendedor() {
  text.value = "Agregar Vendedor";
  fixed.value = true;
  cambio.value = 0;
  limpiar();
}

async function AgregarVendedor() {
  if (cambio.value === 0) {
    await vendedorStore.postvendedor({
      Nombre: Nombre.value,
      password: password.value,
    });
    limpiar();
    obtenerInfo();
  } else {
    let id = idVendedor.value;
    if (id) {
      await vendedorStore.putEditarVendedor(id, {
        Nombre: Nombre.value,
        password: password.value,
      });

      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
}

function limpiar() {
  Nombre.value = "";
  password.value = "";
}

let idVendedor = ref("");
async function EditarVendedor(id) {
  cambio.value = 1;
  const vendedorSeleccionado = vendedor.value.find(
    (vendedor) => vendedor._id === id
  );
  if (vendedorSeleccionado) {
    idVendedor.value = String(vendedorSeleccionado._id);
    fixed.value = true;
    text.value = "Editar vendedor";
    Nombre.value = vendedorSeleccionado.Nombre;
    password.value = vendedorSeleccionado.password;
    console.log(password);
  }
}

async function InactivarVendedor(id) {
  await vendedorStore.putInactivarVendedor(id);
  obtenerInfo();
}

async function putActivarVendedor(id) {
  await vendedorStore.putActivarVendedor(id);
  obtenerInfo();
}



onMounted(async () => {
  obtenerInfo();
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
  margin-bottom: 2%;
}

hr {
  background-color: green;
  height: 4px;
  border: none;
  width: 480px;
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
</style>
