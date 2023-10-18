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
                  <q-input v-model="sucursal" label="Sucursal" style="width: 300px;" v-if="cambio == 0" />
                  <q-input v-model="origen" label="Origen" style="width: 300px;" v-if="cambio == 0" />
                  <q-input v-model="destino" label="Destino" style="width: 300px;" />
                  <q-input v-model="fecha_salida" label="Fecha salida" style="width: 300px;" />
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                  <q-btn flat label="Cerrar" color="primary" v-close-popup />
                  <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarRuta()" />
              </q-card-actions>
          </q-card>
      </q-dialog>
      <div>
          <h1>Rutas</h1>
          <div class="btn-agregar">
              <q-btn color="secondary" label="Agregar" @click="agregarBus()" />
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
                      <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
                      <q-btn color="amber" glossy label="❌" @click="InactivarRuta(props.row._id)"
                          v-if="props.row.estado == 1" />
                      <q-btn color="amber" glossy label="✅" @click="ActivarRuta(props.row._id)" v-else />
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
let origen = ref();
let destino = ref('');
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

onMounted(async () => {
  obtenerInfo()
});

const columns = [
  { name: 'sucursal', label: 'Sucursal', field: 'sucursal', sortable: true },
  { name: 'Origen', label: 'Origen', field: 'Origen', sortable: true },
  { name: 'Destino', label: 'Destino', field: 'Destino', sortable: true},
  { name: 'fecha_salida', label: 'Fecha salida', field: 'fecha_salida' },
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
  {
      name: 'opciones', label: 'Opciones',
      field: row => null,
      "sortable": false,
  },
];

function agregarBus() {
  fixed.value = true;
  text.value = "Agregar Bus";
  cambio.value = 0
}

async function editarAgregarRuta() {
  if (cambio.value === 0) {
      await rutaStore.postBus({
          sucursal: sucursal.value,
          origen: origen.value,
          destino: destino.value,
          fecha_salida: fecha_salida.value,
      })
      limpiar() 
      obtenerInfo()

  } else {
      let id = idBus.value;
      if (id) {
          await busStore.putEditarBus(id,{
              cantidad_asientos: cantidad_asientos.value,
              empresa_asignada: empresa_asignada.value,
          });
         
          limpiar(); 
          obtenerInfo()
          fixed.value = false;
      }
  }
}


function limpiar() {
  placa.value = ""
  numero_bus.value = ""
  cantidad_asientos = ""
  empresa_asignada = ""
}

let idBus = ref('')
async function EditarBus(id) {
  cambio.value = 1;
  const busSeleccionado = buses.value.find((bus) => bus._id === id);
  if (busSeleccionado) {
      idBus.value = String(busSeleccionado._id);
      fixed.value = true;
      text.value = "Editar Bus";
      cantidad_asientos.value = busSeleccionado.cantidad_asientos;
      empresa_asignada.value = busSeleccionado.empresa_asignada;
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