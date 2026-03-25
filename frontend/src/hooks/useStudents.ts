import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { studentsApi } from "../api/students";
import type { Student, StudentCreate, StudentUpdate } from "../types";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const addStudent = async (data: StudentCreate) => {
    try {
      const newStudent = await studentsApi.create(data);
      setStudents((prev) => [...prev, newStudent]);
      toast.success(`${newStudent.name} added successfully!`);
      return newStudent;
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to add student");
      throw err;
    }
  };

  const updateStudent = async (id: number, data: StudentUpdate) => {
    try {
      const updated = await studentsApi.update(id, data);
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Student updated!");
      return updated;
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Update failed");
      throw err;
    }
  };

  const removeStudent = async (id: number) => {
    try {
      await studentsApi.delete(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success("Student removed");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  const stats = {
    total: students.length,
    paid: students.filter((s) => s.payment_status === "Paid").length,
    partial: students.filter((s) => s.payment_status === "Partial").length,
    unpaid: students.filter((s) => s.payment_status === "Unpaid").length,
    totalRevenue: students
      .filter((s) => s.payment_status === "Paid")
      .reduce((acc, s) => acc + s.fee_amount, 0),
  };

  return { students, loading, addStudent, updateStudent, removeStudent, refetch: fetchStudents, stats };
};