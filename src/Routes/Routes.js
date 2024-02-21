    import Login from "../components/Login.vue";
    import home from "../components/home.vue";
    import Vendedores from "../components/Vendedores.vue";
    import Bus from "../components/Bus.vue";
    import Ruta from "../components/Ruta.vue";
    import Cliente from "../components/Cliente.vue";
    import Conductores from "../components/Conductores.vue";
    import tickete from "../components/tickete.vue";
    import Venta from "../components/Venta.vue";
    import Main from "../components/Main.vue";

    import { createRouter, createWebHashHistory } from "vue-router";

    // const routes = [
    //   { path: "/", component: Login },

    //   {
    //     path: "/home",
    //     component: home,
    //     children: [
    //       { path: "/", component: "/home"},
    //       { path: "/Vendedores", component: Vendedores },
    //       { path: "/Bus", component: Bus },
    //       { path: "/Ruta", component: Ruta},
    //       { path: "/Cliente", component: Cliente},
    //       { path: "/Conductores", component:Conductores},
    //       { path: "/tickete", component: tickete },
    //       { path: "/Venta", component: Venta }
    //     ],
    //   },
      
    // ];

    const routes = [
      {path: "/",component: Login,},
      {path: "/home",component: home, 
        children: [
          { path: "/", redirect: "/home/main" },
          { path: "/main", component: Main, },
          { path: "/Vendedores", component: Vendedores,},
          { path: "/Bus", component: Bus,},
          { path: "/Cliente", component: Cliente,},
          { path: "/Conductores", component: Conductores,},
          { path: "/Ruta", component: Ruta},
          { path: "/Venta", component: Venta,},
          { path: "/tickete", component: tickete}
        ],
      }
  ]

    export const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });
