import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useVendedorStore = defineStore('vendedor', () => {
    const vendedores = ref([]);

    const obtenerInfoVendedor = async () => {
        try {
            let responseVendedor = await axios.get('vendedor/vendedorbusca');
            vendedores.value = responseVendedor.data.vendedor;
        } catch (error) {
            throw error
        }
    };

    const postvendedor = async (data) => {
        try {
            let res = await axios.post("vendedor/vendedorcrear", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarVendedor = async (id, data) => {
        try {
            let res = await axios.put(`vendedor/vendedormodifica/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarVendedor = async (id) => {
        try {
            let r = await axios.put(`vendedor/vendedorinac/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de el vendedor");
        }
    }
    const putActivarVendedor = async (id) => {
        try {
            let r = await axios.put(`vendedor/vendedoract/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de el vendedor");
        }
    }
    const vendedor = ref([])
    const login = async (data) => {
        try {
        
            let r = await axios.post(`vendedor/login`, data)
            console.log(r);
            vendedor.value=r.data.vendedor
            return r.status
        } catch (error) {
            console.log(error);
            return error.response.data
        }
    }

    return {
        vendedores, vendedor,
        obtenerInfoVendedor, login, postvendedor, putEditarVendedor, putInactivarVendedor, putActivarVendedor
    };
});

