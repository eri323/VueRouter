import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useClienteStore = defineStore('cliente', () => {
    const clientes = ref([]);

    const obtenerInfoCliente = async () => {
        try {
            let responseCliente = await axios.get('cliente/clientebusca');
            clientes.value = responseCliente.data.cliente; 
        } catch (error) {
            throw error
        }
    };

    const editarAgregarCliente = async (data) =>{
        try {
            let res = await axios.post("cliente/clientecrear", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarRuta = async (id, data) => {
        try {
            let res = await axios.put(`bus/clientemodificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarRuta = async (id)=>{
        try {
            let r = await axios.put(`cliente/rutainac/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ruta");
        }
    }
    const putActivarRuta = async (id)=>{
        try {
            let r = await axios.put(`cliente/rutaact/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ruta");
        }
    }

    return{
        clientes,
        obtenerInfoCliente, editarAgregarCliente, putEditarRuta, putInactivarRuta, putActivarRuta
    };
});