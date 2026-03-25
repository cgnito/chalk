import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Student, StudentUpdate } from "../types";
import  { Button } from "./button";
import  { Input } from "./input";
import  { Modal } from "./modal";


const schema = z.object({
  name: z.string().min(2).optional(),
  grade: z.string().min(1).optional(),
  student_id: z.string().min(2).optional(),
  fee_amount: z.coerce.number().min(1).optional(),
  payment_status: z.enum(["Unpaid", "Partial", "Paid"]).optional(),
});

type EditStudentFormInput = z.input<typeof schema>;
type EditStudentFormOutput = z.output<typeof schema>;

interface Props {
  student: Student | null;
  onClose: () => void;
  onSubmit: (data: StudentUpdate) => Promise<any>;
}

export const EditStudentModal = ({ student, onClose, onSubmit }: Props) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditStudentFormInput, any, EditStudentFormOutput>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (student) reset({ name: student.name, grade: student.grade, student_id: student.student_id, fee_amount: student.fee_amount, payment_status: student.payment_status });
  }, [student, reset]);

  if (!student) return null;

  return (
    <Modal open={!!student} onClose={onClose} title="Edit Student">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Full Name" error={errors.name?.message} {...register("name")} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Grade / Class" error={errors.grade?.message} {...register("grade")} />
          <Input label="Student ID" error={errors.student_id?.message} {...register("student_id")} />
        </div>
        <Input label="School Fee (₦)" type="number" error={errors.fee_amount?.message} {...register("fee_amount")} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Payment Status</label>
          <select
            {...register("payment_status")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};
