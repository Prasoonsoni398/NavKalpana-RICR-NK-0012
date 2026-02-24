// services/dashboard.services.ts
import axios from "axios";

export const dashboardService = {
  getUserStats: async () => {
    const res = await axios.get("/api/user/stats");
    return res.data;
  },
  
  getLeaderboard: async () => {
    const res = await axios.get("/api/user/leaderboard");
    return res.data;
  },

  getUpcomingEvents: async () => {
    const res = await axios.get("/api/user/upcoming-events");
    return res.data;
  }
};
