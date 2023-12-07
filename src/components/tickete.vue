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

          <q-card-section style="max-height: 50vh" class="scroll">
            <div class="q-pa" style="width: 300px">
              <q-input
                v-model="Nmro_ticket"
                type="text"
                label="Numero Ticket"
                style="width: 300px"
              />

              <div class="q-gutter">
                <q-select
                  v-model="Vendedor_id"
                  :options="optionsVendedor"
                  label="Vendedor"
                />
              </div>
            </div>
            <div class="q-pa" style="width: 300px">
              <div class="q-gutter">
                <q-select
                  v-model="Cliente_id"
                  :options="optionsCliente"
                  label="Cliente"
                />
              </div>
            </div>
            <div class="q-pa" style="width: 300px">
              <div class="q-gutter">
                <q-select
                  v-model="Ruta_id"
                  :options="optionsRutas"
                  label="Rutas"
                />
              </div>
            </div>
            <div class="q-pa" style="width: 300px">
              <div class="q-gutter">
                <q-select
                  v-model="Transporte_id"
                  :options="optionsBus"
                  label="Bus"
                />
              </div>
              <q-input
                v-model="fecha_venta"
                type="date"
                label="Fecha de Venta"
                style="width: 300px"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn
              flat
              label="Aceptar"
              color="primary"
              @click="editarTicket()"
            />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div class="t">
      <div>
        <h1>Tickets</h1>
        <hr />
      </div>
      <div class="t">
        <q-table title="Ticket" :rows="rows" :columns="columns" row-key="name">
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
              <q-btn
                color="white"
                text-color="black"
                label="📋"
                @click="imprimirticket(props.row)"
              />
              <q-btn
                color="white"
                text-color="black"
                label="🖋️"
                @click="EditarTicket(props.row._id)"
              />
              <q-btn
                glossy
                label="❌"
                @click="InactivarTicket(props.row._id)"
                v-if="props.row.estado == 1"
              />
              <q-btn
                glossy
                label="✔️"
                @click="ActivarTicket(props.row._id)"
                v-else
              />
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
import { useTicketStore } from "../stores/Tickete.js";
import { useVendedorStore } from "../stores/Vendedor.js";
import { useClienteStore } from "../stores/Cliente.js";
import { useRutaStore } from "../stores/Ruta.js";
import { useBusStore } from "../stores/Bus.js";
import { useQuasar } from "quasar";
import {jsPDF} from 'jspdf';
import images from '../assets/autobus.png';
import images2 from '../assets/mora.jpeg'

const $q = useQuasar();
const TicketStore = useTicketStore();
const VendedorStore = useVendedorStore();
const clienteStore = useClienteStore();
const rutaStore = useRutaStore();
const busStore = useBusStore();
let Nmro_ticket = ref("");
let fecha_venta = ref("");
let Vendedor_id = ref("");
let Cliente_id = ref("");
let Ruta_id = ref("");
let text = ref("");
let Transporte_id = ref("");
let optionsVendedor = ref([]);
let optionsCliente = ref([]);
let optionsBus = ref([]);
let optionsRutas = ref([]);
/* const conductorStore = useConductorStore() */
let ticketes = ref([]);
let rows = ref([]);
let fixed = ref(false);
let Vehiculo = ref("");
let NumAsientos = ref();
let conductor_id = ref("");
let cambio = ref(0);

async function obtenerInfo() {
  try {
    await TicketStore.obtenerInfoTicket();
    console.log(TicketStore.ticketes);
    ticketes.value = TicketStore.ticketes;
    rows.value = TicketStore.ticketes;
  } catch (error) {
    console.log(error);
  }
}

const options = ref(["google", "api"]);
onMounted(async () => {
  obtenerInfo();
});

