import React, { useEffect } from "react";
import { useGetClassQuery } from "../services/classAPI";
import { useDispatch } from "react-redux";
import Loading from "../components/Loading";
import { useGetTeacherAssignmentQuery } from "../services/taskAPI";
import { School, NotebookPen, Users, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import TeacherGraph from "../components/TeacherGraph";
import { socket } from "../socket";
import toast, { Toaster } from "react-hot-toast";

function TeacherDashboard() {
  const { data: classData, isLoading: classLoading } = useGetClassQuery();
  const { data: assignmentData, isLoading: assignmentsLoading } =
    useGetTeacherAssignmentQuery();

  socket.on("message", (msg) => {
    console.log(msg);
  });

  if (classLoading || assignmentsLoading) return <Loading />;

  const totalStudents = classData?.data?.reduce((prevCount, currentClass) => {
    return prevCount + (currentClass?.students?.length || 0);
  }, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="bg-[#FAFAFC] min-h-screen font-['Poppins',sans-serif] selection:bg-blue-50 text-slate-800 antialiased">
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
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

      <div className="sticky top-0 z-30 bg-[#FAFAFC]/80 backdrop-blur-md border-b border-slate-200/60 px-2 py-5">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                <LayoutDashboard size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Teacher Dashboard
                </h1>
                <p className="hidden sm:block text-slate-400 text-xs font-medium tracking-wide mt-0.5">
                  Overview of your teaching progress and analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-8 max-w-[1400px] mx-auto space-y-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-5 hover:border-blue-500/20 transition-all duration-300"
          >
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-500 shadow-sm border border-blue-100/50">
              <School size={24} strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Classes
              </p>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                {classData?.data?.length || 0}
              </h3>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-5 hover:border-emerald-500/20 transition-all duration-300"
          >
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500 shadow-sm border border-emerald-100/50">
              <Users size={24} strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Total Students
              </p>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                {totalStudents}
              </h3>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-5 sm:col-span-2 lg:col-span-1 hover:border-amber-500/20 transition-all duration-300"
          >
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 shadow-sm border border-amber-100/50">
              <NotebookPen size={24} strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Assignments
              </p>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                {assignmentData?.data?.length || 0}
              </h3>
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.02)]"
        >
          <TeacherGraph />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default TeacherDashboard;