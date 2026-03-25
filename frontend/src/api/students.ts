import { apiClient } from "./client";
import type { Student, StudentCreate, StudentUpdate } from "../types";

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const res = await apiClient.get<Student[]>("/students/");
    return res.data;
  },

  create: async (data: StudentCreate): Promise<Student> => {
    const res = await apiClient.post<Student>("/students/", data);
    return res.data;
  },

  update: async (id: number, data: StudentUpdate): Promise<Student> => {
    const res = await apiClient.patch<Student>(`/students/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/student/${id}`);
  },

  // Public - no auth needed
  publicSearch: async (schoolSlug: string, studentId: string): Promise<Student> => {
    const res = await apiClient.get<Student>(
      `/public/${schoolSlug}/search/${studentId}`
    );
    return res.data;
  },
};