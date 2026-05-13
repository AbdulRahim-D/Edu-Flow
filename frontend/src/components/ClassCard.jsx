import React from 'react';
import { User, Layers, Hash, ArrowRight, Trash2 } from "lucide-react"; 
import { useNavigate } from 'react-router-dom';
import { useDeleteClassByIdMutation } from "../services/classAPI"; 
import Swal from 'sweetalert2'; 

function ClassCard({ classDetails, isTeacherView }) {
  const navigate = useNavigate();
  const [deleteClass, { isLoading }] = useDeleteClassByIdMutation();

  function navigateClassDetails() {
    navigate(`/class_assignment/${classDetails._id}`);
  }

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("Are you sure you want to delete this class?");
    if (confirmDelete) {
      try {
        await deleteClass(classDetails._id).unwrap();
        alert("Class deleted successfully!");
      } catch (err) {
        alert("Failed to delete class: " + err.data?.message);
      }
    }
  };

  return (
    <div onClick={navigateClassDetails} className="relative group w-full max-w-[320px] cursor-pointer">
      <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-300"></div>
      
      <div className="relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        
        <div className="p-5 pb-0 flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
              Class Record
            </span>
            <h1 className="text-xl font-black text-slate-800 leading-tight">
              {classDetails?.className}
            </h1>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
               <Layers className="text-blue-500" size={20} />
            </div>
            
       
            {isTeacherView && (
              <button 
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                title="Delete Class"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="relative flex items-center my-4">
          <div className="absolute -left-2 w-4 h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner"></div>
          <div className="w-full border-t border-dashed border-slate-200 mx-4"></div>
          <div className="absolute -right-2 w-4 h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner"></div>
        </div>

        <div className="px-5 pb-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Instructor:</span>
            </div>
            <span className="text-xs font-bold text-slate-700">{classDetails?.teacher?.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Code:</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">
              {classDetails?.classCode}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium italic">
              {classDetails?.students?.length} Students Enrolled
            </span>
            <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:gap-2 transition-all">
              Go to Class <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassCard;