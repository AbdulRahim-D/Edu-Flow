import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Plus, X, BookOpen, Send, Calendar, Tag } from "lucide-react";
import { socket } from "../socket";

import Loading from "../components/Loading";
import AssignmentCard from "../components/AssignmentCard";
import {
  useCreateAssignmentMutation,
  useGetStudentAssignmentQuery,
  useGetTeacherAssignmentQuery,
} from "../services/taskAPI";
import { assignmentSchema } from "../schema/SchemaValidation";

function ClassAssignment() {
  const { user } = useSelector((state) => state.auth);
  const { id: classId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localClassTasks, setLocalClassTasks] = useState([]);

  const [createAssignment, { isLoading: isCreating }] =
    useCreateAssignmentMutation();

  const { data: studentRes, isLoading: sLoading } =
    useGetStudentAssignmentQuery(undefined, { skip: user?.role !== "Student" });
  const { data: teacherRes, isLoading: tLoading } =
    useGetTeacherAssignmentQuery(undefined, { skip: user?.role !== "Teacher" });

  useEffect(() => {
    const rawData =
      user?.role === "Student" ? studentRes?.data : teacherRes?.data;
    if (rawData) {
      const filtered = rawData.filter((task) => {
        const taskClassId =
          typeof task.classId === "object" ? task.classId._id : task.classId;
        return taskClassId === classId;
      });
      setLocalClassTasks(filtered);
    }
  }, [studentRes, teacherRes, classId, user?.role]);

  useEffect(() => {
    if (!socket || !classId) return;

    socket.emit("join_class", classId);

    const handleNewAssignment = (newAsgn) => {
      
      const asgnClassId =
        typeof newAsgn.classId === "object" ?
          newAsgn.classId._id
        : newAsgn.classId;
      if (asgnClassId === classId.toString()) {

        setLocalClassTasks((prev) => {
          const exists = prev.some((t) => t._id === newAsgn._id);
          if (exists) return prev;
          return [newAsgn, ...prev];
        });
        
      }
    };

    const handleDeleteAssignment = (deletedInfo) => {
      
      setLocalClassTasks((prev) =>
        prev.filter((task) => task.title !== deletedInfo.title && task.description!==deletedInfo.description),
      );
    };

    socket.on("assignment_created", handleNewAssignment);
    socket.on("assignment_deleted", handleDeleteAssignment);

    return () => {
      socket.off("assignment_created", handleNewAssignment);
      socket.off("assignment_deleted", handleDeleteAssignment);
    };
  }, [classId, socket]);

  const assignmentForm = useFormik({
    initialValues: {
      title: "",
      description: "",
      subject: "",
      classId: classId,
      deadline: "",
    },
    validationSchema: assignmentSchema,
    onSubmit: async (values, { resetForm }) => {
      if (values.title.trim().length <= 5) {
        return toast.error("Title must be more than 5 characters!");
      }
      if (values.description.trim().length <= 8) {
        return toast.error("Instructions must be more than 8 characters!");
      }

      try {
        await createAssignment(values).unwrap();
        toast.success("Assignment Published! 🚀");
        resetForm();
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error.data?.message || "Publishing Failed");
      }
    },
  });

  if (sLoading || tLoading) return <Loading />;

  return (
    <div className="p-0 bg-[#FAFAFC] min-h-screen font-['Poppins',sans-serif] text-slate-800 antialiased selection:bg-blue-100">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "#0F172A",
            color: "#F8FAFC",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "500",
          }
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {user.role === "Teacher" ? "Class Submissions" : "My Learning Path"}
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">
            Live stream for Class ID:{" "}
            <span className="text-blue-500 font-semibold font-mono bg-blue-50/50 border border-blue-100/30 px-2 py-0.5 rounded-md text-xs">{classId}</span>
          </p>
        </div>

        {user.role === "Teacher" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {localClassTasks.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {localClassTasks.map((task) => (
            <AssignmentCard
              key={task._id}
              assignment={task}
              isTeacherView={user.role === "Teacher"}
            />
          ))}
        </div>
      : <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200/80 mx-auto w-full">
          <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100 text-slate-300">
            <BookOpen size={32} />
          </div>
          <p className="text-slate-400 font-semibold tracking-wide text-sm text-center px-4">
            No assignments in this stream yet!
          </p>
        </div>
      }

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end transition-all duration-300">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-screen shadow-[0_0_50px_rgba(0,0,0,0.05)] p-8 animate-in slide-in-from-right duration-500 border-l border-slate-100/80 flex flex-col">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Publish Task
                </h3>
                <p className="text-xs font-medium text-slate-400 tracking-wide mt-0.5">
                  Create and dispatch assignment criteria.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={assignmentForm.handleSubmit}
              className="space-y-6 flex-1 overflow-y-auto no-scrollbar pr-1"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-baseline ml-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Topic Title
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Over 5 chars</span>
                </div>
                <input
                  type="text"
                  {...assignmentForm.getFieldProps("title")}
                  className={`w-full px-4 py-3.5 bg-slate-50/50 border rounded-2xl outline-none transition-all duration-200 text-sm font-medium placeholder:text-slate-300 text-slate-900 ${
                    assignmentForm.touched.title && assignmentForm.errors.title ? 
                      "border-red-200 bg-red-50/40 focus:ring-4 focus:ring-red-50" : 
                      "border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                  placeholder="e.g. React Deep Dive"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline ml-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Instructions
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Over 8 chars</span>
                </div>
                <textarea
                  rows="5"
                  {...assignmentForm.getFieldProps("description")}
                  className="w-full p-4 bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400/80 leading-relaxed transition-all resize-none"
                  placeholder="Detail the submission requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Tag size={12} className="text-slate-400" /> Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Others"
                    {...assignmentForm.getFieldProps("subject")}
                    className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl outline-none text-sm font-semibold text-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" /> Due Date
                  </label>
                  <input
                    type="date"
                    {...assignmentForm.getFieldProps("deadline")}
                    className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl outline-none text-sm font-semibold text-slate-600 cursor-pointer transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-blue-100 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    "Syncing..."
                  ) : (
                    <>
                      <Send size={15} /> <span>Publish to Class</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all active:scale-[0.99]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassAssignment;