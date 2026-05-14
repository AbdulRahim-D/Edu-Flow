import React, { useState } from 'react';
import { User, Layers, Hash, ArrowRight, Trash2, Copy, Check } from "lucide-react"; 
import { useNavigate } from 'react-router-dom';
import { useDeleteClassByIdMutation } from "../services/classAPI"; 
import toast from 'react-hot-toast'; // Toaster notification kosam

function ClassCard({ classDetails, isTeacherView }) {
  const navigate = useNavigate();
  const [deleteClass, { isLoading }] = useDeleteClassByIdMutation();
  const [copied, setCopied] = useState(false);

  // Navigate function
  const navigateClassDetails = () => {
    navigate(`/class_assignment/${classDetails._id}`);
  };

  const handleCopyCode = async (e) => {
    e.stopPropagation(); 
    try {
      await navigator.clipboard.writeText(classDetails?.classCode);
      setCopied(true);
      toast.success("Class code copied!");
      
      // 2 seconds tharuvatha malli copy icon ki marcharu
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this class? 🔥");
    if (confirmDelete) {
      try {
        await deleteClass(classDetails._id).unwrap();
        toast.success("Class deleted!");
      } catch (err) {
        toast.error(err.data?.message || "Delete failed!");
      }
    }
  };

  return (
    <div onClick={navigateClassDetails} className="relative group w-full max-w-[320px] cursor-pointer">
      <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-500"></div>
      
      <div className="relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        
        <div className="p-5 pb-0 flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
              Class Record
            </span>
            <h1 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
              {classDetails?.className}
            </h1>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:rotate-6 transition-transform">
               <Layers className="text-indigo-500" size={20} />
            </div>
            
            {isTeacherView && (
              <button 
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="relative flex items-center my-4 px-2">
          <div className="absolute left-0 w-3 h-6 bg-slate-50 rounded-r-full border border-slate-100"></div>
          <div className="w-full border-t border-dashed border-slate-200 mx-4"></div>
          <div className="absolute right-0 w-3 h-6 bg-slate-50 rounded-l-full border border-slate-100"></div>
        </div>

        {/* Content Section */}
        <div className="px-5 pb-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Instructor:</span>
            </div>
            <span className="text-xs font-bold text-slate-700">{classDetails?.teacher?.name}</span>
          </div>

          <div 
            onClick={handleCopyCode}
            className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all group/code"
            title="Click to copy code"
          >
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-slate-400 group-hover/code:text-indigo-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Access Code</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-black text-indigo-600 tracking-widest">
                {classDetails?.classCode}
              </span>
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={13} className="text-slate-300 group-hover/code:text-indigo-400" />}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              {classDetails?.students?.length || 0} Students Enrolled
            </span>
            <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:gap-2 transition-all group/btn">
              Stream View <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassCard;