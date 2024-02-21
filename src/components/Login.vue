<template>
  <div class="body">
    <div class="contenedor">
      <q-card class="my-card">
        <div id="card-title">
          <h2 class="log">Login</h2>
          <i class="fa-regular fa-circle-user" id="img"></i>
        </div>
        <div class="containerData" v-if="MostrarData">
          <q-card-actions vertical align="right" class="texto">
            <q-input color="green" filled v-model="data.Nombre" label="Nombre">
              <template v-slot:prepend>
                <i class="fa-solid fa-user-lock"></i>
              </template>
            </q-input>

            <q-input color="green" filled v-model="data.password" label="Contraseña" type="password">
              <template v-slot:prepend>
                <i class="fa-solid fa-file-signature"></i>
              </template>
            </q-input>
          </q-card-actions>


        </div>
        <div class="containerError" v-if="mostrarError">
          <h4>Por favor digite el Nombre o Contraseña</h4>
        </div>
        <div class="containerError" v-if="error2">
          <h4>{{ msj }}</h4>
        </div>
        <button @click="Login()" class="btn">Aceptar</button>
      </q-card>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useVendedorStore } from "../stores/Vendedor";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();

let mostrarError = ref(false);
let MostrarData = ref(true);
let error2 = ref(false);
let error = ref("melo");
let msj=ref("");
const router = useRouter();
const data = ref({
  Nombre: "",
  password: "",
});
const useVendedor = useVendedorStore();

async function Login() {

  if (data.value.Nombre == "" && data.value.password == "") {
    mostrarError.value = true;
    setTimeout(() => {
      mostrarError.value = false;
    }, 2200);
    // showBad();
    return
  } else {
    try {
      showDefault();
      const res = await useVendedor.login(data.value);
      console.log(res);
      if(notification){
        notification();
      }
      if (res != 200) {
        error2.value = true;
        msj.value=res.msg
        setTimeout(() => {
          error2.value = false;
        }, 2200);
        
      } else {
        router.push("./main");
      }


    } catch (error) {
      console.error("Error in login:", error);
    }
  }
  console.log(data.value);

}
/* function validar(){
  let validation = true;
  if(data.Nombre.value.trim() == ""){
    error.value="paila"
    validation = false
  }
 
  return validation
} */

let notification = ref()
let greatMessage = ref("");
let badMessage = ref("");

const showGreat = () => {
  notification = $q.notify({
    spinner: false,
    message: greatMessage,
    timeout: 2000,
    type: "positive",
  });
};

const showBad = () => {
  notification = $q.notify({
    spinner: false,
    message: badMessage,
    timeout: 2000,
    type: "negative",
  });
};
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

</script>
<style scoped>
.body {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/fondo.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  font-family: "Letra";
}

@font-face {
  font-family: "Letra";
  src: url("../fonts/Anta-Regular.ttf");
}

.contenedor {
  display: flex;
  background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
  background-repeat: no-repeat;
  align-items: center;
  justify-content: center;
  border-radius: 4%;
  padding: 2%;
}

.my-card {
  align-items: center;
  padding: 10px 84px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
}

.texto {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.bg-teal text-white {
  background-color: transparent;
}

#card-title {
  font-family: "Raleway Thin", sans-serif;
  letter-spacing: 4px;
  padding-bottom: 23px;
  padding-top: 13px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

#submit-btn {
  background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
  border: none;
  border-radius: 10px;

  cursor: pointer;
  color: white;
  font-family: "Raleway SemiBold", sans-serif;

  margin: 0;
  font-family: "Letra";
  transition: 0.25s;
}

.log {
  border-bottom: 3px solid rgb(45, 189, 110);
  margin: 0;
  padding: 0;
  width: 95px;
  display: flex;
  justify-content: center;
  font-family: "Letra";
  padding: 8px;
}

#submit-btn:hover {
  box-shadow: 0px 1px 10px #24c64f;
}

.containerData {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

#input {
  display: flex;
  text-align: center;
}

#img {
  font-size: 200px;
}

.btn {
  width: 100px;
  font-size: 18px;
  border-radius: 5px;
  border: none;
  padding: 10px;
  cursor: pointer;
  background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
}

.btn:hover {
  transition: ease-in-out 0.5s;
  transform: scale(1.1);
}

.containerError {
  background-color: rgba(255, 0, 0, 0.36);
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 8px;
  border: 3px solid red;
  margin-bottom: 15px;
}

.containerError h4 {
  font-size: 15px;
  margin: 0;
}
</style>
