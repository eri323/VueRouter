<template>
  <q-layout view="hHh lpR fFf" class="body">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <i class="fa-solid fa-bus" ></i>
          </q-avatar>
          Transporte
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
      id="lateral"
      class="bg-primary"
    >
<div class="perfil">
  <div class="perfilAvatar">
    <i class="fa-regular fa-circle-user" id="img"></i>
  </div>
</div>
    
    <div class="btns">
      <router-link to="/Vendedores">
      
        <button>
          <i class="fa-solid fa-clipboard-user"></i>
         
          Vendedores
        </button>
      </router-link>
      <router-link to="/Bus">
       <button>
        <i class="fa-solid fa-bus-simple"></i>
        buses
       </button>
      </router-link>
      <router-link to="/Ruta">
       <button>
        <i class="fa-solid fa-road"></i>
        Rutas
       </button></router-link>
      <router-link to="/Cliente">
        <button>
          <i class="fa-solid fa-user-tie"></i>
          clientes
        </button></router-link>
    </div>
      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style scoped>
.body{
  background-image: url("../assets/fondo.jpg");
  background-attachment: fixed;
  background-size: cover;
}
#lateral {
  display: flex;
  flex-direction: column;
}
#img{
font-size: 150px;
}
.perfilAvatar{
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
.perfil{
  display: flex;
  justify-content: center;
  padding: 15px;
}
.btns{
  display: flex;
  flex-direction: column;

}
.btns button{
  border: none;
  font-family: "Letra";
  width: 100%;
  text-align: left;
  padding: 15px;
  font-size: 20px;
  text-transform: capitalize;
 cursor: pointer;
}
.btns button:hover{
  background-color: rgb(213, 216, 220);
  transition: ease-in-out 0.5s;
}
@font-face {
  font-family: "Letra";
  src: url("../fonts/Anta-Regular.ttf");
}
</style>
