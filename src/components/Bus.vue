<template>
  <div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <div class="contorno">
          <q-card-section class="row items-center q-pb" style="color: black" id>
            <div class="text-h6">{{ titleDialog }}</div>
            <q-space />
          </q-card-section>

          <q-separator />
          <div v-if="mostrarData">
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input v-model="NumBus" type="number" label="Numero de bus" style="width: 300px" />
              <q-input v-model="Vehiculo" label="Placa" style="width: 300px" />

              <q-input v-model="NumAsientos" label="Numero de Asientos" type="number" style="width: 300px" />

              <div class="q-gutter-y-md column" style="max-width: 300px">
                <q-select clearable filled color="primary" v-model="conductor_id" :options="options" label="Conductor" />
              </div>
              <q-input v-model="Soat" label="Soat" type="date" style="width: 300px" :min="todayDate" />
            </q-card-section>
          </div>

          <div class="containerError" v-if="mostrarError">
            <h4>{{ error }}</h4>
          </div>
          <q-separator />

          <q-card-actions align="right" style="gap: 30px; margin-top: 10px">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Aceptar" color="primary" @click="editarAgregarBus()" />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div class="tbus" style="width: 1000px;">
      <div>
        <h1>Buses</h1>
        <hr />
      </div>
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar Bus" @click="agregarBus()" />
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
              <button @click="EditarBus(props.row._id)" class="edi">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button @click="InactivarBus(props.row._id)" v-if="props.row.estado == 1" class="inac">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <button @click="ActivarBus(props.row._id)" v-else class="act">
                <i class="fa-solid fa-check"></i>
              </button> </q-td>
          </template>
        </q-table>
      </div>
     <!--  <div class="tbus">
        <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">

        </q-table>
      </div> -->
    </div>
  </div>
</template>

<script setup>
/* import axios from "axios"; */
/* import { format } from "date-fns"; */
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useBusStore } from "../stores/Bus.js";
import { useQuasar } from "quasar";
import { useConductorStore } from "../stores/Conductores.js";

const todayDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato ISO
const busStore = useBusStore();
const conductorStore = useConductorStore();
const $q = useQuasar();
let buses = ref([]);
let rows = ref([]);
let fixed = ref(false);
let NumBus = ref("");
let Vehiculo = ref("");
let NumAsientos = ref();
let conductor_id = ref([]);
let Soat = ref("");
let cambio = ref(0);
let titleDialog = ref("");
let mostrarData = ref(true);
let mostrarError = ref(false);
let pagination = ref({ rowsPerPage: 0 })
let error = ref("Ingrese todos los datos para la creacion de un vendedor");
async function obtenerInfo() {
  try {
    await busStore.obtenerInfoBuses();
    console.log(busStore.buses);
    buses.value = busStore.buses;
    rows.value = busStore.buses;
  } catch (error) {
    console.log(error);
  }
}

