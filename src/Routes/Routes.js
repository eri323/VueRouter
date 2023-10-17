import Login from "../components/Login.vue";

import Vendedores from "../components/Vendedores.vue";
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path:"/", component:Login},
    { path: "/Vendedores", component:Vendedores }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})