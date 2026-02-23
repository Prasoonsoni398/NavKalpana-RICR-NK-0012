import { api } from "@/lib/api"; 

export const studentService = {
 
  getProfile: async () => {
    const response = await api.get("/student/profile");
    return response.data;
  },

  
  getAllAssignments: async () => {
    const response = await api.get("/assignments");
    return response.data; 
  },

  
  getAssignmentById: async (assignmentId: string) => {
    const response = await api.get(`/assignments/my-assignment/${assignmentId}`);
    return response.data;
  },

  submitAssignment: async (id: string, formData: any) => {
    const response = await api.post(`/assignments/${id}/submit`, formData);
    return response.data;
  },

  
  getCourseDetails: async (courseId: string) => {
    const response = await api.get(`/course-detail/${courseId}`);
    return response.data;
  },

  
  updateProgress: async (courseId: string, lessonId: string) => {
    const response = await api.post(`/course/${courseId}/progress`, { lessonId });
    return response.data;
  }
};