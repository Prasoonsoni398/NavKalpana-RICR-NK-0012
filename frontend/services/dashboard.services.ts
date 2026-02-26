import { api } from "../lib/api";



export const dashboardService = {
  getStudentDashboard: async () => {
    const res = await api.get("/user/student-dashboard");
    return res.data;
  },

  getUserStats: async () => {
    const res = await api.get("/user/stats");
    return res.data;
  },

  getLeaderboard: async () => {
    const res = await api.get("/user/leaderboard");
    return res.data;
  },

  getUpcomingEvents: async () => {
    const res = await api.get("/user/upcoming-events");
    return res.data;
  },
};