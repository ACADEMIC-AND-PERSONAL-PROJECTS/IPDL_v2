import axios from "axios";

const API_URL = "http://localhost:8080/api/consultations";

export const getConsultationsByPatient = async (patientId, getAuthHeader) => {
    const response = await axios.get(`${API_URL}/patient/${patientId}`, { headers: getAuthHeader() });
    return response.data;
};

export const createConsultation = async (consultation, getAuthHeader) => {
    const response = await axios.post(API_URL, consultation, { headers: getAuthHeader() });
    return response.data;
};
