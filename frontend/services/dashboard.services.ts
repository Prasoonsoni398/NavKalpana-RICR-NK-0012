// services/dashboard.services.ts
import axios from "axios";

export const dashboardService = {
  getStudentDashboard: async (token?: string) => {
    const res = await axios.get("/api/user/student-dashboard", {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
    return res.data;
  },

  getUserStats: async (token?: string) => {
    const res = await axios.get("/api/user/stats", {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
    return res.data;
  },

  getLeaderboard: async (token?: string) => {
    const res = await axios.get("/api/user/leaderboard", {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
    return res.data;
  },

  getUpcomingEvents: async (token?: string) => {
    const res = await axios.get("/api/user/upcoming-events", {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
    return res.data;
  },
};