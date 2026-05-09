import React from "react";
import { useGetClassQuery } from "../services/classAPI";
import Loading from "../components/Loading";
import ClassCard from "../components/ClassCard";
import { LayoutGrid, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function ClassPage() {
  const { data: classData, isLoading } = useGetClassQuery();
  const { user } = useSelector((state) => state.auth);

  if (isLoading) return <Loading />;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* --- FIXED / STICKY HEADER START --- */}
      <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutGrid className="text-blue-600" size={24} />
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                My Classes
              </h1>
            </div>
            <p className="hidden md:block text-slate-500 text-xs font-medium ml-8">
              {user?.role === "teacher" ? "Teaching" : "Enrolled"} classrooms
            </p>
          </div>

          {/* Role Based Buttons */}
          <div className="flex items-center gap-3">
            {user?.role==="Student"&&(
              <input type="text" placeholder="Enter 6_Digit Unique Code" />
            )}
            {user?.role === "Student" && (
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md">
                <PlusCircle size={16} />
                Join Class
              </button>
            )}

                  {user?.role==="Teacher"&&(
                      <div>
              <input type="text" placeholder="ClassName" name="className"/>
              <input type="text" placeholder="SubjectName" name="subjectName" />
              </div>
            )}
            {user?.role === "Teacher" && (
              <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md">
                <PlusCircle size={16} />
                Create Class
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto">
        {classData?.data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {classData?.data?.map((currentClass, i) => (
              <motion.div
                key={currentClass._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ClassCard classDetails={currentClass} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <h2 className="text-lg font-bold text-slate-400">No classes found, mama!</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassPage;