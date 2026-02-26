import { api } from "../lib/api";
import type {
  CreateDoubtRequest,
  DoubtDetail,
  CreateBackupRequest,
  BackupRequestDetail,
} from "@/models/learning-support.model";

class LearningSupportService {
  private baseUrl = "/learning-support";

  // =========================
  // DOUBTS
  // =========================

  async createDoubt(data: CreateDoubtRequest): Promise<DoubtDetail> {
    const response = await api.post(`${this.baseUrl}/doubt`, data);
    return response.data;
  }

  async getMyDoubts(): Promise<DoubtDetail[]> {
    const response = await api.get(`${this.baseUrl}/my-doubts`);
    return response.data;
  }

  async getDoubtById(id: number): Promise<DoubtDetail> {
    const response = await api.get(`${this.baseUrl}/my-backup-requests`);
    return response.data;
  }

  // =========================
  // BACKUP REQUESTS
  // =========================

  async createBackupRequest(
    data: CreateBackupRequest
  ): Promise<BackupRequestDetail> {
    const response = await api.post(`${this.baseUrl}/backup-request`, data);
    return response.data;
  }

  
  // async createBackupRequest(
  //   data: CreateBackupRequest
  // ): Promise<BackupRequestDetail> {
  //   const response = await api.post(`${this.baseUrl}/backup-requests`, data);
  //   return response.data;
  // }
  async getMyBackupRequests(): Promise<BackupRequestDetail[]> {
    const response = await api.get(`${this.baseUrl}/my-backup-requests`);
    return response.data;
  }

  async getBackupRequestById(id: number): Promise<BackupRequestDetail> {
    const response = await api.get(
      `${this.baseUrl}/backup-requests/${id}`
    );
    return response.data;
  }
}

export const learningSupportService = new LearningSupportService();