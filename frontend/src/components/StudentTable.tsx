import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pencil, Trash2, Search, ChevronUp, 
  ChevronDown, UserPlus, FilterX 
} from "lucide-react";
import type { Student, StudentUpdate } from "../types";
import { formatNaira } from "../utils/formatters";
import { StatusBadge } from "./badge";
import { Button } from "./button";
import { Input } from "./input";
import { EditStudentModal } from "./EditStudentModal";

interface Props {
  students: Student[];
  onUpdate: (id: number, data: StudentUpdate) => Promise<any>;
  onDelete: (id: number) => void;
}

type SortKey = "name" | "grade" | "fee_amount" | "payment_status";

export const StudentTable = ({ students, onUpdate, onDelete }: Props) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = useMemo(() => {
    return students
      .filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.student_id.toLowerCase().includes(search.toLowerCase()) ||
        s.grade.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const va = a[sortKey]; const vb = b[sortKey];
        if (va < vb) return sortAsc ? -1 : 1;
        if (va > vb) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [students, search, sortKey, sortAsc]);

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      <div className="bg-sky-500/20 p-0.5 rounded">
        {sortAsc ? <ChevronUp className="w-3 h-3 text-sky-400" /> : <ChevronDown className="w-3 h-3 text-sky-400" />}
      </div>
    ) : <ChevronUp className="w-3 h-3 opacity-20" />;

  const ColHeader = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 cursor-pointer hover:text-white transition-colors select-none"
      onClick={() => toggleSort(col)}
    >
      <div className="flex items-center gap-2">
        {label} <SortIcon col={col} />
      </div>
    </th>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 pt-4">
        <Input
          placeholder="Search records by name, student ID, or grade level..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-500" />}
          className="bg-black/20 border-white/5 focus:border-sky-500/50 transition-all"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-white/[0.02]">
              <ColHeader col="name" label="Student Profile" />
              <ColHeader col="grade" label="Grade" />
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Reg. ID</th>
              <ColHeader col="fee_amount" label="Tuition" />
              <ColHeader col="payment_status" label="Status" />
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={6} className="px-6 py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        {search ? <FilterX className="w-8 h-8 text-slate-600" /> : <UserPlus className="w-8 h-8 text-slate-600" />}
                      </div>
                      <h3 className="text-white font-bold text-lg">
                        {search ? "No matches found" : "No students enrolled"}
                      </h3>
                      <p className="text-slate-500 text-sm max-w-[280px] mt-1">
                        {search 
                          ? `We couldn't find anything for "${search}". Try a different term.` 
                          : "Your student directory is currently empty. Start by adding your first student."}
                      </p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                filtered.map((student, i) => (
                  <motion.tr
                    key={student.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="group hover:bg-white/[0.04] transition-all relative"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center text-sky-400 font-black text-sm border border-sky-500/20 group-hover:scale-110 transition-transform">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{student.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Active Enrollment</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 font-medium">{student.grade}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[11px] bg-white/5 border border-white/5 px-2 py-1 rounded-md text-slate-400 font-mono">
                        {student.student_id}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white font-bold tabular-nums">
                        {formatNaira(student.fee_amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.payment_status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all justify-end translate-x-2 group-hover:translate-x-0">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 hover:bg-sky-500/10 hover:text-sky-400"
                          onClick={() => setEditStudent(student)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="h-9 w-9 p-0 bg-transparent hover:bg-rose-500/10 text-rose-500 border-none"
                          onClick={() => onDelete(student.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 flex justify-between items-center border-t border-white/5">
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
          End of directory
        </p>
        <p className="text-xs text-slate-500">
          Showing <span className="text-white font-bold">{filtered.length}</span> of <span className="text-white font-bold">{students.length}</span> students
        </p>
      </div>

      <EditStudentModal
        student={editStudent}
        onClose={() => setEditStudent(null)}
        onSubmit={async (data) => {
          if (editStudent) await onUpdate(editStudent.id, data);
          setEditStudent(null);
        }}
      />
    </div>
  );
};