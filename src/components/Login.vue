<template>
    <div>
        <q-card class="my-card">
            <q-card-section class="superior">
                <div class="text-h6">Login</div>
            </q-card-section>
            <q-card-actions vertical align="right" class="texto">
                <input type="text" placeholder="Nombre">
                <input type="text" placeholder="Contraseña">
                <q-btn flat>Aceptar</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<style>
body{
background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
  background-repeat: no-repeat;
}
.my-card{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    padding: 12px 44px;
}
.texto{
    display: flex;
    align-items: center;
}
.bg-teal text-white{
    background-color: transparent;
}
</style>