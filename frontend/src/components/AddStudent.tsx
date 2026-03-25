import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { StudentCreate } from "../types";
import { Button } from "./button";
import { Input } from "./input";
import { Modal } from "./modal";


const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  grade: z.string().min(1, "Grade is required"),
  student_id: z.string().min(1, "Student ID is required"),
  fee_amount: z.coerce.number().min(1, "Fee amount must be greater than 0"),
});

type AddStudentFormInput = z.input<typeof schema>;
type AddStudentFormOutput = z.output<typeof schema>;

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentCreate) => Promise<unknown>;
}

export const AddStudentModal = ({ open, onClose, onSubmit }: AddStudentModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddStudentFormInput, any, AddStudentFormOutput>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onValid = async (data: AddStudentFormOutput) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New Student">
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Amara Okafor"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Grade / Class"
          placeholder="e.g. JSS 2A"
          error={errors.grade?.message}
          {...register("grade")}
        />
        <Input
          label="Student ID"
          placeholder="e.g. STU-2-001"
          error={errors.student_id?.message}
          {...register("student_id")}
        />
        <Input
          label="Fee Amount (₦)"
          type="number"
          placeholder="e.g. 75000"
          error={errors.fee_amount?.message}
          {...register("fee_amount")}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isSubmitting}>
            Add Student
          </Button>
        </div>
      </form>
    </Modal>
  );
};
