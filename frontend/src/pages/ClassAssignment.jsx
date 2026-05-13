import React, { useEffect, useState } from "react";
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
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localClassTasks, setLocalClassTasks] = useState([]);

  const [createAssignment, { isLoading: isCreating }] =
    useCreateAssignmentMutation();

  const { data: studentRes, isLoading: sLoading } =
    useGetStudentAssignmentQuery(undefined, { skip: user.role !== "Student" });
  const { data: teacherRes, isLoading: tLoading } =
    useGetTeacherAssignmentQuery(undefined, { skip: user.role !== "Teacher" });

  useEffect(() => {
    const rawData =
      user.role === "Student" ? studentRes?.data : teacherRes?.data;
    if (rawData) {
      const filtered = rawData.filter((task) => {
        const assignmentClassId =
          typeof task.classId === "object" ? task.classId._id : task.classId;
        return assignmentClassId === id;
      });
      setLocalClassTasks(filtered);
    }
  }, [studentRes, teacherRes, id, user.role]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_class", id);

    socket.on("assignment_created", (newAsgn) => {
      setLocalClassTasks((prev) => {
        const exists = prev.find((t) => t._id === newAsgn._id);
        if (exists) return prev;
        return [newAsgn, ...prev];
      });
      toast.success("New Assignment Received!");
    });

    socket.on("assignment_deleted", (deletedInfo) => {
      setLocalClassTasks((prev) =>
        prev.filter((task) => task.title !== deletedInfo.title),
      );
      toast.error(`Assignment Removed: ${deletedInfo.title}`, { icon: "🗑️" });
    });

    return () => {
      socket.off("assignment_created");
      socket.off("assignment_deleted");
    };
  }, [id]);

  const assignmentForm = useFormik({
    initialValues: {
      title: "",
      description: "",
      subject: "Others",
      classId: id,
      deadline: "",
    },
    validationSchema: assignmentSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createAssignment(values).unwrap();
        resetForm();
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error.data?.message || "Creation Failed");
      }
    },
  });

  if (sLoading || tLoading) return <Loading />;

  const isTeacher = user.role === "Teacher";

  return (
    <div className="p-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
            {isTeacher ? "Class Submissions" : "My Learning Path"}
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Live classroom activity stream is active.
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl transition-all shadow-xl font-black active:scale-95"
          >
            <Plus size={20} /> CREATE TASK
          </button>
        )}
      </div>

      {localClassTasks.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
          {localClassTasks.map((task) => (
            <AssignmentCard
              key={task._id}
              assignment={task}
              isTeacherView={isTeacher}
            />
          ))}
        </div>
      : <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm mx-auto max-w-4xl">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <BookOpen className="text-slate-300" size={48} />
          </div>
          <p className="text-slate-400 font-bold text-lg">
            Waiting for assignments...
          </p>
        </div>
      }

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-all overflow-hidden">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-8 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase underline decoration-indigo-500 decoration-4">
                NEW TASK
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <form
              onSubmit={assignmentForm.handleSubmit}
              className="space-y-6 flex-1"
            >
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Topic Title
                </label>
                <input
                  type="text"
                  {...assignmentForm.getFieldProps("title")}
                  className={`w-full px-5 py-4 bg-slate-50 border-2 ${assignmentForm.touched.title && assignmentForm.errors.title ? "border-rose-400" : "border-slate-100"} rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold`}
                  placeholder="Enter topic..."
                />
                {assignmentForm.touched.title &&
                  assignmentForm.errors.title && (
                    <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">
                      {assignmentForm.errors.title}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Task Details
                </label>
                <textarea
                  rows="4"
                  {...assignmentForm.getFieldProps("description")}
                  className={`w-full p-5 bg-slate-50 border-2 ${assignmentForm.touched.description && assignmentForm.errors.description ? "border-rose-400" : "border-slate-100"} rounded-2xl focus:border-indigo-500 outline-none transition-all resize-none font-medium`}
                  placeholder="Instructions for students..."
                />
                {assignmentForm.touched.description &&
                  assignmentForm.errors.description && (
                    <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">
                      {assignmentForm.errors.description}
                    </p>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    {...assignmentForm.getFieldProps("subject")}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Submission Due
                  </label>
                  <input
                    type="date"
                    {...assignmentForm.getFieldProps("deadline")}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-600"
                  />
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-3xl font-black hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-indigo-100"
                >
                  {isCreating ?
                    "PREPARING..."
                  : <>
                      <Send size={20} /> PUBLISH TO CLASS
                    </>
                  }
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
