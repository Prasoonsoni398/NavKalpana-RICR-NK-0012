import { api } from "../lib/api";



export const dashboardService = {
  getStudentDashboard: async () => {
    const res = await api.get("/dashboard/student");
    return res.data;
  },

  getUserStats: async () => {
    const res = await api.get("/dashboard/student");
    return res.data;
  },

  getLeaderboard: async () => {
    const res = await api.get("/dashboard/student");
    return res.data;
  },

  getUpcomingEvents: async () => {
    const res = await api.get("/dashboard/student");
    return res.data;
  },
  getProfile: async () => {
    const response = await api.get("/dashboard/student");
    return response.data;
  },

  
  getAllAssignments: async () => {
    const response = await api.get("/dashboard/student");
    return response.data; 
  },

  
  getAssignmentById: async (assignmentId: string) => {
    const response = await api.get(`/dashboard/student${assignmentId}`);
    return response.data;
  },

  submitAssignment: async (id: string, formData: any) => {
    const response = await api.post(`/dashboard/student${id}/submit`, formData);
    return response.data;
  },

  
  getCourseDetails: async (courseId: string) => {
    const response = await api.get(`/course-detail/${courseId}`);
    return response.data;
  },

  
  updateProgress: async (courseId: string, lessonId: string) => {
    const response = await api.post(`/course/${courseId}/progress`, { lessonId });
    return response.data;
  },
  getMyCourses: async () => {
    const response = await api.get("/dashboard/student");
    return response.data;
  },
};