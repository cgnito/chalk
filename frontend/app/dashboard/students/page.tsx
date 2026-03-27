'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { StudentsTable, StudentRow } from '@/components/students-table';
import { AddStudentModal } from '@/components/add-student-modal';
import { StudentDetailSheet } from '@/components/student-detail-sheet';
import { StudentsClassSidebar } from '@/components/students-class-sidebar';
import { api, classAPI } from '@/lib/api';

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [classes, setClasses] = useState<any[]>([]); 
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/students/'),
        classAPI.list()
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderTitle = () => {
    if (!selectedClassId) return "All Students";
    const currentClass = classes.find(c => c.id === selectedClassId);
    return currentClass ? currentClass.name : "Class View";
  };

  const filteredStudents = selectedClassId 
    ? students.filter((s: any) => s.classroom_id === selectedClassId)
    : students;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* SIDEBAR - Now handles its own white background and collapse */}
      <StudentsClassSidebar 
        selectedClassId={selectedClassId} 
        onSelectClass={setSelectedClassId} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="p-8 border-b border-black flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              {getHeaderTitle()}
            </h1>
            <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {filteredStudents.length} Students Registered
            </p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-black border border-black px-6 py-3 font-bold text-white hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-6 border border-black bg-red-50 p-4 text-red-700 font-bold text-xs uppercase">
              {error}
            </div>
          )}

          <StudentsTable
            students={filteredStudents}
            onRowClick={(s) => { setSelectedStudent(s); setIsDetailSheetOpen(true); }}
            isLoading={isLoading}
          />
        </div>
      </div>

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (data) => {
          await api.post('/students/', { ...data, classroom_id: data.classroom_id || selectedClassId });
          fetchInitialData();
          setIsAddModalOpen(false);
        }}
        initialClassId={selectedClassId} 
      />

      {selectedStudent && (
        <StudentDetailSheet
          isOpen={isDetailSheetOpen}
          onClose={() => setIsDetailSheetOpen(false)}
          student={selectedStudent}
          onDelete={async () => {
             await api.delete(`/student/${selectedStudent.id}`);
             fetchInitialData();
             setIsDetailSheetOpen(false);
          }}
        />
      )}
    </div>
  );
}