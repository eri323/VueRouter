<template>
  <div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <div class="contorno">
          <q-card-section
            class="row items-center q-pb-none"
            style="color: black"
          >
            <div class="text-h6">{{ text }}</div>
            <q-space />
          </q-card-section>
          <q-separator />
          <div v-if="mostrarData">
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input v-model="Nombre" label="Nombre" style="width: 300px" />
              <q-input
                v-model="cedula"
                label="Cedula"
                type="number"
                style="width: 300px"
              />
            </q-card-section>
          </div>
          <div class="containerError" v-if="mostrarError">
            <h4>{{ error }}</h4>
          </div>
          <q-separator />

          <q-card-actions align="right" style="gap: 30px; margin-top: 10px">
            <button class="btn" v-close-popup>Cancelar</button>
            <button @click="AgregarConductor()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div style="width: 1000px">
      <div class="containerheader">
        <div style="margin-top: 50px;">
          <h1>Conductores</h1>
          <hr />
        </div>
        <div class="btn-agregar">
          <q-btn
            class="bg-secondary"
            label="Agregar Conductor"
            @click="agregarConductor()"
          >
          </q-btn>
        </div>
      </div>
      <div class="containerheader">
        <q-table
          class="my-sticky-dynamic"
          flat
          bordered
          :rows="rows"
          :columns="columns"
          :loading="loading"
          row-key="index"
          virtual-scroll
          :virtual-scroll-item-size="48"
          :virtual-scroll-sticky-size-start="48"
          :pagination="pagination"
          :rows-per-page-options="[0]"
          @virtual-scroll="onScroll"
          style="height: 600px;"
        >
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <label for="" v-if="props.row.estado == 1" style="color: green"
                >Activo</label
              >
              <label for="" v-else style="color: red">Inactivo</label>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones">
              <button @click="EditarConductor(props.row._id)" class="edi">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button
                @click="InactivarConductor(props.row._id)"
                v-if="props.row.estado == 1"
                class="inac"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
              <button
                @click="putActivarConductor(props.row._id)"
                v-else
                class="act"
              >
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
import { useQuasar } from "quasar";
import { useConductorStore } from "../stores/Conductores.js";
const conductorStore = useConductorStore();
let text = ref("");
let conductor = ref([]);
let rows = ref([]);
let fixed = ref(false);
let Nombre = ref("");
let cedula = ref();
let cambio = ref(0);
let mostrarData = ref(true);
let mostrarError = ref(false);
let pagination = ref({ rowsPerPage: 0 });
const $q = useQuasar();
let error = ref("Ingrese todos los datos para la creacion de un vendedor");
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
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true },
  { name: "cedula", label: "Cedula", field: "cedula" },
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

function agregarConductor() {
  text.value = "Agregar Conductor";
  fixed.value = true;
  cambio.value = 0;
  limpiar();
}
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

let validacion = ref(false);
let notification = ref(null);

function validar() {
  if (Nombre.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el nombre del conductor porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (cedula.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el numero de cedula del conductor porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else {
    validacion.value = true;
  }
}

async function AgregarConductor() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await conductorStore.postconductor({
          nombre: Nombre.value,
          cedula: cedula.value,
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Conductor Agregado",
          timeout: 2000,
          type: "positive",
        });
        obtenerInfo();
      } catch (error) {}
    } else {
      let id = idConductor.value;
      if (id) {
        try {
          showDefault();
          await conductorStore.putEditarConductor(id, {
            nombre: Nombre.value,
            cedula: cedula.value,
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Conductor Actualizado",
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
  cedula.value = "";
}

let idConductor = ref("");
async function EditarConductor(id) {
  cambio.value = 1;
  const conductorSeleccionado = conductor.value.find(
    (conductor) => conductor._id === id
  );
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
  try {
    showDefault();
    await conductorStore.putInactivarConductor(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Conductor Inactivo",
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

async function putActivarConductor(id) {
  try {
    showDefault();
    await conductorStore.putActivarConductor(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Conductor Activo",
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
  justify-content: left;
  color: white;
  margin-bottom: 15px;
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
  background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
}
</style>
<style lang="sass">
.my-sticky-dynamic
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