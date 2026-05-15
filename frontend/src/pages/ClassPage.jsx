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
    <div className="bg-[#FAFAFC] min-h-screen pb-12 font-['Poppins',sans-serif] text-slate-800 antialiased selection:bg-blue-100">
      <Toaster 
        position="top-center"
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
        <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-500">
              <LayoutGrid size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Classrooms</h1>
              <p className="text-slate-400 text-xs font-medium tracking-wide mt-0.5">
                {user?.role === "Teacher" ? "Teaching Management" : "Enrolled Spaces"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {user?.role === "Student" && (
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
                <input
                  type="text"
                  placeholder="Enter 6-Digit Code"
                  ref={classCodeRef}
                  className="bg-transparent border-none outline-none px-3 py-1 text-sm font-medium text-slate-800 placeholder:text-slate-400 w-44"
                />
                <button
                  onClick={handleJoinClass}
                  disabled={joinLoading}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {joinLoading ? "Joining..." : "Join"}
                </button>
              </div>
            )}

            {user?.role === "Teacher" && (
              <div className="flex flex-col sm:flex-row gap-2.5 bg-white p-2 border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] w-full sm:w-auto">
                <input
                  type="text"
                  name="className"
                  placeholder="Class Name"
                  value={classForm.className}
                  onChange={handleInputChange}
                  className="bg-slate-50/50 border border-slate-100/50 outline-none px-4 py-2.5 text-sm font-medium rounded-xl w-full sm:w-44 focus:bg-white focus:border-blue-500/30 transition-all"
                />
                <input
                  type="text"
                  name="subjectName"
                  placeholder="Subject"
                  value={classForm.subjectName}
                  onChange={handleInputChange}
                  className="bg-slate-50/50 border border-slate-100/50 outline-none px-4 py-2.5 text-sm font-medium rounded-xl w-full sm:w-44 focus:bg-white focus:border-blue-500/30 transition-all"
                />
                <button
                  onClick={handleCreateClass}
                  disabled={createLoading}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <PlusCircle size={14} strokeWidth={2.5} />
                  <span>{createLoading ? "Creating..." : "Create"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-8 max-w-[1400px] mx-auto px-2">
        {localClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {localClasses.map((currentClass, i) => (
              <motion.div
                key={currentClass._id || i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 100 }}
              >
                <ClassCard classDetails={currentClass} isTeacherView={user?.role === "Teacher"} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200/80">
            <div className="bg-slate-50 p-5 rounded-xl mb-4 text-slate-300 border border-slate-100/50">
              {user?.role === "Teacher" ? <BookOpen size={36} /> : <GraduationCap size={36} />}
            </div>
            <h2 className="text-slate-400 text-sm font-semibold tracking-wide">No classrooms configured yet.</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassPage;