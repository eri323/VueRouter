<template>
  <div>
    <div>
      <h1 style="text-align: center;">Vendedores</h1>
      <hr>
    </div>
    <q-dialog v-model="fixed">

      <q-card class="modal-content">
        <div class="contorno">

          <q-card-section class="row items-center q-pb" style="color: black" id>
            <div class="text-h6">{{ text }}</div>
            <q-space />
          </q-card-section>
          <q-separator />

          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input v-model="Nombre" label="Nombre" style="width: 300px" />
            <q-input v-model="password" label="Contraseña" type="password" style="width: 300px" />
            <q-input v-model="Cedula" label="Cedula" style="width: 300px" type="number" />
            <q-input v-model="Telefono" label="Telefono" type="number" style="width: 300px" />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" style="gap: 30px; margin-top: 10px;">
            <q-btn flat label="Cancelar" color="primary" v-close-popup  />
            <q-btn flat label="Aceptar" color="primary" @click="AgregarVendedor()" />
          </q-card-actions>
        </div>
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
let Cedula = ref("");
let Telefono = ref("");
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
  { name: "Cedula", label: "Cedula", field: "Cedula" },
  { name: "Telefono", label: "Telefono", field: "Telefono" },
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
      Cedula:Cedula.value,
      Telefono: Telefono.value,
    });
    limpiar();
    obtenerInfo();
  } else {
    let id = idVendedor.value;
    if (id) {
      await vendedorStore.putEditarVendedor(id, {
        Nombre: Nombre.value,
        password: password.value,
        Cedula:Cedula.value,
      Telefono: Telefono.value,
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
  Cedula.value = "";
  Telefono.value = "";
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
    Cedula.value = vendedorSeleccionado.Cedula;
    Telefono.value = vendedorSeleccionado.Telefono;
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
</style>
