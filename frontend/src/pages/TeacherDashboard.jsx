import React, { useEffect } from "react";
import { useGetClassQuery } from "../services/classAPI";
import { useDispatch } from "react-redux";
import { setClasses, updateTotalClass } from "../features/classSlice";
import Loading from "../components/Loading";
import { useGetTeacherAssignmentQuery } from "../services/taskAPI";
import { setTasks, setTotalTasks } from "../features/taskSlice";
import { School, GraduationCap, NotebookPen, Users, LayoutDashboard, PlusCircle } from "lucide-react";
import { motion } from "framer-motion"; 
import TeacherGraph from "../components/TeacherGraph";

function TeacherDashboard() {
  const { data: classData, isLoading: classLoading } = useGetClassQuery();
  const { data: assignmentData, isLoading: assignmentsLoading } = useGetTeacherAssignmentQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (classData?.data) {
      dispatch(setClasses(classData.data));
      dispatch(updateTotalClass(classData.data.length));
    }
    if (assignmentData?.data) {
      dispatch(setTasks(assignmentData.data));
      dispatch(setTotalTasks(assignmentData.data.length));
    }
  }, [classData, assignmentData, dispatch]);

  if (classLoading || assignmentsLoading) return <Loading />;

  const totalStudents = classData?.data?.reduce((prevCount, currentClass) => {
    return prevCount + (currentClass?.students?.length || 0);
  }, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* --- FIXED HEADER (Student Page Laga) --- */}
      <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="text-blue-600" size={24} />
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Teacher Dashboard
              </h1>
            </div>
            <p className="hidden md:block text-slate-500 text-xs font-medium ml-8">
              Overview of your teaching progress and analytics
            </p>
          </div>

        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="p-6 max-w-[1400px] mx-auto"
      >
        {/* Stats Grid (Student Dashboard Minimal Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Classes Stat Card */}
          <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <School size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Classes</p>
              <h3 className="text-2xl font-black text-slate-800">{classData?.data?.length || 0}</h3>
            </div>
          </motion.div>

          {/* Students Stat Card */}
          <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <Users size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Students</p>
              <h3 className="text-2xl font-black text-slate-800">{totalStudents}</h3>
            </div>
          </motion.div>

          {/* Assignments Stat Card */}
          <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <NotebookPen size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assignments</p>
              <h3 className="text-2xl font-black text-slate-800">{assignmentData?.data?.length || 0}</h3>
            </div>
          </motion.div>
        </div>

        {/* Analytics Section / Coming Soon (Ticket-like feel) */}
        <TeacherGraph/>

      </motion.div>
    </div>
  );
}

export default TeacherDashboard;