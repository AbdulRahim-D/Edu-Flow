import React, { useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { socket } from "../socket";
import { useGetClassQuery } from "../services/classAPI";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const { data: classData } = useGetClassQuery();

  useEffect(() => {
    if (classData?.data && socket) {
      classData.data.forEach((item) => {
        socket.emit("join_class", item._id);
      });
    }
  }, [classData]);

  useEffect(() => {
    if (!user || !socket) return;

    const handleStudentJoined = (details) => {
      toast.success(`${details.studentName} joined ${details.className}! 🎓`, {
        id: "join-toast",
        icon: "🚀",
      });
    };

    const handleTaskSubmitted = (details) => {
      toast.success(`${details.studentName} submitted a task! 📝`, {
        id: "submit-toast",
      });
    };

    const handleGradeUpdated = (details) => {
      toast.success(
        `Task Graded: ${details.assignmentTitle || "Check Profile"} ✨`,
        { id: "grade-toast" },
      );
    };

    const handleAssignmentCreated = (details) => {
      toast.success(`New Assignment Received! 📚`, {
        id: "assign-toast",
        duration: 6000,
      });
    };
    const handleDeletedAssignment=(deletedInfo)=>{
     toast.success(`${deletedInfo?.title} is deleted`,{
       duration:6000,
     });
    }

    if (user.role === "Teacher") {
      socket.on("student_joined", handleStudentJoined);
      socket.on("task_submitted", handleTaskSubmitted);
      socket.on("assignment_deleted",handleDeletedAssignment)
    } else if (user.role === "Student") {
      socket.on("grade_updated", handleGradeUpdated);
      socket.on("assignment_deleted",handleDeletedAssignment)
      socket.on("assignment_created", handleAssignmentCreated);
    }

    return () => {
      socket.off("student_joined", handleStudentJoined);
      socket.off("task_submitted", handleTaskSubmitted);
      socket.off("grade_updated", handleGradeUpdated);
      socket.off("assignment_deleted",handleDeletedAssignment);
      socket.off("assignment_created", handleAssignmentCreated);
    };
  }, [user?.role, socket]);

  return (
    <div className="flex min-h-screen bg-[#FAFAFC] overflow-hidden font-['Poppins',sans-serif] antialiased text-slate-800 selection:bg-blue-50">
   
      <Toaster
        position="bottom-left"
        containerStyle={{
          zIndex: 99999,
          bottom: 32,
          left: 32,
        }}
        toastOptions={{
          style: {
            background: "#0F172A",
            color: "#F8FAFC", 
            borderRadius: "16px",
            padding: "16px 24px",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "0.015em",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)", // Subtle Blue-500 glass tint border
            maxWidth: "380px",
          },
          success: {
            iconTheme: {
              primary: "#3b82f6", 
              secondary: "#ffffff",
            },
          },
        }}
      />

      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto h-screen relative bg-[#FAFAFC]">
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none -z-10" />
        
        <div className="max-w-[1400px] mx-auto p-6 lg:p-10 transition-all duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;