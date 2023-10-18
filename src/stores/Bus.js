import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useBusStore = defineStore('bus', () => {
    const buses = ref([]);
    const conductores = ref([])
    const obtenerInfoBuses = async () => {
        try {
            let responseBuses = await axios.get('transporte/transbusca');
            buses.value = responseBuses.data.transporte;
            conductores.value = responseBuses.data.transporte.conductor_id.nombre
            console.log(responseBuses);
        } catch (error) {
            throw error
        }
    };

    const postBus = async (data) => {
        try {
            let res = await axios.post("transporte/transcrear", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarBus = async (id, data) => {
        try {
            let res = await axios.put(`transporte/transbuscaid/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarBus = async (id) => {
        try {
            let r = await axios.put(`transporte/transporteinac/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }
    const putActivarBus = async (id) => {
        try {
            let r = await axios.put(`transporte/transporteact/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }

    return {
        buses,conductores,
        obtenerInfoBuses, postBus, putEditarBus, putInactivarBus, putActivarBus
    };
});