'use client';

import React, { useState, useEffect } from 'react';
import { classAPI } from '@/lib/api';
import { Plus, Trash2, Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface StudentsClassSidebarProps {
  selectedClassId: number | null;
  onSelectClass: (id: number | null) => void;
}

export function StudentsClassSidebar({ 
  selectedClassId, 
  onSelectClass 
}: StudentsClassSidebarProps) {
  const [classes, setClasses] = useState<any[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const flash = (kind: 'ok' | 'err', text: string) => {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 4000);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classAPI.list();
      setClasses(response.data);
    } catch {
      flash('err', 'Could not load classrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      await classAPI.create({ name: newClassName });
      setNewClassName('');
      setIsAdding(false);
      flash('ok', 'Class added');
      fetchClasses();
    } catch {
      flash('err', 'Failed to create class');
    }
  };

  const handleDeleteClass = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await classAPI.delete(id);
      if (selectedClassId === id) onSelectClass(null);
      fetchClasses();
      flash('ok', 'Class deleted');
    } catch {
      flash('err', 'Error deleting class');
    }
  };

  return (
    <div className={`relative flex flex-col bg-white border-r border-black transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-full`}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 z-10 bg-white border border-black rounded-full p-1 hover:bg-black hover:text-white transition-all"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className={`p-4 flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
        {notice && (
          <div
            className={`mb-2 w-full text-[10px] font-bold uppercase px-2 py-1 border ${
              notice.kind === 'ok'
                ? 'border-green-600 text-green-800 bg-green-50'
                : 'border-red-600 text-red-800 bg-red-50'
            }`}
          >
            {notice.text}
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-black">Classrooms</h2>}
          <button 
            onClick={() => { setIsCollapsed(false); setIsAdding(!isAdding); }}
            className="p-1 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {isAdding && !isCollapsed && (
          <form onSubmit={handleCreateClass} className="mb-6 space-y-2">
            <input
              autoFocus
              className="w-full p-2 border border-black text-xs outline-none uppercase"
              placeholder="SS1..."
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <button type="submit" className="w-full bg-black text-white text-[10px] py-2 font-bold uppercase">Save</button>
          </form>
        )}

        <div className="flex-1 space-y-1 overflow-y-auto">
          <button
            onClick={() => onSelectClass(null)}
            className={`w-full flex items-center gap-3 p-3 transition-all border ${
              selectedClassId === null 
                ? 'bg-black text-white border-black' 
                : 'bg-transparent text-black border-transparent hover:border-black'
            }`}
          >
            <Users size={16} />
            {!isCollapsed && <span className="text-xs font-bold uppercase">All Students</span>}
          </button>

          {!isCollapsed && <div className="pt-6 pb-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">My Classes</div>}

          {loading ? (
            <Loader2 className="animate-spin text-black mx-auto mt-4" size={16} />
          ) : (
            classes.map((cls) => (
              <div key={cls.id} className="group flex items-center border transition-all relative">
                <button
                  onClick={() => onSelectClass(cls.id)}
                  className={`flex-1 text-left p-3 text-xs truncate uppercase font-bold ${
                    selectedClassId === cls.id ? 'bg-black text-white' : 'text-black hover:bg-gray-50'
                  }`}
                >
                  {isCollapsed ? cls.name.charAt(0) : cls.name}
                </button>
                {!isCollapsed && (
                  <button 
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    className="p-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}