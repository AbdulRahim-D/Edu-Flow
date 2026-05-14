import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Plus, X, BookOpen, Send } from "lucide-react";
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
      console.log(newAsgn);
      
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
      console.log(deletedInfo);
      
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
    <div className="p-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 decoration-8 underline-offset-4">
            {user.role === "Teacher" ? "Class Submissions" : "My Learning Path"}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Live stream for Class ID:{" "}
            <span className="text-indigo-600 font-bold">{classId}</span>
          </p>
        </div>

        {user.role === "Teacher" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-4xl transition-all shadow-xl shadow-indigo-100 font-black active:scale-95"
          >
            <Plus size={22} /> CREATE TASK
          </button>
        )}
      </div>

      {localClassTasks.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {localClassTasks.map((task) => (
            <AssignmentCard
              key={task._id}
              assignment={task}
              isTeacherView={user.role === "Teacher"}
            />
          ))}
        </div>
      : <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 mx-auto max-w-4xl">
          <div className="bg-slate-50 p-10 rounded-full mb-6">
            <BookOpen className="text-slate-200" size={64} />
          </div>
          <p className="text-slate-400 font-black text-xl uppercase tracking-tighter">
            No assignments in this stream yet!
          </p>
        </div>
      }

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 animate-in slide-in-from-right duration-500 flex flex-col rounded-l-[3rem]">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                Publish Task
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={assignmentForm.handleSubmit}
              className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar"
            >
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Topic Title
                </label>
                <input
                  type="text"
                  {...assignmentForm.getFieldProps("title")}
                  className={`w-full px-6 py-5 bg-slate-50 border-2 ${assignmentForm.touched.title && assignmentForm.errors.title ? "border-rose-400" : "border-slate-100"} rounded-3xl focus:bg-white focus:border-indigo-500 focus:ring-4 ring-indigo-50 outline-none transition-all font-bold text-slate-700`}
                  placeholder="e.g. React Components Deep Dive"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Instructions
                </label>
                <textarea
                  rows="5"
                  {...assignmentForm.getFieldProps("description")}
                  className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none font-medium text-slate-600"
                  placeholder="Detail the submission requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Others"
                    {...assignmentForm.getFieldProps("subject")}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-black text-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Due Date
                  </label>
                  <input
                    type="date"
                    {...assignmentForm.getFieldProps("deadline")}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-bold text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full flex items-center justify-center gap-4 bg-indigo-600 text-white py-6 rounded-4xl font-black text-lg hover:bg-black transition-all active:scale-[0.95] disabled:opacity-50 shadow-2xl shadow-indigo-200 mt-10"
              >
                {isCreating ?
                  "SYNCING..."
                : <>
                    <Send size={22} /> PUBLISH TO CLASS
                  </>
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassAssignment;
