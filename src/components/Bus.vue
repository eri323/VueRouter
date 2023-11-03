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

          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input v-model="Vehiculo" label="Placa" style="width: 300px" />
            <q-input v-model="NumAsientos" label="Numero de Asientos" type="number" style="width: 300px" />

            <div class="q-gutter-y-md column" style="max-width: 300px">
              <q-select clearable filled color="primary" v-model="conductor_id" :options="options" label="Conductor" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Aceptar" color="primary" @click="editarAgregarBus()" />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div class="tbus">
      <div>
        <h1>Buses</h1>
        <hr />
      </div>
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar Bus" @click="agregarBus()" />
      </div>
      <div class="tbus">
        <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
              <label for="" v-else style="color: red">Inactivo</label>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones">
              <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
              <q-btn glossy label="❌" @click="InactivarBus(props.row._id)" v-if="props.row.estado == 1" />
              <q-btn glossy label="✔️" @click="ActivarBus(props.row._id)" v-else />
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
import { useBusStore } from "../stores/Bus.js";
import { useConductorStore } from "../stores/Conductores.js";
const busStore = useBusStore();
const conductorStore = useConductorStore();
let buses = ref([]);
let rows = ref([]);
let fixed = ref(false);
let Vehiculo = ref("");
let NumAsientos = ref();
let conductor_id = ref("");
let cambio = ref(0);
let titleDialog = ref("");

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

const options = ref(["google", "api"]);
onMounted(async () => {
  obtenerInfo();
});

const columns = [
  { name: "Vehiculo", label: "Placa", field: "Vehiculo", sortable: true },
  {
    name: "NumAsientos",
    label: "Numero De Asientos",
    field: "NumAsientos",
    sortable: true,
  },
  {
    name: "conductor_id",
    label: "Conductor",
    field: (row) => row.conductor_id.nombre,
  },
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

function agregarBus() {
  obtenerConductor();
  fixed.value = true;
  cambio.value = 0;
  titleDialog.value = "Agregar Bus"
}

async function editarAgregarBus() {
  if (cambio.value === 0) {
    await busStore.postBus({
      Vehiculo: Vehiculo.value,
      NumAsientos: NumAsientos.value,
      conductor_id: conductor_id.value,
    });
    titleDialog.value = "Editar Bus"
    limpiar();
    obtenerInfo();
  } else {
    let id = idBus.value;
    if (id) {
      await busStore.putEditarBus(id, {
        Vehiculo: Vehiculo.value,
        conductor_id: conductor_id.value,
        NumAsientos: NumAsientos.value,
      });
      titleDialog.value = "Editar Bus"
      limpiar();
      obtenerInfo();
      fixed.value = false;
    }
  }
}

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
function limpiar() {
  Vehiculo.value = "";
  NumAsientos.value = "";
  conductor_id = "";
}

let idBus = ref("");
async function EditarBus(id) {
  obtenerConductor();
  const busSeleccionado = buses.value.find(
    (transporte) => transporte._id === id
  );
  if (busSeleccionado) {
    idBus.value = String(busSeleccionado._id);
    fixed.value = true;
    titleDialog.value = "Editar Bus"
    conductor_id.value = String(busSeleccionado.conductor_id);
    Vehiculo.value = busSeleccionado.Vehiculo;
    NumAsientos.value = busSeleccionado.NumAsientos;
  }
  
}


async function InactivarBus(id) {
  await busStore.putInactivarBus(id);
  obtenerInfo();
}

async function ActivarBus(id) {
  await busStore.putActivarBus(id);
  obtenerInfo();
}
</script>

<style scoped>
.body {
  width: 100%;
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
  height: 600px;
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
}

.contorno {
  background-color: white;
  height: 340px;
  width: 420px;
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
  justify-content: right;
  color: black;
}
</style>
