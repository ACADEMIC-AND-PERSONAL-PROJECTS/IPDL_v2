import api from "./api";

export const analyticsService = {
  getResume: () =>
    api.get("/api/analytics/resume").then((r) => r.data),
};
