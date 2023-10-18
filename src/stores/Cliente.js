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

    const postcliente = async (data) =>{
        try {
            let res = await axios.post("cliente/clientecrear", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarCliente = async (id, data) => {
        try {
            let res = await axios.put(`cliente/clientemodificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarCliente = async (id)=>{
        try {
            let r = await axios.put(`cliente/clienteinac/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ruta");
        }
    }
    const putActivarCliente = async (id)=>{
        try {
            let r = await axios.put(`cliente/clienteact/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la ruta");
        }
    }

    return{
        clientes,
        obtenerInfoCliente, postcliente, putEditarCliente, putInactivarCliente, putActivarCliente
    };
});