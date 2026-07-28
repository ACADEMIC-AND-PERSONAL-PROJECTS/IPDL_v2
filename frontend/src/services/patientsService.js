import api from "./api";

export const patientService = {
  findAll: () =>
    api.get("/api/patients").then((r) => r.data),

  findById: (id) =>
    api.get(`/api/patients/${id}`).then((r) => r.data),

  create: (data) =>
    api.post("/api/patients", data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/api/patients/${id}`, data).then((r) => r.data),

  search: (nom) =>
    api.get(`/api/patients/search?nom=${nom}`).then((r) => r.data),
};
