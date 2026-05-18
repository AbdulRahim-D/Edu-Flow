import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetTeacherAssignmentQuery,
  useGetClassWiseAssignmentsQuery,
} from "../services/taskAPI";
import { useGetClassQuery } from "../services/classAPI";
import Loading from "../components/Loading";
import KanbanBoard from "../components/KanbanBoard";
import TeacherKanbanBoard from "../components/TeacherKanbanBoard";
import { socket } from "../socket";
import { KanbanSquare, Layers, FolderKanban } from "lucide-react";

function AssignmentPage() {
  const { user } = useSelector((state) => state.auth);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedAssignmentDetails, setSelectedAssignmentDetails] = useState(null);

  // RTK Queries
  const teacherRes = useGetTeacherAssignmentQuery(undefined, {
    skip: user.role !== "Teacher",
  });

  const { data: teacherClassList, isLoading: teacherClassesLoading } =
    useGetClassQuery(undefined, {
      skip: user.role !== "Teacher",
    });

  const studentRes = useGetClassWiseAssignmentsQuery(selectedClass, {
    skip: user.role !== "Student" || !selectedClass,
  });

  const { data: studentClassList, isLoading: studentClassesLoading } =
    useGetClassQuery(undefined, {
      skip: user.role !== "Student",
    });

  const selectedTeacherAssignments =
    teacherRes?.data?.data?.filter(
      (assignment) => assignment.classId._id === selectedClass,
    ) || [];

  const handleAssignmentChange = (e) => {
    const assignmentId = e.target.value;
    if (!assignmentId) {
      setSelectedAssignmentDetails(null);
      return;
    }
    const assignmentObj = selectedTeacherAssignments.find(
      (a) => a._id === assignmentId,
    );
    setSelectedAssignmentDetails(assignmentObj);
  };

  useEffect(() => {
    if (!socket) return;

    const handleSyncData = () => {
      if (user.role === "Teacher" && teacherRes.refetch) {
        teacherRes.refetch();
      } else if (user.role === "Student" && studentRes.refetch) {
        studentRes.refetch();
      }
    };

    socket.on("grade_updated", handleSyncData);
    socket.on("task_submitted", handleSyncData);
    socket.on("assignment_created", handleSyncData);
    socket.on("assignment_deleted", handleSyncData);

    return () => {
      socket.off("grade_updated", handleSyncData);
      socket.off("task_submitted", handleSyncData);
      socket.off("assignment_created", handleSyncData);
      socket.off("assignment_deleted", handleSyncData);
    };
  }, [socket, user.role, teacherRes, studentRes]);


  const isLoading =
    user.role === "Teacher" ?
      teacherRes.isLoading || teacherClassesLoading
    : studentRes.isLoading || studentClassesLoading;

  if (isLoading) return <Loading />;

  if (user.role === "Teacher") {
    return (
      <div className="p-0 bg-[#FAFAFC] font-['Poppins',sans-serif] text-slate-800 antialiased">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderKanban className="text-blue-500" size={22} /> Class Assignments
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">
            Monitor progress across all your assigned classes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Class</label>
            <select
              className="w-full px-4 py-3.5 border border-slate-100 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
              value={selectedClass}
              onChange={(e) => {
                const classId = e.target.value;
                setSelectedClass(classId);
                setSelectedAssignmentDetails(null);
                if (classId) {
                  socket.emit("join_class", classId);
                }
              }}
            >
              <option value="">Choose Class...</option>
              {teacherClassList?.data?.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Assignment</label>
            <select
              className="w-full px-4 py-3.5 border border-slate-100 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              value={selectedAssignmentDetails?._id || ""}
              onChange={handleAssignmentChange}
              disabled={!selectedClass}
            >
              <option value="">Choose Assignment...</option>
              {selectedTeacherAssignments.map((assignment) => (
                <option key={assignment._id} value={assignment._id}>
                  {assignment.title || assignment._id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedAssignmentDetails ?
          <TeacherKanbanBoard assignmentDetails={selectedAssignmentDetails} />
        : <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200/80">
            <div className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-300 border border-slate-100">
              <Layers size={32} />
            </div>
            <p className="text-slate-400 text-sm font-semibold tracking-wide text-center px-4">
              Please select a class and an assignment to monitor progress.
            </p>
          </div>
        }

        <div></div>
      </div>
    );
  }

  return (
    <div className="p-0 bg-[#FAFAFC] font-['Poppins',sans-serif] text-slate-800 antialiased">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <KanbanSquare className="text-blue-500" size={22} /> My Kanban Board
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">
            Manage, update, and track your personalized task items.
          </p>
        </div>
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <select
            className="w-full px-4 py-3 border border-slate-200/80 rounded-xl bg-white text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm transition-all cursor-pointer"
            value={selectedClass}
            onChange={(e) => {
              const classId = e.target.value;
              setSelectedClass(classId);
              if (classId) {
                socket.emit("join_class", classId);
              }
            }}
          >
            <option value="">Select a Class</option>
            {studentClassList?.data?.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass ?
        <KanbanBoard
          initialData={studentRes.data?.data || []}
          classId={selectedClass}
        />
      : <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200/80">
          <div className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-300 border border-slate-100">
            <Layers size={32} />
          </div>
          <p className="text-slate-400 text-sm font-semibold tracking-wide text-center px-4">
            Please select a class to view assignments.
          </p>
        </div>
      }
    </div>
  );
}

export default AssignmentPage;