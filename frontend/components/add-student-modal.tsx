'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { classAPI } from '@/lib/api';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialClassId?: number | null;
}

interface FormState {
  name: string;
  student_id: string;
  fee_amount: string;
  classroom_id: string;
  grade: string;
}

export function AddStudentModal({ isOpen, onClose, onSubmit, initialClassId }: AddStudentModalProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    student_id: '',
    fee_amount: '',
    classroom_id: '',
    grade: '',
  });
  
  const [classes, setClasses] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      const fetchClasses = async () => {
        try {
          const response = await classAPI.list();
          setClasses(response.data);
        } catch {
          setError('Could not load classrooms.');
        }
      };
      fetchClasses();

      setFormData(prev => ({
        ...prev,
        classroom_id: initialClassId ? initialClassId.toString() : ''
      }));
    }
  }, [isOpen, initialClassId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.student_id || !formData.fee_amount) {
      setError('Required fields are missing');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedClass = classes.find(c => c.id.toString() === formData.classroom_id);
      
      await onSubmit({
        ...formData,
        grade: selectedClass ? selectedClass.name : "Unassigned",
        fee_amount: parseFloat(formData.fee_amount),
        classroom_id: formData.classroom_id ? parseInt(formData.classroom_id) : null,
      });

      setFormData({ name: '', student_id: '', fee_amount: '', classroom_id: '', grade: '' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-6 flex items-center justify-between border-b-2 border-black pb-4">
                <h2 className="text-2xl font-black uppercase italic">Add Student</h2>
                <button onClick={onClose} className="p-1 hover:bg-black hover:text-white border border-black transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Classroom</label>
                  <select name="classroom_id" value={formData.classroom_id} onChange={handleChange} className="w-full border-2 border-black px-3 py-2 text-sm outline-none bg-white">
                    <option value="">Unassigned</option>
                    {classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-black px-3 py-2 text-sm outline-none" placeholder="Olamide John" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">SID</label>
                    <input name="student_id" value={formData.student_id} onChange={handleChange} className="w-full border-2 border-black px-3 py-2 text-sm font-mono outline-none" placeholder="STU-001" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Fee (₦)</label>
                    <input type="number" name="fee_amount" value={formData.fee_amount} onChange={handleChange} className="w-full border-2 border-black px-3 py-2 text-sm outline-none" placeholder="50000" />
                  </div>
                </div>

                {error && <div className="border-2 border-black bg-red-50 p-3 text-xs font-bold text-red-700 uppercase">{error}</div>}

                <button disabled={isSubmitting} type="submit" className="w-full border-2 border-black bg-black text-white font-black py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-all flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create Profile"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}