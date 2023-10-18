import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Vendedores from "../components/Vendedores.vue";
import Bus from "../components/Bus.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Login },

  {
    path: "/Home",
    component: Home,
    children: [
      { path: "/Vendedores", component: Vendedores },
      { path: "/Bus", component: Bus }
    ],
  },
  
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
