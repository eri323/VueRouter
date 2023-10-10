<template>
    <div class="body">
        <div class="containerBoton">
            <q-btn label="Agregar Ruta" color="primary" @click="small = true" />
        </div>

        <div class="tabladiv">
            <div class="q-pa-md">
                <q-table title="Treats" :rows="rows" :columns="columns" row-key="name">
                    
                    <template title="Treats" v-slot:body-cell-Opciones=props>
                        <q-td :props="props">
                            <q-btn >❌</q-btn>
                            <q-btn>✍️</q-btn>
                            <q-btn >✔️</q-btn>
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
let DatosData = ref([]);
let rows = ref([]);
let colums = ref([]);
const small = ref(false);
async function ObtenerDatos() {
    const response = await axios.get(
        `https://transporte-0ydp.onrender.com/api/ruta/rutabusca`
    );
    const data = response.data;
    rows.value = data.ruta
    colums.value = data.ruta



    console.log(data);
}


/* function formatoHora(hora) {
  const fechaHora = new Date(hora);
  const opcionesDeFormato = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return fechaHora.toLocaleTimeString("es-ES", opcionesDeFormato);
} */
function formatoFecha(fecha) {
    const fechaHora = new Date(fecha);
    const opcionesDeFormato = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return fechaHora.toLocaleDateString("es-ES", opcionesDeFormato);
}

const columns = [
    { name: 'Sucursal', align: 'center', label: 'sucursal', field: 'sucursal', sortable: true },
    { name: 'Origen', label: 'Origen', field: 'Origen', sortable: true },
    { name: 'Destino', label: 'Destino', field: 'Destino', sortable: true },
    { name: 'Fecha Salida', label: 'Fecha Salida', field: 'fecha_salida', sortable: true },
    { name: 'Estado', label: 'Estado', field: 'estado', sortable: true },
    { name: 'Opciones', label: 'Opciones', field: 'Opciones', sortable: true }
]



onMounted(() => {
    ObtenerDatos();
});
</script>

<style scoped>
.body {
    padding: 30px;
    border-radius: 20px;
}

.tbody {
    border-bottom-left-radius: 100px;
    text-transform: capitalize;
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
    text-align: center;
    align-items: center;
    border-top: 3px solid black;
    border-bottom: 3px solid black;
    background-color: rgb(191, 255, 255);
}

.container {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25px;
    border: 3px solid black;
    background-color: white;

    border-radius: 30px;
    display: grid;
    gap: 15px;
    justify-items: center;
}

/*#Edibtn:hover {
  background-color: rgb(90, 255, 178);
  transform: scale(1.1);
  border: 3px solid green;
}

#Elibtn:hover {
  background-color: rgb(255, 179, 179);
  transform: scale(1.1);
  border: 3px solid red;
}*/

#Elibtn {
    border: none;
    background-color: rgb(255, 215, 215);
    border-radius: 10px;
    cursor: pointer;
}

.containerBoton {
    display: flex;
    justify-content: center;
}

#Edibtn {
    border: none;
    background-color: rgb(133, 255, 200);
    border-radius: 10px;
    cursor: pointer;
}

#th1 {
    border-top-left-radius: 25px;
}

#th9 {
    border-top-right-radius: 25px;
}

.tabladiv {
    font-size: 25px;
    border: 3px solid black;
    display: flex;
    justify-content: center;
    background-color: rgb(255, 255, 255);
    padding: 30px;
    border-radius: 30px;
    margin-top: 30px;
    text-transform: capitalize;
}

td {
    padding: 10px;
    text-align: center;
}

.tabla {
    box-shadow: 5px 5px 114px rgb(162, 247, 255);

    border-collapse: collapse;
}

#boton {
    font-weight: bold;
    padding: 15px;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
    border-radius: 10px;
    border: none;
    font-size: 25px;
    background-color: rgb(184, 228, 255);
    cursor: pointer;
    color: black;
}

#botonm {
    font-weight: bold;
    padding: 7px;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
    border-radius: 10px;
    border: none;
    font-size: 15px;
    background-color: rgb(184, 228, 255);
    cursor: pointer;
    color: black;
}

tr:nth-child(even) {
    background-color: rgb(184, 228, 255);
    /* Color para las filas impares */
}

/*#botonm:hover {
  background-color: rgb(135, 211, 255);
  transform: scale(1.1);
  border: 3px rgb(0, 136, 255) solid;
}

#boton:hover {
  background-color: rgb(135, 211, 255);
  transform: scale(1.1);
  border: 3px rgb(0, 136, 255) solid;
}*/

th {
    background-color: rgb(113, 189, 255);
    padding: 20px;
    text-align: center;
}

#divs {
    display: flex;
    flex-direction: column;
    width: 200px;

    background-color: aliceblue;
    padding: 15px;
    border-radius: 20px;
    border: 3px rgb(0, 136, 255) solid;
}

button {
    margin: 5px;
    padding: 7px;
}
</style>
