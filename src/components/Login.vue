<template>
  <div class="body">
    <div class="contenedor">
      <q-card class="my-card">
        <div id="card-title">
          <h2 class="log">Login</h2>
          <i class="fa-regular fa-circle-user" id="img"></i>
        </div>
        <div class="containerData">
          <q-card-actions vertical align="right" class="texto">
            <q-input color="green" filled v-model="data.Nombre" label="Nombre" >
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
     
           <button @click="Login()">Acpetar</button>
       
        </div>
      </q-card>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import {useVendedorStore } from "../stores/Vendedor"
import { useRouter } from "vue-router";


const router = useRouter()
const data = ref({  
  Nombre: "",
  password: "",
})
const useVendedor = useVendedorStore()
async function Login() {
  console.log(data.value);
  const res = await useVendedor.login(data.value)
  console.log(res);

  if(res !=200){
    console.log("error usuario o contraseña");
    return;
  }

  router.push("./home")
}

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
  background: -webkit-linear-gradient(right, #a6f77b, #2dbd6e);
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
  border-bottom: 3px solid rgb(45,189,110);
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
</style>
