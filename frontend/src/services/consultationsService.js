import api from "./api";

export const consultationService = {
  create: (data) =>
    api.post("/api/consultations", data).then((r) => r.data),

  findByPatient: (patientId) =>
    api.get(`/api/consultations/patient/${patientId}`).then((r) => r.data),

  findMines: () =>
    api.get("/api/consultations/mes-consultations").then((r) => r.data),

  cloturer: (id, notes) =>
    api.patch(`/api/consultations/${id}/cloturer`, null, { params: { notes } }).then((r) => r.data),
};
