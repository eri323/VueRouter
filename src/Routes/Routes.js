import Login from "../components/Login.vue";
import Home from "../components/home.vue"
import Vendedores from "../components/Vendedores.vue";
import Bus from "../components/Bus.vue"
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path:"/", component:Login},
    { path: "/Vendedores", component:Vendedores },
    { path: "/Bus", component: Bus },
    { path: "/Home", component: Home }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})