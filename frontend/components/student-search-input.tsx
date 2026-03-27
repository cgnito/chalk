'use client';

import { useState } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '@/lib/api';

interface StudentSearchInputProps {
  schoolSlug: string;
  onStudentFound: (student: any) => void;
  isLoading: boolean;
}

export function StudentSearchInput({
  schoolSlug,
  onStudentFound,
  isLoading,
}: StudentSearchInputProps) {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const sanitizedId = studentId.trim().toUpperCase();

    if (!sanitizedId) {
      setError('Please enter a Student ID (SID)');
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/public/${schoolSlug}/search/${sanitizedId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Student not found. Please check the Student ID and try again.');
        } else {
          setError('System error. Please contact school administration.');
        }
        setIsSearching(false);
        return;
      }

      const student = await response.json();
      if (student) {
        onStudentFound(student);
      } else {
        setError('No record found for this ID.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID (e.g., STU-001)"
            disabled={isLoading || isSearching}
            className="w-full px-4 py-4 border border-black bg-white text-black placeholder-gray-400 font-bold tracking-tight focus:outline-none transition-all disabled:opacity-50"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              <Search className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Error Message Area */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-start gap-3 p-4 bg-white border border-black">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-mono font-medium text-black uppercase">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={!studentId.trim() || isLoading || isSearching}
          className="w-full px-4 py-4 bg-zinc-900 text-white font-bold hover:bg-white hover:text-black border border-black transition-all duration-200 uppercase text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? 'Accessing Records...' : 'Search'}
        </button>
      </form>
    </div>
  );
}