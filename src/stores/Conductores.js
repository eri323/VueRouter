import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useConductorStore = defineStore('conductor', () => {
    const conductores = ref([]);

    const obtenerInfoConductor = async () => {
        try {
            let responseConductor = await axios.get('conductor/conductorbusca');
            conductores.value = responseConductor.data.conductor; 
        } catch (error) {
            throw error
        }
    };

    const postconductor = async (data) =>{
        try {
            let res = await axios.post("conductor/conductorcrear", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarConductor = async (id, data) => {
        try {
            let res = await axios.put(`conductor/conductormodificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarConductor = async (id)=>{
        try {
            let r = await axios.put(`conductor/conductorinac/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado el conductor");
        }
    }
    const putActivarConductor = async (id)=>{
        try {
            let r = await axios.put(`conductor/conductoract/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado el conductor");
        }
    }

    return{
        conductores,
        obtenerInfoConductor, postconductor, putEditarConductor, putInactivarConductor, putActivarConductor
    };
});