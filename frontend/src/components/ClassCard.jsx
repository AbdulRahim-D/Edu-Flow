import React, { useState } from 'react';
import { User, Layers, Hash, ArrowRight, Trash2, Copy, Check } from "lucide-react"; 
import { useNavigate } from 'react-router-dom';
import { useDeleteClassByIdMutation } from "../services/classAPI"; 
import toast from 'react-hot-toast';

function ClassCard({ classDetails, isTeacherView }) {
  const navigate = useNavigate();
  const [deleteClass, { isLoading }] = useDeleteClassByIdMutation();
  const [copied, setCopied] = useState(false);

  const navigateClassDetails = () => {
    navigate(`/class_assignment/${classDetails._id}`);
  };

  const handleCopyCode = async (e) => {
    e.stopPropagation(); 
    try {
      await navigator.clipboard.writeText(classDetails?.classCode);
      setCopied(true);
      toast.success("Class code copied!");
      
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
    <div onClick={navigateClassDetails} className="relative group w-full max-w-[320px] cursor-pointer font-['Poppins',sans-serif] text-slate-800 antialiased">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
      
      <div className="relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(59,130,246,0.04)] hover:border-blue-500/10 transition-all duration-300">
        
        <div className="p-5 pb-0 flex justify-between items-start gap-3">
          <div className="space-y-1.5 min-w-0">
            <span className="inline-block text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50/60 border border-blue-100/30 px-2.5 py-0.5 rounded-md">
              Class Record
            </span>
            <h1 className="text-lg font-bold text-slate-900 leading-snug truncate group-hover:text-blue-500 transition-colors">
              {classDetails?.className}
            </h1>
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isTeacherView && (
              <button 
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            )}

            <div className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50/50 group-hover:border-blue-100/30">
               <Layers size={16} />
            </div>
          </div>
        </div>

        <div className="relative flex items-center my-3.5 px-1">
          <div className="absolute left-0 w-2 h-4 bg-[#FAFAFC] rounded-r-full border-r border-y border-slate-100"></div>
          <div className="w-full border-t border-dashed border-slate-200/80 mx-4"></div>
          <div className="absolute right-0 w-2 h-4 bg-[#FAFAFC] rounded-l-full border-l border-y border-slate-100"></div>
        </div>

        <div className="px-5 pb-5 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5">
              <User size={13} className="text-slate-300" />
              <span className="font-medium text-slate-400">Instructor</span>
            </div>
            <span className="font-semibold text-slate-700 truncate max-w-[150px]">{classDetails?.teacher?.name}</span>
          </div>

          <div 
            onClick={handleCopyCode}
            className="flex justify-between items-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-100/80 hover:bg-blue-50/40 hover:border-blue-500/20 transition-all group/code"
            title="Click to copy code"
          >
            <div className="flex items-center gap-1.5">
              <Hash size={13} className="text-slate-300 group-hover/code:text-blue-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Access Code</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200/40 shadow-xs">
              <span className="text-xs font-mono font-bold text-blue-500 tracking-wider">
                {classDetails?.classCode}
              </span>
              {copied ? (
                <Check size={12} className="text-emerald-500" />
              ) : (
                <Copy size={11} className="text-slate-300 group-hover/code:text-blue-400 transition-colors" />
              )}
            </div>
          </div>

          <div className="mt-2 pt-3.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium tracking-wide">
              {classDetails?.students?.length || 0} Students Enrolled
            </span>
            <button className="flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-600 transition-all group/btn">
              <span>Stream View</span> 
              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassCard;