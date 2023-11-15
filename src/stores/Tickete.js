import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useTicketStore = defineStore('ticket', () => {
    const ticketes = ref([]);

    const obtenerInfoTicket = async () => {
        try {
            let responseTicket = await axios.get('pasaje/pasajebusca');
            ticketes.value = responseTicket.data.pasaje;
        } catch (error) {
            throw error
        }
    };

    const postticket = async (data) => {
        try {
            let res = await axios.post("pasaje/pasajecrear", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarTicket = async (id, data) => {
        try {
            let res = await axios.put(`pasaje/pasajemodificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarTicket = async (id) => {
        try {
            let r = await axios.put(`pasaje/pasajeinac/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de el pasaje");
        }
    }
    const putActivarTicket = async (id) => {
        try {
            let r = await axios.put(`pasaje/pasajeact/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de el Ticket");
        }
    }
   

    return {
        ticketes,
        obtenerInfoTicket,  postticket, putEditarTicket, putInactivarTicket, putActivarTicket
    };
});

