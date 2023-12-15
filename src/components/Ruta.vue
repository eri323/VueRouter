<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px;">Rutas</h1>
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
              <q-input v-model="codigo" label="codigo" style="width: 300px" />
              <q-input v-model="Origen" label="Origen" style="width: 300px" />
              <q-input v-model="Destino" label="Destino" style="width: 300px" />
              <q-input type="time" id="fechaInp" v-model="hora_salida" label="Hora De salida" style="width: 300px" />
            </q-card-section>
          </div>

          <div class="containerError" v-if="mostrarError">
            <h4>{{ error }}</h4>
          </div>

          <q-separator />

          <q-card-actions align="center" style="gap: 30px; margin-top: 10px">
            <button class="btn" v-close-popup>Cancelar</button>
            <button @click="editarAgregarRuta()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div style="width: 1000px;">
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar ruta" @click="agregarRuta()" />
      </div>
      <div class="q-pa-md">
        <q-table class="my-sticky-virtscroll-table" virtual-scroll flat bordered v-model:pagination="pagination"
          :rows-per-page-options="[0]" :virtual-scroll-sticky-size-start="48" row-key="index"  :rows="rows"
          :columns="columns" style="height: 600px;">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
              <label for="" v-else style="color: red">Inactivo</label>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones">
              <button @click="EditarRuta(props.row._id)" class="edi">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button @click="InactivarRuta(props.row._id)" v-if="props.row.estado == 1" class="inac">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <button @click="ActivarRuta(props.row._id)" v-else class="act">
                <i class="fa-solid fa-check"></i>
              </button>
            </q-td>
          </template>

        </q-table>
      </div>
      <!--   <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">

      </q-table> -->
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useQuasar } from "quasar";
import { useRutaStore } from "../stores/Ruta.js";
const rutaStore = useRutaStore();
const $q = useQuasar();
let error = ref("Ingrese todos los datos para la creacion de un vendedor");

let rutas = ref([]);
let rows = ref([]);
let fixed = ref(false);
let text = ref("");
let codigo = ref("");
let sucursal = ref("");
let Origen = ref();
let Destino = ref("");
let hora_salida = ref("");
let cambio = ref(0);
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 })
async function obtenerInfo() {
  try {
    await rutaStore.obtenerInfoRutas();
    rutas.value = rutaStore.rutas;
    rows.value = rutaStore.rutas;
  } catch (error) {
    console.log(error);
  }
}

const columns = [
  { name: "Codigo", label: "Codigo", field: "codigo", sortable: true, align: "left" },
  { name: "Origen", label: "Origen", field: "Origen", sortable: true, align: "left" },
  { name: "Destino", label: "Destino", field: "Destino", sortable: true, align: "left" },
  {
    name: "hora_salida",
    label: "Hora De salida",
    field: "hora_salida",
    sortable: true,
    align: "left"
    /*  format: (val) => {
      const date = new Date(val);
      const day = date.getDate() + 1;
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}-${month < 10 ? '0' : ''}${month}-${year}`;
    } */
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "left",
    format: (val) => (val ? "Activo" : "Inactivo"),
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
    align: "center",
  },
];

function agregarRuta() {
  fixed.value = true;
  text.value = "Agregar Ruta";
  cambio.value = 0;
  limpiar();
}
function validar() {
  if (Origen.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el origen de la ruta porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);

  } else if (Destino.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Especifique el destino de la ruta porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (hora_salida.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione la hora de salida porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else {
    validacion.value = true;
  }
}
async function editarAgregarRuta() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await rutaStore.postRuta({
          codigo: codigo.value,
          Origen: Origen.value,
          Destino: Destino.value,
          hora_salida: hora_salida.value,
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Ruta Agregada",
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
      let id = idRuta.value;
      if (id) {
        try {
          showDefault();
          await rutaStore.putEditarRuta(id, {
            codigo: codigo.value,
            Origen: Origen.value,
            Destino: Destino.value,
            hora_salida: hora_salida.value,
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Ruta Actualizada",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          if (notification) {
            notification();
            console.log(notification);
          }
          $q.notify({
            spinner: false,
            /*  message: `${error.response.data.error.errors[0].msg}`, */
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
  codigo.value = "";
  Origen.value = "";
  Destino.value = "";
  hora_salida.value = "";
}

let idRuta = ref("");
async function EditarRuta(id) {
  cambio.value = 1;
  const rutaSeleccionada = rutas.value.find((ruta) => ruta._id === id);
  if (rutaSeleccionada) {
    /*  const fechaMostrar = new Date(Date.parse(rutaSeleccionada.hora_salida))
      .toISOString()
      .slice(0, 10); */
    /*     console.log(fechaMostrar);
     */ console.log(rutaSeleccionada.hora_salida);
    idRuta.value = String(rutaSeleccionada._id);
    fixed.value = true;
    text.value = "Editar Bus";
    codigo.value = rutaSeleccionada.codigo;
    Origen.value = rutaSeleccionada.Origen;
    Destino.value = rutaSeleccionada.Destino;
    hora_salida.value = rutaSeleccionada.hora_salida;
  }
}
let validacion = ref(false);
let notification = ref(null);
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};
async function InactivarRuta(id) {
  try {
    showDefault();
    await rutaStore.putInactivarRuta(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Ruta Inactiva",
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

async function ActivarRuta(id) {
  try {
    showDefault();
    await rutaStore.putActivarRuta(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Ruta Activa",
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

.contorno {
  background-color: white;
  height: 90%;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  margin-left: 19px;
}

.body {
  padding: 30px;
  margin: 0;
  text-transform: capitalize;
}

.containerBoton {
  display: flex;
  justify-content: center;
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
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
}

.containerError h4 {
  font-size: 25px;
  margin: 0;
  padding: 0;
}

h1 {
  font-family: "Letra";
  text-align: center;
  margin: 0;
  align-items: center;
  margin-top: 2%;
}

.text-h6 {
  font-size: 28px;
  font-family: "Letra";
  margin-bottom: 10px;
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