const columns = [
  {
    name: "Nmro_ticket",
    label: "Numero de ticket",
    field: "Nmro_ticket",
    sortable: true,
  },
  {
    name: "fecha_venta",
    label: "Fecha de venta",
    field: "fecha_venta",
    sortable: true,
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  {
    name: "Vendedor_id",
    label: "Vendedor",
    field: (row) => `${row.Vendedor_id.Nombre}`,
  },
  {
    name: "Cliente_id",
    label: "Cliente",
    field: (row) =>
      `${row.Cliente_id.Nombre_cliente} - ${row.Cliente_id.CC_cliente}- ${row.Cliente_id.Telefono_cliente}`,
  },
  {
    name: "Ruta_id",
    label: "Ruta",
    field: (row) => `${row.Ruta_id.Origen}-${row.Ruta_id.Destino}`,
  },
  {
    name: "Transporte_id",
    label: "Bus",
    field: (row) =>
      `${row.Transporte_id.NumBus}-${row.Transporte_id.Vehiculo}-${row.Transporte_id.NumAsientos}`,
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
async function obtenerVendedor() {
  try {
    await VendedorStore.obtenerInfoVendedor();
    optionsVendedor.value = VendedorStore.vendedores.map((vendedor) => ({
      label: `${vendedor.Nombre} `,
      value: String(vendedor._id),
    }));
  } catch (error) {
    console.log(error);
  }
}
async function obtenerCliente() {
  try {
    await clienteStore.obtenerInfoCliente();
    optionsCliente.value = clienteStore.clientes.map((cliente) => ({
      label: `${cliente.Nombre_cliente} - ${cliente.CC_cliente} - ${cliente.Telefono_cliente}`,
      value: String(cliente._id),
    }));
  } catch (error) {
    console.log(error);
  }
}
/* async function obtenerBuses() {
  try {
    await rutaStore.obtenerInfoRutas();
    const ruta_ids = rutaStore.rutas.map((ruta) => String(ruta._id));
    optionsRutas.value = ruta_ids.map((bus) => ({
      label: `${bus.NumBus}-${bus.Vehiculo}-${bus.NumAsientos}`,
      value: String(bus._id),
    }))
    await busStore.obtenerInfoBuses();
    const busesFiltrados = busStore.buses.filter((bus) =>
      ruta_ids.includes(String(bus.ruta_id._id))
    );
    optionsBus.value = busesFiltrados.map((bus) => ({
      label: `${bus.NumBus}-${bus.Vehiculo}-${bus.NumAsientos}`,
      value: String(bus._id),
    }));
  } catch (error) {
    console.log(error);
  }
}
 */

async function obtenerBuses() {
  try {
    await busStore.obtenerInfoBuses();
    optionsBus.value = busStore.buses.map((bus) => ({
      label: `${bus.NumBus} - ${bus.Vehiculo}`,
      value: String(bus._id),
    }));
  } catch (error) {
    console.log(error);
  }
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
let greatMessage = ref("");
let badMessage = ref("");

// Notificacion Buena
const showGreat = () => {
  notification = $q.notify({
    spinner: false,
    message: greatMessage,
    timeout: 2000,
    type: "positive",
  });
};

// Notificacion Mala
const showBad = () => {
  notification = $q.notify({
    spinner: false,
    message: badMessage,
    timeout: 2000,
    type: "negative",
  });
};
// Notificacion de Carga
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

// Cancelar Notificacion
const cancelShow = () => {
  if (notification) {
    notification();
  }
};
let notification = ref(null);

let validacion = ref(false);

function validar() {
  if (
    !Vendedor_id.value &&
    !Cliente_id.value &&
    !Ruta_id.value &&
    !Transporte_id.value &&
    !Nmro_ticket.value &&
    !fecha_venta.value
  ) {
    badMessage.value = "Por favor rellene los campos";
    showBad();
  } else if (!Vendedor_id.value) {
    badMessage.value = "Seleccione el Vendedor";
    showBad();
  } else if (!Cliente_id.value) {
    badMessage.value = "Seleccione el Cliente";
    showBad();
  } else if (!Ruta_id.value) {
    badMessage.value = "Seleccione la ruta";
    showBad();
  } else if (!Transporte_id.value) {
    badMessage.value = "Seleccione el bus";
    showBad();
  } else if (!Nmro_ticket.value) {
    badMessage.value = "Especifique el numero de ticket";
    showBad();
  } else if (!fecha_venta.value) {
    badMessage.value = "Seleccione la fecha de venta";
    showBad();
  } else {
    validacion.value = true;
  }
}
async function imprimirticket(ticket) {
  
  const doc = new jsPDF(); 
  doc.addImage(images, 'PNG', 20, 20, 60, 50);
  
  // Título
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(25);
  doc.setTextColor(0, 105, 217);
  doc.text('TransporteLEF', 110 , 50);

  // Títulos
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 30, 30);
  doc.text('Información del Cliente:', 20, 90);
  // NumeroTicket: ticket.Nmro_ticket,
  //   Fecha_Venta: ticket.fecha_venta,
  
  //   Vendedor: ticket.Vendedor_id.Nombre,
  //   Cliente: ticket.Cliente_id.Nombre_cliente,
  //   Origen: ticket.Ruta_id.Origen, 
  //   Destino: ticket.Ruta_id.Destino,
  //   Bus: ticket.Transporte_id.NumBus,

  // Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`- Nombre: ${ticket.Cliente_id.Nombre_cliente}`, 20, 98);
  doc.text(`- C.C: ${ticket.Cliente_id.CC_cliente}`, 20, 104);
  doc.text(`- Teléfono: ${ticket.Cliente_id.Telefono_cliente}`, 20, 110);
  doc.text(`- N° Asiento: ${ticket.NumAsientos}`, 20, 116);
  
//   // Títulos
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Información del Vendedor:', 20, 125);
  
//   // Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`- Nombre: ${ticket.Vendedor_id.Nombre}`, 20, 130);
  doc.text(`- Teléfono: ${ticket.Vendedor_id.Telefono}`, 20, 136);

  // Títulos
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Información del Conductor:', 20, 145);

//   // Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`- Nombre: ${ticket.Transporte_id.conductor_id.nombre}`, 20, 152);
  doc.text(`- Cedula: ${ticket.Transporte_id.conductor_id.cedula}`, 20, 158);
  
//   // Títulos
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Información del bus:', 130, 90);

//   // Normal
  doc.setTextColor(30, 30, 30);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`- Placa: ${ticket.Transporte_id.Vehiculo}`,   130, 98);
  doc.text(`- N° de bus: ${ticket.Transporte_id.NumBus}`, 130, 104);
  doc.text(`- Ruta del bus: ${ticket.Ruta_id.Origen} - ${ticket.Ruta_id.Destino}`, 130, 110);
/*   doc.text(`- Horario salida: ${ticket.Ruta_id.horario_id.hora_partida}`, 20, 179); */
  doc.text(`- Fecha de Partida: ${format(new Date(ticket.fecha_venta), "yyyy-MM-dd")}`, 130, 116);

  doc.addImage(images2, 'PNG', 148, 120, 40, 40);


//   doc.setFont('Helvetica', 'bold');
//   doc.setFontSize(25);
//   doc.setTextColor(0, 105, 217);
//   doc.text('¡Gracias por tu confianza!', 50, 225);

  doc.save('ticket.pdf');
}

async function editarTicket() {
  let id = idTicket.value;
  if (id) {
    validar();
    if (validacion.value === true) {
      try {
        showDefault();
        await TicketStore.putEditarTicket(id, {
          Vendedor_id: Vendedor_id._rawValue.value,
          Cliente_id: Cliente_id._rawValue.value,
          Transporte_id: Transporte_id._rawValue.value,
          Ruta_id: Ruta_id._rawValue.value,
          Nmro_ticket: Nmro_ticket.value,
          fecha_venta: fecha_venta.value,
        });
        cancelShow();
        limpiar();
        greatMessage.value = "Ticket Actualizado";
        showGreat();
        obtenerInfo();
        fixed.value = false;
      } catch (error) {
        cancelShow();
        badMessage.value = error.response.data.error.errors[0].msg;
        showBad();
      }
    }
  }
}

/* async function obtenerConductor() {
  try {
    await conductorStore.obtenerInfoConductor();
    options.value = conductorStore.conductores.map((conductor) => ({
      label: `${conductor.nombre}`,
      value: String(conductor._id),
    }));
  } catch (error) {
    console.log(error);
  }
} */
function limpiar() {
  Nmro_ticket.value = "";
  fecha_venta.value = "";
  Vendedor_id.value = "";
  Cliente_id.value = "";
  Ruta_id.value = "";
  Transporte_id.value = "";
}

let idTicket = ref("");
async function EditarTicket(id) {
  await obtenerCliente();
  await obtenerVendedor();
  await obtenerBuses();
  await obtenerRutas();
  const TicketSeleccionado = ticketes.value.find((ticket) => ticket._id === id);
  if (TicketSeleccionado) {
    idTicket.value = String(TicketSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Bus";
    Nmro_ticket.value = TicketSeleccionado.Nmro_ticket; // Asigna el valor del Nmro_ticket del ticket seleccionado

    Vendedor_id.value = {
      label: `${TicketSeleccionado.Vendedor_id.Nombre}`,
      value: String(TicketSeleccionado.Vendedor_id._id),
    };

    Cliente_id.value = {
      label: `${TicketSeleccionado.Cliente_id.Nombre_cliente}-${TicketSeleccionado.Cliente_id.CC_cliente}- ${TicketSeleccionado.Cliente_id.Telefono_cliente}`,
      value: String(TicketSeleccionado.Cliente_id._id),
    };

    Transporte_id.value = {
      label: ` N°${TicketSeleccionado.Transporte_id.NumBus}-${TicketSeleccionado.Transporte_id.Vehiculo}-${TicketSeleccionado.Transporte_id.NumAsientos}`,
      value: String(TicketSeleccionado.Transporte_id._id),
    };
    Ruta_id.value = {
      label: ` ${TicketSeleccionado.Ruta_id.Origen}-${TicketSeleccionado.Ruta_id.Destino}`,
      value: String(TicketSeleccionado.Ruta_id._id),
    };
    const date = new Date(TicketSeleccionado.fecha_venta);
    const formattedDate = date.toISOString().split("T")[0];

    fecha_venta.value = formattedDate;
  }
}

/* let idTicket = ref("");
async function EditarTicket(id) {
  await obtenerCliente();
  await obtenerVendedor();
  await obtenerBuses();
  const ticketSelect = tickets.value.find((ticket) => ticket._id === id);
  if (ticketSelect) {
    idTicket.value = String(ticketSelect._id);
    fixed.value = true;
    text.value = "Editar Ticket";
    vendedor.value = {
      label: `${ticketSelect.vendedor_id.nombre} - ${ticketSelect.vendedor_id.telefono}`,
      value: String(ticketSelect.vendedor_id._id),
    };

    cliente.value = {
      label: `${ticketSelect.Cliente_id.nombre} - ${ticketSelect.cliente_id.cedula} - ${ticketSelect.cliente_id.telefono}`,
      value: String(ticketSelect.cliente_id._id),
    };

    bus.value = {
      label: `${ticketSelect.bus_id.empresa_asignada} - ${ticketSelect.bus_id.placa} - N°${ticketSelect.bus_id.numero_bus}`,
      value: String(ticketSelect.bus_id._id),
    };
    no_asiento.value = ticketSelect.no_asiento;

    const date = new Date(ticketSelect.fecha_departida);
    const formattedDate = date.toISOString().split("T")[0];

    fecha_departida.value = formattedDate;
  }
}
 */
async function InactivarTicket(id) {
  try {
    showDefault();
    await TicketStore.putInactivarTicket(id);
    cancelShow();
    greatMessage.value = "Ticket Inactivado";
    showGreat();
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  }
}

async function ActivarTicket(id) {
  try {
    showDefault();
    await TicketStore.putActivarTicket(id);
    cancelShow();
    greatMessage.value = "Ticket Activado";
    showGreat();
    obtenerInfo();
  } catch (error) {
    cancelShow();
    badMessage.value = error.response.data.error.errors[0].msg;
    showBad();
  }
}
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
  justify-content: center;
  color: black;
}
.t {
  width: 100%;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.text-h6 {
  font-size: 28px;
  font-family: "Letra";
}

.t div h1 {
  font-family: "Letra";
  text-align: center;
  font-size: 105px;
  margin: 0;
  align-items: center;
  margin-top: 4%;
}

.t div hr {
  background-color: green;
  height: 4px;
  border: none;
  width: 450px;
}
th {
  text-align: center;
}
</style>
