<template>
  <div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section class="row items-center q-pb-none" style="color: black">
          <h4>{{text}}</h4>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="q-pa" style="width: 300px">
            <q-input
              v-model="Nmro_ticket"
              type="text"
              label="Numero Asiento"
              style="width: 300px"
            />
            <q-input
              v-model="fecha_venta"
              type="date"
              label="Fecha de Venta"
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
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="editarTicket()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="t">
      <div>
        <h1>Tickets</h1>
        <hr>
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
    field: (row) => `${row.Cliente_id.Nombre_cliente} - ${row.Cliente_id.CC_cliente}- ${row.Cliente_id.Telefono_cliente}`,
  },
  { name: "Ruta_id", label: "Ruta", field: (row) => `${row.Ruta_id.Origen}-${row.Ruta_id.Destino}` },
  {
    name: "Transporte_id",
    label: "Bus",
    field: (row) => `${row.Transporte_id.NumBus}`,
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
      label: `${cliente.nombre} - ${cliente.CC_cliente} - ${cliente.Telefono_cliente}`,
      value: String(cliente._id),
    }));
  } catch (error) {
    console.log(error);


  }
}
async function obtenerBuses() {
  try {
    await rutaStore.obtenerInfoRutas();
    const ruta_ids = rutaStore.rutas.map((ruta) => String(ruta._id));
    await busStore.obtenerInfoBuses();
    const busesFiltrados = busStore.buses.filter((bus) =>
      ruta_ids.includes(String(bus.ruta_id._id))
    );
    optionsBus.value = busesFiltrados.map((bus) => ({
      label: `${bus.NumBus}`,
      value: String(bus._id),
    }));
  } catch (error) {
    console.log(error);
  }
}

async function editarTicket() {
  let id = idTicket.value;
  if (id) {
    await TicketStore.putEditarTicket(id, {
      Vendedor_id: Vendedor_id._rawValue.value,
      Cliente_id: Cliente_id._rawValue.value,
      Transporte_id: Transporte_id._rawValue.value,
      Ruta_id: Ruta_id._rawValue.value,
      Nmro_ticket: Nmro_ticket.value,
      fecha_venta: fecha_venta.value,
    });
    limpiar();
    obtenerInfo();
    fixed.value = false;
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
  const TicketSeleccionado = ticketes.value.find((ticket) => ticket._id === id);
  if (TicketSeleccionado) {
    idTicket.value = String(TicketSeleccionado._id);
    fixed.value = true;
    text.value = "Editar Bus";

    Vendedor_id.value = {
      label: `${TicketSeleccionado.Vendedor_id.Nombre}`,
      value: String(TicketSeleccionado.Vendedor_id._id),
    };

    Cliente_id.value = {
      label: `${TicketSeleccionado.cliente_id.Nombre_cliente}-${TicketSeleccionado.cliente_id.CC_cliente}- ${TicketSeleccionado.cliente_id.Telefono_cliente}`,
      value: String(TicketSeleccionado.cliente_id._id),
    };

    Transporte_id.value = {
      label: ` N°${TicketSeleccionado.Transporte_id.NumBus}`,
      value: String(TicketSeleccionado.Transporte_id._id),
    };

    Nmro_ticket.value = Nmro_ticket.value;

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
      label: `${ticketSelect.cliente_id.nombre} - ${ticketSelect.cliente_id.cedula} - ${ticketSelect.cliente_id.telefono}`,
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
  await busStore.putInactivarTicket(id);
  obtenerInfo();
}

async function ActivarTicket(id) {
  await busStore.putActivarTicket(id);
  obtenerInfo();
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
th{
  text-align: center;
}
</style>
