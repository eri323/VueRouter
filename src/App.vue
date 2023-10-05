<template>
  <div class="body">
    <div class="container">
      <button style="margin: 20px 0px" id="boton">Agregar Ruta</button>
    </div>

    <div class="tabladiv">
      <table class="tabla">
        <thead class="tablahead">
          <tr>
            <th id="th1">Id</th>
            <th>Sucursal</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha Salida</th>
            <th id="th9">Opciones</th>
          </tr>
        </thead>
        <tbody class="tbody">
          <tr v-for="(dato, i) in DatosData" :key="i">
            <td>{{ dato.Id }}</td>
            <td>{{ dato.Sucursal }}</td>
            <td>{{ dato.Origen }}</td>
            <td>{{ dato.Destino }}</td>
            <td>{{ dato.FechaSalida }}</td>
            <td>
              <button @click="Eliminar(i)" id="Elibtn">❌</button>
              <button @click="Editar(producto, i)" id="Edibtn">✍️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
const Codigo = ref("");
const Nombre = ref("");
const Cantidad = ref("");
const Precio = ref("");
const Costo = ref("");

let codigodivRef = ref();
let nombredivRef = ref();
let cantidaddivRef = ref();
let preciodivRef = ref();
let costodivRef = ref();

let modalbody = ref("");
let Err = ref("Datos de la tabla");
let DatosData = ref([]);
async function ObtenerDatos() {
  const response = await axios.get(
    `https://transporte-0ydp.onrender.com/api/ruta/rutabusca`
  );
  const data = response.data;
  DatosData.value.push({
    Id: data.ruta[0]._id,
    Sucursal: data.ruta[0].sucursal,
    Origen: data.ruta[0].Origen,
    Destino: data.ruta[0].Destino,
    FechaSalida: data.ruta[0].fecha_salida,
  });

  console.log(data);
}

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

#Edibtn:hover {
  background-color: rgb(90, 255, 178);
  transform: scale(1.1);
  border: 3px solid green;
}

#Elibtn:hover {
  background-color: rgb(255, 179, 179);
  transform: scale(1.1);
  border: 3px solid red;
}

#Elibtn {
  border: none;
  background-color: rgb(255, 215, 215);
  border-radius: 10px;
}

#Edibtn {
  border: none;
  background-color: rgb(133, 255, 200);
  border-radius: 10px;
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
  background-color: white;
  padding: 30px;
  border-radius: 30px;
  margin-top: 30px;
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

#botonm:hover {
  background-color: rgb(135, 211, 255);
  transform: scale(1.1);
  border: 3px rgb(0, 136, 255) solid;
}

#boton:hover {
  background-color: rgb(135, 211, 255);
  transform: scale(1.1);
  border: 3px rgb(0, 136, 255) solid;
}

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
