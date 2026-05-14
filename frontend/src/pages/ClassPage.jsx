import React, { useState, useRef, useEffect } from "react";
import { useGetClassQuery, useJoinClassMutation, useCreateClassMutation } from "../services/classAPI";
import Loading from "../components/Loading";
import ClassCard from "../components/ClassCard";
import { LayoutGrid, PlusCircle, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { socket } from "../socket";

function ClassPage() {
  const { data: classData, isLoading } = useGetClassQuery();
  const { user } = useSelector((state) => state.auth);

  const [joinClass, { isLoading: joinLoading }] = useJoinClassMutation();
  const [createClass, { isLoading: createLoading }] = useCreateClassMutation();
  const [localClasses, setLocalClasses] = useState([]);

  const classCodeRef = useRef(null);
  const [classForm, setClassForm] = useState({ className: "", subjectName: "" });

  const handleInputChange = (e) => {
    setClassForm({ ...classForm, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (classData?.data) {
      setLocalClasses(classData.data);
    }
  }, [classData]);


  useEffect(() => {
    socket.on("student_joined", (studentDetails) => {
 
      if (user?.role === "Teacher") {
        toast.success(`${studentDetails.studentName} joined ${studentDetails.className}! 🎓`, {
            icon: '🚀',
            duration: 4000
        });
      }
    });

    return () => {
      socket.off("student_joined");
    };
  }, [user?.role]);

  const handleJoinClass = async () => {
    try {
      const classCode = classCodeRef.current?.value;
      if (!classCode) return toast.error("Enter the 6-Digit Class Code");
      await joinClass({ classCode }).unwrap();
      toast.success("Joined the class successfully! 🎉");
      classCodeRef.current.value = "";
    } catch (error) {
      toast.error(error.data?.message || "Failed to join class");
    }
  };

  const handleCreateClass = async () => {
    try {
      if (!classForm.className || !classForm.subjectName) {
        return toast.error("Please fill all fields!");
      }
      await createClass(classForm).unwrap();
      toast.success("Class created successfully! 🚀");
      setClassForm({ className: "", subjectName: "" });
    } catch (error) {
      toast.error(error.data?.message || "Failed to create class");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      <Toaster position="top-center" />

      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <LayoutGrid className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Classrooms</h1>
              <p className="text-slate-500 text-xs font-medium">
                {user?.role === "Teacher" ? "Teaching Management" : "Enrolled Spaces"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "Student" && (
              <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-inner focus-within:ring-2 ring-blue-500">
                <input
                  type="text"
                  placeholder="Enter 6-Digit Code"
                  ref={classCodeRef}
                  className="bg-transparent border-none outline-none px-3 py-1 text-sm w-40"
                />
                <button
                  onClick={handleJoinClass}
                  disabled={joinLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {joinLoading ? "..." : "Join"}
                </button>
              </div>
            )}

            {user?.role === "Teacher" && (
              <div className="flex flex-col sm:flex-row gap-2 bg-white p-1 border border-slate-200 rounded-xl shadow-sm">
                <input
                  type="text"
                  name="className"
                  placeholder="Class Name"
                  value={classForm.className}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-none outline-none px-3 py-2 text-sm rounded-lg w-full sm:w-44"
                />
                <input
                  type="text"
                  name="subjectName"
                  placeholder="Subject"
                  value={classForm.subjectName}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-none outline-none px-3 py-2 text-sm rounded-lg w-full sm:w-44"
                />
                <button
                  onClick={handleCreateClass}
                  disabled={createLoading}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  <PlusCircle size={16} />
                  {createLoading ? "Creating..." : "Create"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {localClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {localClasses.map((currentClass, i) => (
              <motion.div
                key={currentClass._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ClassCard classDetails={currentClass} isTeacherView={user?.role === "Teacher"} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              {user?.role === "Teacher" ? <BookOpen size={48} className="text-slate-300" /> : <GraduationCap size={48} className="text-slate-300" />}
            </div>
            <h2 className="text-lg font-bold text-slate-400">No classes found!</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassPage;