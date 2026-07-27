import axios from "axios";

const API_URL = "http://localhost:8080/api/patients";

export const getAllPatients = async (getAuthHeader) => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
};

export const getPatientById = async (id, getAuthHeader) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
};

export const createPatient = async (patient, getAuthHeader) => {
    const response = await axios.post(API_URL, patient, { headers: getAuthHeader() });
    return response.data;
};
