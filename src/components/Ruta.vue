<template>
  <div>
    <div>
      <h1 style="text-align: center;">Rutas</h1>
      <hr>
    </div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <div class="contorno">
          <q-card-section class="row items-center q-pb-none" style="color: black;">
            <div class="text-h6">{{ text }}</div>
            <q-space />
          </q-card-section>
          <q-separator />

          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input v-model="Origen" label="Origen" style="width: 300px;" />
            <q-input v-model="Destino" label="Destino" style="width: 300px;" />
            <q-input type="time" id="fechaInp" v-model="hora_salida" label="Hora De salida" style="width: 300px;" />
          </q-card-section>

          <q-separator />

          <q-card-actions align="center" style="gap: 30px; margin-top: 10px;">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Aceptar" color="primary" @click="editarAgregarRuta()" />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div>
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar ruta" @click="agregarRuta()" />
      </div>
      <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green;">Activo</label>
            <label for="" v-else style="color: red;">Inactivo</label>

          </q-td>

        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-align="center" text-color="black" label="✍️" @click="EditarRuta(props.row._id)" />
            <q-btn glossy label="❌" @click="InactivarRuta(props.row._id)" v-if="props.row.estado == 1" />
            <q-btn glossy label="✔️" @click="ActivarRuta(props.row._id)" v-else />
          </q-td>
        </template>
      </q-table>
    </div>

  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { useRutaStore } from '../stores/Ruta.js';
const rutaStore = useRutaStore()

let rutas = ref([]);
let rows = ref([]);
let fixed = ref(false)
let text = ref('')
let sucursal = ref('');
let Origen = ref();
let Destino = ref('');
let hora_salida = ref('');
let cambio = ref(0)

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
  { name: 'Origen', label: 'Origen', field: 'Origen', sortable: true, },
  { name: 'Destino', label: 'Destino', field: 'Destino', sortable: true },
  {
    name: 'hora_salida', label: 'Hora De salida', field: 'hora_salida', sortable: true,
   /*  format: (val) => {
      const date = new Date(val);
      const day = date.getDate() + 1;
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}-${month < 10 ? '0' : ''}${month}-${year}`;
    } */
  },
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
  {
    name: 'opciones', label: 'Opciones',
    field: row => null,
    "sortable": false,
  },
];

function agregarRuta() {
  fixed.value = true;
  text.value = "Agregar Ruta";
  cambio.value = 0
  limpiar()
}

async function editarAgregarRuta() {
  if (cambio.value === 0) {
    await rutaStore.postRuta({
      sucursal: sucursal.value,
      Origen: Origen.value,
      Destino: Destino.value,
      hora_salida: hora_salida.value.slice(0, 10),
    })
    limpiar()
    obtenerInfo()
  } else {
    let id = idRuta.value;
    if (id) {
      await rutaStore.putEditarRuta(id, {
        sucursal: sucursal.value,
        Origen: Origen.value,
        Destino: Destino.value,
        hora_salida: hora_salida.value.slice(0, 10),
      });

      limpiar();
      obtenerInfo()
      fixed.value = false;
    }
  }
}


function limpiar() {
  sucursal.value = ""
  Origen.value = ""
  Destino.value = ""
  hora_salida.value = ""
}

let idRuta = ref('')
async function EditarRuta(id) {
  cambio.value = 1;
  const rutaSeleccionada = rutas.value.find((ruta) => ruta._id === id);
  if (rutaSeleccionada) {
    const fechaMostrar = new Date(Date.parse(rutaSeleccionada.hora_salida)).toISOString().slice(0, 10);
    console.log(fechaMostrar)
    console.log(rutaSeleccionada.hora_salida)
    idRuta.value = String(rutaSeleccionada._id);
    fixed.value = true;
    text.value = "Editar Bus";
    sucursal.value = rutaSeleccionada.sucursal;
    Origen.value = rutaSeleccionada.Origen;
    Destino.value = rutaSeleccionada.Destino;
    hora_salida.value = fechaMostrar;
  }
}



async function InactivarRuta(id) {
  await rutaStore.putInactivarRuta(id)
  obtenerInfo()
}

async function ActivarRuta(id) {
  await rutaStore.putActivarRuta(id)
  obtenerInfo()
}

onMounted(async () => {
  obtenerInfo()
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
.contorno{
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
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  justify-content: flex-end;
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

h1 {
  font-family: "Letra";
  text-align: center;
  margin: 0;
  align-items: center;
  margin-top: 2%;
}
.text-h6 {
  font-size: 28px;
}


</style>