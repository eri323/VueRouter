<template>
    <div class="body">
        <q-card class="my-card">
            <div id="card-title">
        <h2>LOGIN</h2>
        <div class="underline-title"></div>
      </div>
            <q-card-actions vertical align="right" class="texto">
                <q-input type="text" label="Nombre"/>
                <q-input type="text" label="Contraseña"/>
                <router-link to="/Home">
                    <q-btn flat id="submit-btn">Aceptar</q-btn>
                </router-link>
            </q-card-actions>
        </q-card>
    </div>
</template>

<style scoped>
.body{
height: 100vh;
background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
background-repeat: no-repeat;
display: flex;
justify-content: center;
align-items: center;
}
.my-card{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 80px;
    border-radius: 18px;
}
.texto{
    display: flex;
    gap: 15px;
    align-items: center;
}
.bg-teal text-white{
    background-color: transparent;
}
h2{
    font-size: 40px;
    margin: 0;
    padding-bottom: 9px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.underline-title {
  background: -webkit-linear-gradient(right, #a6f77b, #2ec06f);
  height: 3px;
  margin: -1.1rem auto 0 auto;
  width: 89px;
}
#card-title {
  font-family: "Raleway Thin", sans-serif;
  letter-spacing: 4px;
  padding-bottom: 23px;
  padding-top: 13px;
  text-align: center;
}
#submit-btn {
  background: -webkit-linear-gradient(right, #a6f77b, #2dbd6e);
  border: none;
  border-radius: 21px;
  box-shadow: 0px 1px 8px #24c64f;
  cursor: pointer;
  color: white;
  font-family: "Raleway SemiBold", sans-serif;
  height: 42.3px;
  margin: 0 auto;
  margin-top: 50px;
  transition: 0.25s;
  width: 153px;
}
#submit-btn:hover {
  box-shadow: 0px 1px 18px #24c64f;
}
</style>