const options = ref([]);
onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "NumBus", label: "Numero de bus", field: "NumBus", sortable: true, align: "left" },
  { name: "Vehiculo", label: "Placa", field: "Vehiculo", sortable: true, align: "left" },
  {
    name: "NumAsientos",
    label: "Numero De Asientos",
    field: "NumAsientos",
    sortable: true,
   align: "left"
  },
  {


    name: "conductor_id",
    label: "Conductor",
    field: (row) => row.conductor_id.nombre,
    sortable: true,
    align: "left"
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
    name: "Soat",
    label: "Soat",
    field: "Soat",
    sortable: true,
    align: "left",
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
    align: "center"
  },
];
async function obtenerConductor() {
  try {
    await conductorStore.obtenerInfoConductor();
    options.value = conductorStore.conductores.map((conductor) => ({
      label: `${conductor.nombre}`,
      value: String(conductor._id),
    }));
  } catch (error) {
    console.log(error);
  }
}
function agregarBus() {
  obtenerConductor();
  fixed.value = true;
  cambio.value = 0;
  titleDialog.value = "Agregar Bus";
}
function validar() {
  if (Vehiculo.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite la placa del vehiculo porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (NumAsientos.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Especifique el numero de asientos porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (conductor_id.value == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione el conductor porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (Soat.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione la fecha de vencimiento del seguro SOAT";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else {
    validacion.value = true;
  }
}
async function editarAgregarBus() {
  validar();
  if (validacion.value === true) {
    if (cambio.value == 0) {
      try {
        showDefault();
        await busStore.postBus({
          NumBus: NumBus.value,
          Vehiculo: Vehiculo.value,
          NumAsientos: NumAsientos.value,
          conductor_id: conductor_id._rawValue.value,
          Soat: Soat.value,
        });
        if (notification) {
          notification();
        }
        $q.notify({
          spinner: false,
          message: `Bus Agregado`,
          timeout: 2000,
          type: "positive",
        })
        obtenerInfo()
        fixed.value = false;
        limpiar();
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
      let id = idBus.value;
      if (id) {
        try {
          showDefault();
          await busStore.putEditarBus(id, {
            NumBus: NumBus.value,
            Vehiculo: Vehiculo.value,
            NumAsientos: NumAsientos.value,
            conductor_id: conductor_id._rawValue.value,
            Soat: Soat.value,


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
  NumBus.value = "";
  Vehiculo.value = "";
  NumAsientos.value = "";
  conductor_id.value = "";
  Soat.value = "";
}

let idBus = ref("");
async function EditarBus(id) {
  obtenerConductor();
  cambio.value = 1;
  const busSeleccionado = buses.value.find(
    (transporte) => transporte._id === id
  );
  if (busSeleccionado) {
    idBus.value = String(busSeleccionado._id);
    fixed.value = true;
    titleDialog.value = "Editar Bus";
    NumBus.value = busSeleccionado.NumBus;
    Vehiculo.value = busSeleccionado.Vehiculo;
    NumAsientos.value = busSeleccionado.NumAsientos;
    conductor_id.value = {
      label: `${busSeleccionado.conductor_id}-${busSeleccionado.conductor_id.nombre}`,
      value: String(busSeleccionado.conductor_id._id),
    }
    Soat.value = format(new Date(busSeleccionado.Soat), "yyyy-MM-dd");
  }
}

async function InactivarBus(id) {
  try {
    showDefault();
    await busStore.putInactivarBus(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Bus Inactivo",
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
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

let validacion = ref(false);
let notification = ref(null);
/* async function ActivarVendedor(id) {
  try {
    showDefault();
    await VendedoresStore.putActivarVendedor(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Vendedor Inactivado",
      timeout: 2000,
      type: 'positive',
    });
    obtenerInfo()
  } catch (error) {
    if (notification) {
      notification()
    };
    $q.notify({
      spinner: false,
      message: `${error.response.data.error.errors[0].msg}`,
      timeout: 2000,
      type: 'negative',
    });
  }
} */
async function ActivarBus(id) {
  try {
    showDefault();
    await busStore.putActivarBus(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Bus Activo",
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
</script>

<style scoped>
.body {
  width: 100%;
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
  align-items: center;
}

.containerError h4 {
  font-size: 25px;
  margin: 0;
  padding: 0;
}

.tbus {
  width: 100%;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.tbus div h1 {
  font-family: "Letra";
  text-align: center;
  font-size: 105px;
  margin: 0;
  align-items: center;
  margin-top: 4%;
}

.tbus div hr {
  background-color: green;
  height: 4px;
  border: none;
  width: 450px;
}

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

hr {
  background-color: green;
  height: 2px;
  border: none;
  width: 363px;
  margin-bottom: 1%;
}

.text-h6 {
  font-size: 28px;
  font-family: "Letra";
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

.TitleDialog {
  margin: 0;
  font-size: 15px;
  padding: 0;
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
