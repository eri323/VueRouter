<template>
  <q-layout view="hHh lpR fFf" class="body">
    <q-header reveal elevated class="bg-secondary text-white ">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title style="text-align: center;">
        <!--   <q-avatar>
            <i class="fa-solid fa-bus"></i>
          </q-avatar> -->
          TransporteLEF
        </q-toolbar-title>
        <q-btn dense flat round icon = "logout" @click="cerrarSesion" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
      id="lateral"
      class="bg-white"
    >
      <div class="perfil">
        <div class="perfilAvatar">
          <i class="fa-regular fa-circle-user" id="img"></i>
        </div>
      </div>

      <div class="btns">
        <!-- <router-link class="link" to="/main">
          <button @click="mostrarta()">
            <i class="fa-solid fa-house"></i>
            Menu
          </button></router-link> -->
        <router-link class="link" to="/main">
          <button @click="mostrarta()">
            <i class="fa-solid fa-house"></i>
            Home
          </button></router-link>
        <router-link class="link" to="/Vendedores">
          <button @click="mostrart()">
            <i class="fa-solid fa-clipboard-user"></i>
            Vendedores
          </button>
        </router-link>
        <router-link class="link" to="/Bus">
          <button @click="mostrart()">
            <i class="fa-solid fa-bus-simple"></i>
            buses
          </button>
        </router-link>
        <router-link class="link" to="/Ruta">
          <button @click="mostrart()">
            <i class="fa-solid fa-road"></i>
            rutas
          </button></router-link
        >
        <router-link class="link" to="/Cliente">
          <button @click="mostrart()">
            <i class="fa-solid fa-user-tie"></i>
            Clientes
          </button></router-link
        >
        <router-link class="link" to="/Conductores">
          <button @click="mostrart()">
            <i class="fa-solid fa-users-line"></i>
            Conductores 
          </button></router-link
        >
         <router-link class="link" to="/tickete">
            <button @click="mostrart()">
               <i class="fa-solid fa-ticket"></i>
              Tickete
            </button></router-link
          >
          <router-link class="link" to="/Venta">
              <button @click="mostrart()">
                <i class="fa-solid fa-cart-shopping"></i>
                Venta
              </button></router-link
            >
      </div>
    </q-drawer>

    <q-page-container style="padding-top:50px;">
      <router-view />
    </q-page-container>
    <!-- <q-page-container class="container">
      <div class="tarjetas" v-if="mostrar">
        <router-link to="./Vendedores" class="a">
          <div @click="mostrart()">
            <i class="fa-solid fa-clipboard-user"></i>
            <p>Vendedores</p>
          </div>
        </router-link>
        <router-link to="./Bus">
          <div @click="mostrart()">
            <i class="fa-solid fa-bus-simple"></i>
            <p>Buses</p>
          </div>
        </router-link>
        <router-link to="./Ruta">
          <div @click="mostrart()">
            <i class="fa-solid fa-road"></i>
            <p>Rutas</p>
          </div>
        </router-link>
        <router-link to="./Cliente">
          <div @click="mostrart()">
            <i class="fa-solid fa-user-tie"></i>
            <p>Clientes</p>
          </div>
        </router-link>
        <router-link to="./Conductores">
          <div @click="mostrart()">
            <i class="fa-solid fa-users-line"></i>
            <p>Conductores</p>
          </div>
        </router-link>
         <router-link to="./tickete">
            <div @click="mostrart()">
              <i class="fa-solid fa-ticket"></i>
              <p>Tickete</p>
            </div>
          </router-link>
           <router-link to="./Venta">
              <div @click="mostrart()">
               <i class="fa-solid fa-cart-shopping"></i>
                <p>Venta</p>
              </div>
            </router-link>
      </div>
      <router-view />
    </q-page-container> -->
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router=useRouter();

function cerrarSesion(){
  router.push('/');
}
const leftDrawerOpen = ref(false);
let mostrar = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

function mostrart() {
  mostrar.value = false;
}
function mostrarta() {
  mostrar.value = true;
}


onMounted(async() => {
  mostrarta();
})

</script>

<style scoped>
.body {
  background-image: url("../assets/fondo.jpg");
  background-attachment: fixed;
  background-size: cover;
  display: flex;
  
  justify-content: center;
}
#lateral {
  display: flex;
  flex-direction: column;
}
#img {
  font-size: 150px;
}
.perfilAvatar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 100%;
  width: 150px;
  height: 150px;
  border: none;
}
.perfil {
  display: flex;
  justify-content: center;
  padding: 15px;
  background-color: #00923f;
}
.btns {
  display: flex;
  flex-direction: column;
  justify-content: center;

}
.btns button {
  background-color: white;
  border: none;
  font-family: "Letra";
  width: 100%;
  text-align: left;
  padding: 15px;
  font-size: 20px;
  text-transform: capitalize;
  cursor: pointer;
}
.btns button:hover {
  background-color: rgb(213, 216, 220);
  transition: ease-in-out 0.5s;
}
@font-face {
  font-family: "Letra";
  src: url("../fonts/Anta-Regular.ttf");
}
.tarjetas {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 50px;
  gap: 25px;
  justify-content: center;
}
.tarjetas div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 0;
  background-color: #0088ff;
  border-radius: 15px;
  padding: 15px;
  width: 250px;
  cursor: pointer;
}
.tarjetas div:hover {
  transform: scale(1.1);
  transition: ease-in-out 0.4s;
}
.tarjetas div i {
  font-size: 150px;
  color: black;
}
.tarjetas div p {
  font-family: "Letra";
  font-size: 25px;
  text-decoration: none;
  color: white;
  border: none;
  text-decoration: none;
}
.a{
  margin: 0;
  height: auto;
}

</style>
