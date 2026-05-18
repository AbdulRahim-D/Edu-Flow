import React, { useEffect } from "react";
import { useGetStudentAssignmentQuery } from "../services/taskAPI";
import Loading from "../components/Loading";
import { useGetClassQuery } from "../services/classAPI";
import { Book, CheckCircle, Clock, List, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { socket } from "../socket";
import StudentOverview from "../components/StudentOverview";

function StudentDashboard() {
  const { data: assignmentData, isLoading: assignmentLoading, refetch: refetchAssignments } = useGetStudentAssignmentQuery();
  const { data: classData, isLoading: classLoading, refetch: refetchClasses } = useGetClassQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleSyncData = () => {
      refetchAssignments();
      refetchClasses();
    };

  
    socket.on("assignment_created", handleSyncData);
    socket.on("assignment_deleted", handleSyncData);
    socket.on("task_submitted", handleSyncData);
    socket.on("grade_updated", handleSyncData);
    socket.on("student_joined", handleSyncData); 

    return () => {
      socket.off("assignment_created", handleSyncData);
      socket.off("assignment_deleted", handleSyncData);
      socket.off("task_submitted", handleSyncData);
      socket.off("grade_updated", handleSyncData);
      socket.off("student_joined", handleSyncData);
    };
  }, [socket, refetchAssignments, refetchClasses]);

  if (assignmentLoading || classLoading) return <Loading />;

  const totalAssignments = assignmentData?.data?.length || 0;
  const totalClasses = classData?.data?.length || 0;
  const pendingTasks =
    assignmentData?.data?.filter(
      (t) => t.status === "To-Do" || t.status === "In-Progress",
    ).length || 0;

  return (
    <div className="p-0 bg-[#FAFAFC] min-h-screen font-['Poppins',sans-serif] text-slate-800 antialiased selection:bg-blue-50">
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

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <LayoutDashboard className="text-blue-500" size={22} /> Student Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">
            Overall view of your classes, metrics, and workload progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/classes")}
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-5 cursor-pointer hover:border-blue-500/20 transition-all duration-300"
        >
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 shadow-sm border border-blue-100/50">
            <Book size={24} strokeWidth={2} />
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Total Classes
            </p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              {totalClasses}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-5 transition-all duration-300">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 shadow-sm border border-blue-100/50">
            <List size={24} strokeWidth={2} />
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Total Assignments
            </p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              {totalAssignments}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-5 sm:col-span-2 lg:col-span-1 transition-all duration-300">
          <div
            className={`p-4 rounded-2xl shadow-sm border ${
              pendingTasks > 0 
                ? "bg-amber-50 text-amber-500 border-amber-100/50" 
                : "bg-emerald-50 text-emerald-500 border-emerald-100/50"
            }`}
          >
            {pendingTasks > 0 ? (
              <Clock size={24} strokeWidth={2} />
            ) : (
              <CheckCircle size={24} strokeWidth={2} />
            )}
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Assignment Status
            </p>
            <h3 className={`text-2xl font-bold tracking-tight ${pendingTasks > 0 ? "text-slate-900" : "text-emerald-600"}`}>
              {pendingTasks > 0 ? `${pendingTasks} Pending` : "All Done!"}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
        <h2 className="text-xs font-bold text-slate-900 uppercase mb-6 tracking-widest">
          Recent Activity & Performance
        </h2>
        <div className="bg-slate-50/40 rounded-2xl border border-dashed border-slate-200/80 p-4 sm:p-6 text-center">
          <StudentOverview />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;