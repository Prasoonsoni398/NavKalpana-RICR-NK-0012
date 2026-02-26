import { api } from "../lib/api";

class FileUploadService {
  private baseUrl = "/file-upload"; // change if your backend route is different

  // Upload single file
  async uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(this.baseUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Upload multiple files
  async uploadMultiple(files: File[]): Promise<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post(`${this.baseUrl}/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
}

export const fileUploadService = new FileUploadService();