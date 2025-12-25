import apiClient from '../api/apiClients';

const petService = {
    getAllPets: async () => {
        const response = await apiClient.get('/pets/');
        return response.data;
    },

    getPetById: async (petId) => {
        const response = await apiClient.get(`/pets/${petId}/`);
        return response.data;
    },

    createPet: async (petData) => {
        const response = await apiClient.post('/pets/', petData);
        return response.data;
    },

    updatePet: async (petId, petData) => {
        const response = await apiClient.put(`/pets/${petId}/`, petData);
        return response.data;
    },

    deletePet: async (petId) => {
        const response = await apiClient.delete(`/pets/${petId}/`);
        return response.data;
    },

    searchPets: async (query) => {
        const response = await apiClient.get(`/pets/search/?q=${query}`);
        return response.data;
    }
};

export { petService };
export default petService;