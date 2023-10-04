import Login from "../components/Login.vue";
import Compras from "../components/Compras.vue";
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path:"/", component:Login},
    {path:"/compras", component:Compras}
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})