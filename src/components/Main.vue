<template>
  <div class="container">
    <q-page-container
      class="contenedor2"
      v-for="(item, index) in content"
      :key="index"
    >
      <router-link :to="item.ruta">
        <div class="card">
          <div class="card__content">
            {{ item.titulo }}
            <div class="i">
              <i :class="item.icono"></i>
            </div>
          </div>
        </div>
      </router-link>
    </q-page-container>
  </div>
</template>

<script setup>
import { ref } from "vue";

let content = ref([
  {
    ruta: "/Vendedores",
    titulo: "Vendedores",
    icono: "fa-solid fa-clipboard-user",
  },
  { ruta: "/bus", titulo: "Buses", icono: "fa-solid fa-bus-simple" },
  { ruta: "/cliente", titulo: "Clientes", icono: "fa-solid fa-user-tie" },
  {
    ruta: "/Conductores",
    titulo: "Conductores",
    icono: "fa-solid fa-users-line",
  },
  { ruta: "/ruta", titulo: "Rutas", icono: "fa-solid fa-road" },
  { ruta: "/venta", titulo: "Venta", icono: "fa-solid fa-cart-shopping" },
  { ruta: "/tickete", titulo: "Tickets", icono: "fa-solid fa-ticket" },
]);
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap");

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  min-height: 86%;
}

.contenedor2 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 0px 55px;
}

.contenedor2 a {
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-size: 2em;
}

.img {
  position: relative;
  height: 150px;
  width: 150px;
}

.card {
  margin: 0;
  background-color: #f8fbfe;
  border-radius: 18px;
  width: 300px;
  padding: 45px 0px;
}
.card:hover {
  transform: scale(1.1);
  transition: ease-in-out 0.5s;
}
@font-face {
  font-family: "Letra";
  src: url("../fonts/Anta-Regular.ttf");
}
.circle {
  padding: 0 4px;
}

/*.box {
    display: inline-block;
    align-items: center;
    width: 10px;
    height: 10px;
    padding: 1px;
    border-radius: 50%;
}*/

.blue {
  background-color: #1920e6;
}

.card__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Letra";
}

/* .i{
    display: flex;
    align-content: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 100px;
    margin-top: 55px;
} */
.i i {
  font-size: 105px;
}
</style>
