import Login from "../components/Login.vue";

import TablaQuasar from "../components/TablaQuasar.vue";
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {path:"/", component:Login},
    { path: "/TablaQuasar", component:TablaQuasar }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})