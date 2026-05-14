import React, { useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { socket } from '../socket'
import { useGetClassQuery } from '../services/classAPI'
import { useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast';

function DashboardLayout() {
  const { user } = useSelector(state => state.auth)
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
        icon: '🚀' 
      });
    };

    const handleTaskSubmitted = (details) => {
      toast.success(`${details.studentName} submitted a task! 📝`, { id: "submit-toast" });
    };

    const handleGradeUpdated = (details) => {
      toast.success(`Task Graded: ${details.assignmentTitle || "Check Profile"} ✨`, { id: "grade-toast" });
    };

    const handleAssignmentCreated = (details) => {
      toast.success(`New Assignment Received! 📚`, { id: "assign-toast", duration: 6000 });
    };

    if (user.role === "Teacher") {
      socket.on("student_joined", handleStudentJoined);
      socket.on("task_submitted", handleTaskSubmitted);
    } else if (user.role === "Student") {
      socket.on("grade_updated", handleGradeUpdated);
      socket.on("assignment_created", handleAssignmentCreated);
    }


    return () => {
      socket.off("student_joined", handleStudentJoined);
      socket.off("task_submitted", handleTaskSubmitted);
      socket.off("grade_updated", handleGradeUpdated);
      socket.off("assignment_created", handleAssignmentCreated);
    };
  }, [user?.role, socket]); 

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      <Toaster
        position="bottom-left"
        containerStyle={{
          zIndex: 99999,
          bottom: 40, 
        }}
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '16px',
            padding: '12px 24px',
            fontWeight: '600',
          },
        }}
      />

      <Sidebar />

      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
           <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout;