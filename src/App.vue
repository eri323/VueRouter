<template>
  <div class="body">
    <div class="container">
      <button style="margin: 20px 0px;" data-bs-toggle="modal" data-bs-target="#exampleModal" id="boton">Agregar
        Producto</button>
    </div>

    <div class="tabladiv">
      <table class="tabla">
        <thead class="tablahead">
          <tr>
            <th id="th1">Código</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Costo</th>
            <th>Precio Total</th>
            <th>Costo Total</th>
            <th>Ganancias</th>
            <th id="th9">Opciones</th>
          </tr>
        </thead>
        <tbody class="tbody">
          <tr v-for="(producto, i) in productos" :key="i">
            <td>{{ producto.Codigo }}</td>
            <td>{{ producto.Nombre }}</td>
            <td
              :style="producto.Cantidad < 10 ? 'border: 3px solid red; background-color: rgb(255, 121, 121);' : producto.Cantidad > 50 ? 'border: 3px solid blue ;background-color: rgb(124, 177, 255);' : ''">
              {{ producto.Cantidad }}</td>
            <td>{{ producto.Precio }}</td>
            <td>{{ producto.Costo }}</td>
            <td>{{ producto.Precio * producto.Cantidad }}</td>
            <td>{{ producto.Costo * producto.Cantidad }}</td>
            <td>{{ producto.Precio * producto.Cantidad - producto.Costo * producto.Cantidad }}</td>
            <td>
              <button @click="Eliminar(i)" id="Elibtn">❌</button>
              <button @click="Editar(producto, i)" id="Edibtn" data-bs-toggle="modal"
                data-bs-target="#exampleModal">✍️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import axios from "axios"
import { ref, onMounted } from 'vue';
const Codigo = ref("")
const Nombre = ref("")
const Cantidad = ref("")
const Precio = ref("")
const Costo = ref("")



let Boton = ref("Agregar")

const productos = ref([
  { Codigo: "001", Nombre: "Producto 1", Cantidad: 5, Precio: 10, Costo: 10 },
  { Codigo: "002", Nombre: "Producto 2", Cantidad: 10, Precio: 15, Costo: 20 },
  { Codigo: "003", Nombre: "Producto 3", Cantidad: 15, Precio: 122, Costo: 30 }
]);



/* const modalAbierto = ref(false);  */
let indiceEdicion = ref(-1);

function agregarProducto() {
  if (validar()) {
    if (Boton.value === "Editar") {
      if (indiceEdicion.value >= 0) {
        const productoEditado = {
          Codigo: Codigo.value,
          Nombre: Nombre.value,
          Cantidad: Cantidad.value,
          Precio: Precio.value,
          Costo: Costo.value,

        };


        productos.value.splice(indiceEdicion.value, 1, productoEditado);
        Boton.value = "Agregar";
        Limpiar();
        cerrarModal();
      }
    } else {
      const nuevoProducto = {
        Codigo: Codigo.value,
        Nombre: Nombre.value,
        Cantidad: Cantidad.value,
        Precio: Precio.value,
        Costo: Costo.value,

      };

      productos.value.push(nuevoProducto);
      Limpiar();
      cerrarModal();
    }
  }
}


function Eliminar(eli) {
  productos.value.splice(eli, 1);
}

function Limpiar() {
  Codigo.value = "";
  Nombre.value = "";
  Cantidad.value = "";
  Precio.value = "";
  Costo.value = "";
}

function Editar(Edi, index) {
  Codigo.value = Edi.Codigo;
  Nombre.value = Edi.Nombre;
  Cantidad.value = Edi.Cantidad;
  Precio.value = Edi.Precio;
  Costo.value = Edi.Costo;
  Boton.value = "Editar";
  indiceEdicion.value = index;

}


let codigodivRef = ref();
let nombredivRef = ref();
let cantidaddivRef = ref();
let preciodivRef = ref();
let costodivRef = ref();
let Error_c = ref("Codigo")
let Error_n = ref("Nombre")
let Error_ca = ref("Cantidad")
let Error_p = ref("Precio")
let Error_co = ref("Costo")
let modalbody = ref("")
let Err = ref("Datos de la tabla")



function validar() {
  let validation = true;
  if (Codigo.value.trim() == "") {
    codigodivRef.value.style.border = "5px solid red";
    codigodivRef.value.style.backgroundColor = "rgb(255, 179, 179)";
    Error()
    setTimeout(function () {
      Err.value = "Datos de la tabla";
      codigodivRef.value.style = "";
      modalbody.value.style = "";
    }, 2500)
    validation = false;
  }

  else if (Nombre.value.trim() == "") {
    nombredivRef.value.style.border = "5px solid red";
    nombredivRef.value.style.backgroundColor = "rgb(255, 179, 179)";
    Error()

    setTimeout(function () {
      Err.value = "Datos de la tabla";
      nombredivRef.value.style = "";
      modalbody.value.style = "";
    }, 2500)
    validation = false;
  }



  else if ((isNaN(parseFloat(Cantidad.value)) || parseFloat(Cantidad.value) <= 0)) {
    cantidaddivRef.value.style.border = "5px solid red";
    cantidaddivRef.value.style.backgroundColor = "rgb(255, 179, 179)";
    Error()

    setTimeout(function () {
      Err.value = "Datos de la tabla";
      cantidaddivRef.value.style = "";
      modalbody.value.style = "";
    }, 2500)
    validation = false;
  }

  else if ((isNaN(parseFloat(Precio.value)) || parseFloat(Precio.value) <= 0)) {
    preciodivRef.value.style.border = "5px solid red";
    preciodivRef.value.style.backgroundColor = "rgb(255, 179, 179)";
    Error()
    setTimeout(function () {
      Err.value = "Datos de la tabla";
      preciodivRef.value.style = "";
      modalbody.value.style = "";
    }, 2500)
    validation = false;
  }

  else if ((isNaN(parseFloat(Costo.value)) || parseFloat(Costo.value) <= 0)) {
    costodivRef.value.style.border = "5px solid red";
    costodivRef.value.style.backgroundColor = "rgb(255, 179, 179)";
    Error()

    setTimeout(function () {
      Err.value = "Datos de la tabla";
      costodivRef.value.style = "";
      modalbody.value.style = "";
    }, 2500)
    validation = false;
  }
  else if (Costo.value > Precio.value) {
    costodivRef.value.style.border = "5px solid red";
    costodivRef.value.style.backgroundColor = "rgb(255, 179, 179)";
    Err.value = "El Costo del producto no puede ser mayor a su precio";

    setTimeout(function () {
      Err.value = "Datos de la tabla";
      costodivRef.value.style = "";
      modalbody.value.style = "";
    }, 2500)
    validation = false;
  }
  return validation;
}


async function ObtenerDatos() {
  try {
     const response = await axios.get(`https://transporte-0ydp.onrender.com/api/ruta/rutabusca`);
    console.log(response.data);
  } catch (error) {
    
  }
   
 
    
  
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
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
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
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
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
}</style>