<template>
  <q-layout view="hHh lpR fFf" class="bg-accent">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
      class="bg-primary text-white"
    >
    <div class="headerLateral">
        <router-link to="/">
            <q-btn
            align="left"
            class="btn-fixed-width "
            color="secondary"
            label="Home"
            id="btns"
          />
        </router-link>
       
    </div>
      <div class="contenedorLateral">
        <router-link to="/Vendedores">
          <q-btn
            align="left"
            class="btn-fixed-width "
            color="primary"
            label="Vendedores"
            id="btns"
          />
        </router-link>
        <router-link to="/Bus"
          ><q-btn
            align="left"
            class="btn-fixed-width"
            color="primary"
            label="Buses"
            id="btns"
          />
        </router-link>
        <router-link to="/Ruta"
          ><q-btn
            align="left"
            class="btn-fixed-width"
            color="primary"
            label="Rutas"
            id="btns"
          />
        </router-link>
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
.contenedorLateral {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}
#btns {
    width: 100%;
    border-radius: 0;
}
.headerLateral{
    display: flex;
    flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}
</style>
