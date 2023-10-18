<template>
  <div>
      <!-- Modal -->
      <q-dialog v-model="fixed">
          <q-card class="modal-content">
              <q-card-section class="row items-center q-pb-none" style="color: black;">
                  <div class="text-h6">{{ text }}</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>
              <q-separator />

              <q-card-section style="max-height: 50vh" class="scroll">
                  <q-input v-model="sucursal" label="Sucursal" style="width: 300px;" />
                  <q-input v-model="Origen" label="Origen" style="width: 300px;" />
                  <q-input v-model="Destino" label="Destino" style="width: 300px;" />
                  <q-input type="date" v-model="fecha_salida" label="Fecha salida" style="width: 300px;" />
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                  <q-btn flat label="Cancelar" color="primary" v-close-popup  />
                  <q-btn flat label="Aceptar" color="primary" @click="editarAgregarRuta()" />
              </q-card-actions>
          </q-card>
      </q-dialog>
      <div>
          <h1>Rutas</h1>
          <div class="btn-agregar">
              <q-btn color="secondary" label="Agregar" @click="agregarRuta()" />
          </div>
          <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">
              <template v-slot:body-cell-estado="props">
                  <q-td :props="props">
                      <label for="" v-if="props.row.estado == 1" style="color: green;" >Activo</label>
                      <label for="" v-else style="color: red;">Inactivo</label>

                  </q-td>

              </template>
              <template v-slot:body-cell-opciones="props">
                  <q-td :props="props" class="botones">
                      <q-btn color="white" text-color="black" label="🖋️" @click="EditarRuta(props.row._id)" />
                      <q-btn glossy label="❌" @click="InactivarRuta(props.row._id)"
                          v-if="props.row.estado == 1" />
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
let fecha_salida = ref('');
let cambio = ref(0)

async function obtenerInfo(){
  try {
      await rutaStore.obtenerInfoRutas();
      rutas.value = rutaStore.rutas;
      rows.value = rutaStore.rutas;
  } catch (error) {
      console.log(error);
  }
}



const columns = [
  { name: 'sucursal', label: 'Sucursal', field: 'sucursal', sortable: true },
  { name: 'Origen', label: 'Origen', field: 'Origen', sortable: true },
  { name: 'Destino', label: 'Destino', field: 'Destino', sortable: true},
  { name: 'fecha_salida', label: 'Fecha salida', field: 'fecha_salida', sortable: true, format: (val) => format(new Date(val), 'dd-mm-yyyy') },
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
}

async function editarAgregarRuta() {
  if (cambio.value === 0) {
      await rutaStore.postRuta({
          sucursal: sucursal.value,
          Origen: Origen.value,
          Destino: Destino.value,
          fecha_salida: fecha_salida.value,
      })
      limpiar() 
      obtenerInfo()
  } else {
      let id = idRuta.value;
      if (id) {
          await rutaStore.putEditarRuta(id,{
            sucursal: sucursal.value,
            Origen: Origen.value,
            Destino: Destino.value,
            fecha_salida: fecha_salida.value,
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
  fecha_salida.value = ""
}

let idRuta = ref('')
async function EditarRuta(id) {
  cambio.value = 1;
  const rutaSeleccionada = rutas.value.find((ruta) => ruta._id === id);
  if (rutaSeleccionada) {
    idRuta.value = String(rutaSeleccionada._id);
    fixed.value = true;
    text.value = "Editar Bus";
    sucursal.value = rutaSeleccionada.sucursal
    Origen.value = rutaSeleccionada.Origen
    Destino.value = rutaSeleccionada.Destino
    fecha_salida.value = rutaSeleccionada.fecha_salida
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
  width: 400px;
}

.botones button {
  margin: 2px;
}

.btn-agregar {
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-end
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

</style>