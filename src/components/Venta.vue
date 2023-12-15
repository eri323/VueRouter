<template>
  <div class="container-all">
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
          <q-card-section style="max-height: 50vh" class="scroll">
            <div class="q-pa" style="width: 300px">
              <!--   <q-input
                v-model="Nmro_ticket"
                label="Numero de tickete"
                type="number"
                style="width: 300px"
              /> -->
              <div class="q-gutter">
                <q-select
                  v-model="ruta"
                  :options="optionsRutas"
                  label="Rutas"
                />
              </div>
            </div>
            <div class="q-pa" style="width: 300px">
              <div class="q-gutter">
                <q-select v-model="bus" :options="optionsBuses" label="Buses" />
              </div>
            </div>
            <q-input
              v-model="fecha_departida"
              filled
              type="date"
              style="width: 300px"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right" class="btns">
            <button class="btn" v-close-popup>Cancelar</button>
            <button @click="generarTicketInfo()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>

    <div class="container">
      <div class="btn-generar">
        <q-btn color="green" label="Generar Ticket" @click="generarTicket()" />
      </div>
      <div class="container-info">
        <div v-if="asientos.length" class="container-bus"  >
          <div v-for="i in asientos" :key="i" class="container-asientos">
            <button 
              id="numerazo"
              type="button"
              :value="i"
              @click="no_asiento = i"
              :style="{
                backgroundColor: no_asiento === i || ocupados.includes(i) ? 'red' : 'initial',
              }"
              :disabled="ocupados.includes(i)"
            >

              {{ i }} <img src="../assets/seat.png" alt="" />
            </button>
          </div>
        </div>
        <div v-if="no_asiento!=0" class="cliente">
          <q-btn
            class="bnt-bc"
            color="green"
            label="Buscar Cliente"
            @click="buscarCliente()"
          />
          <q-input
            class="label"
            standout
            v-model="cedula"
            label="Cedula"
            placeholder="Cedula del cliente"
            style="width: 300px"
          />
          <q-input
            class="label"
            standout
            v-model="nombre"
            label="Nombre"
            placeholder="Nombre del cliente"
            style="width: 300px"
          />
          <q-input
            class="label"
            standout
            v-model="telefono"
            label="Telefono"
            placeholder="Telefono del cliente"
            style="width: 300px"
          />
          <q-btn
            class="btn-c"
            color="green"
            label="Generar Ticket"
            @click="CrearTicket()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useBusStore } from "../stores/Bus.js";
import { useRutaStore } from "../stores/Ruta.js";
import { useClienteStore } from "../stores/Cliente.js";
import { useTicketStore } from "../stores/Tickete.js";
import { useVendedorStore } from "../stores/Vendedor.js";
import { useQuasar } from "quasar";

const $q = useQuasar();
/* import { useLoginStore } from "../stores/Login.js"; */

const busStore = useBusStore();
const rutaStore = useRutaStore();
const clienteStrore = useClienteStore();
const ticketStore = useTicketStore();
const VendedoresStore = useVendedorStore();
/* const loginStore = useLoginStore(); */

const successNotification = () => {
  notification = $q.notify({
    spinner: false,
    message: "ticket Creado",
    timeout: 2000,
    type: "positive",
  });
};

let badMessage = ref()
const badNotification = () => {
  notification = $q.notify({
    spinner: false,
    message: badMessage,
    timeout: 2000,
    type: "negative",
  });
};
let fixed = ref(false);
let text = ref("");
let ruta = ref("");
let bus = ref("");
let Nmro_ticket = ref("");
let fecha_departida = ref("");
let NumAsientos = ref(0);
let showClienteDiv = ref(false);
let cedula = ref("");
let nombre = ref("");
let telefono = ref("");
let buses = ref([]);
let rutas = ref([]);
let clientes = ref([]);
let asientos = ref([]);
let vendedor = ref([]);
let no_asiento = ref(0);

let optionsRutas = ref([]);
let optionsBuses = ref([]);

async function obtenerInfo() {
  await busStore.obtenerInfoBuses();
  buses.value = busStore.buses;

  await rutaStore.obtenerInfoRutas();
  rutas.value = rutaStore.rutas;

  await clienteStrore.obtenerInfoCliente();
  clientes.value = clienteStrore.clientes;
}

async function obtenerRutas() {
  try {
    await rutaStore.obtenerInfoRutas();
    optionsRutas.value = rutaStore.rutas.map((ruta) => ({
      label: `${ruta.Origen} - ${ruta.Destino}`,
      value: String(ruta._id),
    }));
  } catch (error) {
    console.log(error);
  }
}

async function obtenerBuses() {
  try {
    await busStore.obtenerInfoBuses();
    optionsBuses.value = busStore.buses.map((bus) => ({
      label: `${bus.Vehiculo} - ${bus.NumBus}`,
      value: String(bus._id),
    }));
  } catch (error) {
    console.log(error);
  }
}

