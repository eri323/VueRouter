<template>
  <div>
    <div>
      <h1 style="text-align: center">Clientes</h1>
      <hr />
    </div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <div class="contorno">
          <q-card-section class="row items-center q-pb-none" style="color: black">
            <div class="text-h6">{{ text }}</div>
            <q-space />
          </q-card-section>
          <q-separator />
          <div v-if="mostrarData">
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input v-model="Nombre" label="Nombre" style="width: 300px" />
              <q-input v-model="cedula" label="cedula" type="number" style="width: 300px" />
              <q-input v-model="telefono" label="Telefono" type="number" style="width: 300px" />
            </q-card-section>
          </div>
          <div class="containerError" v-if="mostrarError">
            <h4>{{ error }}</h4>
          </div>

          <q-separator />

          <q-card-actions align="right">
            <button class="btn" v-close-popup>Cancelar</button>
            <button @click="AgregarCliente()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div style="width: 1600px;">
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar cliente" @click="agregarCliente()" />
      </div>
      <div class="q-pa-md" style="padding: 0;">
        <q-table class="my-sticky-virtscroll-table" virtual-scroll flat bordered v-model:pagination="pagination"
          :rows-per-page-options="[0]" :virtual-scroll-sticky-size-start="48" row-key="index" :rows="rows"
          :columns="columns" style="height: 600px;">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
              <label for="" v-else style="color: red">Inactivo</label>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones">
              <button @click="EditarCliente(props.row._id)" class="edi">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button @click="InactivarCliente(props.row._id)" v-if="props.row.estado == 1" class="inac">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <button @click="putActivarCliente(props.row._id)" v-else class="act">
                <i class="fa-solid fa-check"></i>
              </button>
            </q-td>
          </template>
        </q-table>
      </div>
    
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useClienteStore } from "../stores/Cliente.js";
import { useQuasar } from "quasar";
const $q = useQuasar();
const clienteStore = useClienteStore();
let text = ref("");
let cliente = ref([]);
let rows = ref([]);
let fixed = ref(false);
let Nombre = ref("");
let telefono = ref();
let cedula = ref();
let cambio = ref(0);
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 })
let error = ref("Ingrese todos los datos para la creacion de un vendedor");
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
  { name: "CC_cliente", label: "Cedula", field: "CC_cliente", sortable: true, align: "left" },
  {
    name: "Nombre_cliente",
    label: "Nombre",
    field: "Nombre_cliente",
    sortable: true,
    align: "left"
  },
  { name: "Telefono_cliente", label: "Telefono", field: "Telefono_cliente", align: "left" },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    format: (val) => (val ? "Activo" : "Inactivo"),
    align: "left"
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
    align: "center"
  },
];

function agregarCliente() {
  text.value = "Agregar Cliente";
  fixed.value = true;
  cambio.value = 0;
  limpiar();
}

async function AgregarCliente() {
  validar()
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await clienteStore.postcliente({
          Nombre_cliente: Nombre.value,
          Telefono_cliente: telefono.value,
          CC_cliente: cedula.value,
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Cliente Agregado",
          timeout: 2000,
          type: "positive",
        });
        obtenerInfo();
      } catch (error) {
        if (notification) {
          notification();
        }
        $q.notify({
          spinner: false,
          message: `${error.response.data.error.errors[0].msg}`,
          timeout: 2000,
          type: "negative",
        });
      }

    } else {
      let id = idCliente.value;
      if (id) {
        try {
          showDefault();
          await clienteStore.putEditarCliente(id, {
            Nombre_cliente: Nombre.value,
            Telefono_cliente: telefono.value,
            CC_cliente: cedula.value,
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Bus Actualizado",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          if (notification) {
            notification();
          }
          $q.notify({
            spinner: false,
            message: `${error.response.data.error.errors[0].msg}`,
            timeout: 2000,
            type: "negative",
          });
        }



      }
    }
    validacion.value = false;
  }

}


function limpiar() {
  Nombre.value = "";
  telefono.value = "";
  cedula.value = "";
}

let idCliente = ref("");
async function EditarCliente(id) {
  cambio.value = 1;
  const clienteSeleccionado = cliente.value.find(
    (cliente) => cliente._id === id
  );
  if (clienteSeleccionado) {
    idCliente.value = String(clienteSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Cliente";
    Nombre.value = clienteSeleccionado.Nombre_cliente;
    cedula.value = clienteSeleccionado.CC_cliente;
    telefono.value = clienteSeleccionado.Telefono_cliente;
    console.log(id);
  }
}
let validacion = ref(false);
function validar() {
  if (Nombre.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el nombre porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (cedula.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el numero de cedula porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (telefono.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el numero telfonico porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else {
    validacion.value = true;
  }
}
let notification = ref(null);
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};
async function InactivarCliente(id) {
  try {
    showDefault();
    await clienteStore.putInactivarCliente(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Cliente Desactivado",
      timeout: 2000,
      type: "positive",
    });
    obtenerInfo();
  } catch (error) {
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: `${error.response.data.error.errors[0].msg}`,
      timeout: 2000,
      type: "negative",
    });
  }
}

async function putActivarCliente(id) {
  try {
    showDefault();
    await clienteStore.putActivarCliente(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Cliente Activo",
      timeout: 2000,
      type: "positive",
    });
    obtenerInfo();
  } catch (error) {
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: `${error.response.data.error.errors[0].msg}`,
      timeout: 2000,
      type: "negative",
    });
  }
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
  margin-bottom: 5px;
  display: flex;
  justify-content: left;
  color: white;
  margin-bottom: 15px;
}

.containerError {
  background-color: rgba(255, 0, 0, 0.429);
  padding: 15px;
  text-align: center;
  font-family: "Letra";
  font-weight: bold;
  width: 310px;
  border: 3px solid red;
  margin-bottom: 5px;
}

.containerError h4 {
  font-size: 15px;
  margin: 0;
  padding: 0;
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

.contorno {
  background-color: white;
  height: 90%;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.q-card__actions {
  margin-top: 10px;
}

.botones .edi {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px;
  background-color: transparent;
}

.botones .edi:hover {
  transform: scale(1.05);
  transition: all 0.5s;
}

.botones .act {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px;
  background-color: transparent;
}

.act i {
  font-size: 22px;
  color: green;
}

.inac {
  /*   display: flex;
  align-items: center; */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px;
  margin: 0;
  background-color: transparent;
}

.botones .edi i {
  font-size: 20px;
}

.inac i {
  font-size: 25px;
  color: red;
}

.btn {
  font-family: "Letra";
  width: 100px;
  font-size: 18px;
  border-radius: 5px;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-left: 15px;
  background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
}
</style>
<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #00926f

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>