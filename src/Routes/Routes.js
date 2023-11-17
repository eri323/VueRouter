import Login from "../components/Login.vue";
import home from "../components/home.vue";
import Vendedores from "../components/Vendedores.vue";
import Bus from "../components/Bus.vue";
import Ruta from "../components/Ruta.vue";
import Cliente from "../components/Cliente.vue";
import Conductores from "../components/Conductores.vue";
import Tickete from "../components/Tickete.vue";
import Venta from "../components/Venta.vue";
import Main from "../components/Main.vue"

import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Login },

  {
    path: "/home",
    component: home,
    children: [
      { path: "/", component: "/home/main"},
      { path: "/Vendedores", component: Vendedores },
      { path: "/Bus", component: Bus },
      { path: "/Ruta", component: Ruta},
      { path: "/Cliente", component: Cliente},
      { path: "/Conductores", component:Conductores},
      { path: "/Tickete", component: Tickete },
      { path: "/Venta", component: Venta }
    ],
  },
  
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