function generarListaAsientos() {
  const busSeleccionado = buses.value.find(
    (b) => b._id === bus._rawValue.value
  );
  if (busSeleccionado) {
    const numeroAsientos = busSeleccionado.NumAsientos;
    const listaAsientos = [];
    for (let i = 1; i <= numeroAsientos; i++) {
      listaAsientos.push(Number(i));
    }
    asientos.value = listaAsientos;
    aOcupados()
  }
}

const ocupados=ref([])

async function aOcupados(){

  const id_bus = bus._rawValue.value
  const ruta_id = ruta._rawValue.value
  const fecha_de_partida = fecha_departida.value


  const res = await ticketStore.getAsientosOcupados(id_bus, ruta_id, fecha_de_partida)
  console.log(res);
  ocupados.value = res.map(t=>t.N_asiento)
}

let cliente_id = ref("");
async function buscarCliente() {
  const clienteEncontrado = clientes.value.find(
    (cliente) =>
      cliente.CC_cliente === cedula.value ||
      cliente.Nombre_cliente === nombre.value ||
      cliente.Telefono_cliente === telefono.value
  );
  if (clienteEncontrado) {
    cedula.value = clienteEncontrado.CC_cliente;
    nombre.value = clienteEncontrado.Nombre_cliente;
    telefono.value = clienteEncontrado.Telefono_cliente;
    cliente_id.value = clienteEncontrado._id;
  } else {
    // Cliente no encontrado, puedes mostrar un mensaje de error o realizar alguna acción
    $q.notify({
      message: "Cliente no encontrado",
      type: "negative",
    });
  }
}

async function generarTicket() {
  await obtenerRutas();
  fixed.value = true;
  text.value = "Generar Ticket";
}
let proximoNumeroTicket = ref(1);
async function generarTicketInfo() {
  fixed.value = false;
  if (asientos.value.includes(NumAsientos.value)) {
    // Mostrar mensaje de error o realizar alguna acción
    $q.notify({
      message: "El asiento seleccionado ya está ocupado en otro ticket",
      type: "negative",
    });
    return;
  }
  // Asigna el próximo número del ticket al campo Nmro_ticket
  Nmro_ticket.value = String(proximoNumeroTicket.value).padStart(6, "0");

  // Incrementa el número para el próximo ticket
  proximoNumeroTicket.value += 1;
  generarListaAsientos();
}

async function CrearTicket() {
  // const token = loginStore.token;
  // console.log(token);
  try {
   console.log("Este código funciona");

  await ticketStore.postticket({
    Vendedor_id: String(vendedor.value._id),
    Nmro_ticket: Nmro_ticket.value++,
    Cliente_id: cliente_id.value,
    Transporte_id: bus._rawValue.value,
    Ruta_id: ruta._rawValue.value,
    N_asiento: no_asiento.value,
    fecha_venta: fecha_departida.value,
  });
  successNotification(); 
  ocupados.value.push(no_asiento.value)
  } catch (error) {
    console.log(error.response.data.error.errors[0].msg);
    badMessage.value = error.response.data.error.errors[0].msg;
    badNotification();

  }
  
}

let notification = ref();

async function obtenerVendedor() {
  vendedor.value = VendedoresStore.vendedor;
}

let tickets = ref([]);

watch(ruta, () => {
  obtenerBuses();
});

watch(no_asiento, () => {
  showClienteDiv = true;
});

onMounted(async () => {
  obtenerInfo();
  obtenerVendedor();
});
</script>

<style scoped>
@font-face {
  font-family: "Letra";
  src: url("../fonts/Anta-Regular.ttf");
}

.container-all {
  margin: 0;
  padding: 0;
  width: 100%;
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

.container {
  /*   width: 100%; */
 
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-generar {
  width: 100%;
  margin-top: 70px;
  display: flex;
  justify-content: center;
  margin-right: 10px;
  font-family: "Letra";
}

.container-info {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
}

.container-bus {
 /*  height: 250px;
  width: 100%; */
  display: flex;
  width: 50%;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
/*   margin-top: 70px; */
}

.container-asientos {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  cursor: pointer;
}

.container-asientos button {
  width: 100px;
  height: 90px;
  margin: 5px;
  font-size: 6mm;
  border-radius: 5px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  border: solid rgb(80, 252, 0);
  cursor: pointer;
}

.container-asientos button:hover {
  background-color: rgb(105, 105, 198);
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

.btns {
  display: flex;
  gap: 15px;
}

.btn:hover {
  transition: ease-in-out 0.5s;
  transform: scale(1.1);
}

.cliente {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
}

.cliente input {
  margin: 4px;
}

.bnt-bc {
  margin-bottom: 2px;
}

.btn-c {
  margin-top: 2px;
}

.label {
  background-color: rgba(100, 100, 100, 0.329);
  border-radius: 5px;
  border: solid rgb(124, 119, 119) 1px;
  margin: 1px;
}

#numerazo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;
  font-size: 15px;
}

#numerazo img {
  width: 50px;
}

.text-h6 {
  font-family: "Letra";
  font-size: 30px;
}
</style>
