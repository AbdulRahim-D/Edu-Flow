import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
  useGetStudentAssignmentQuery, 
  useGetTeacherAssignmentQuery,
  useGetClassWiseAssignmentsQuery // Kotha class-wise query
} from "../services/taskAPI";
import { useGetClassQuery } from "../services/classAPI"; 
import Loading from "../components/Loading";
import AssignmentCard from "../components/AssignmentCard"; 
import KanbanBoard from "../components/KanbanBoard";

function AssignmentPage() {
  const { user } = useSelector((state) => state.auth);
  const [selectedClass, setSelectedClass] = useState(""); // Student select chesina class ID

  // 1. Teacher assignments fetch (existing logic)
  const teacherRes = useGetTeacherAssignmentQuery(undefined, {
    skip: user.role !== "Teacher",
  });

  // 2. Student assignments fetch (Class-wise optimization)
  // Student class select chesthene assignments fetch avthayi [cite: 13, 18]
  const studentRes = useGetClassWiseAssignmentsQuery(selectedClass, {
    skip: user.role !== "Student" || !selectedClass,
  });

  // 3. Student classes list (Dropdown kosam)
  const { data: classList, isLoading: classesLoading } = useGetClassQuery(undefined, {
    skip: user.role !== "Student",
  });

  const isLoading = user.role === "Teacher" ? teacherRes.isLoading : (studentRes.isLoading || classesLoading);

  if (isLoading) return <Loading />;

  // --- TEACHER VIEW (Existing Grid Layout) ---
  if (user.role === "Teacher") {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800">Class Assignments</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor progress across all your assigned classes.</p>
        </div>

        {teacherRes.data?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherRes.data.data.map((item, index) => (
              <AssignmentCard key={item._id || index} assignment={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium text-lg">No assignments found!</p>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md">
               Create First Assignment
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- STUDENT VIEW (Kanban Board with Filter) ---
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">My Kanban Board</h1>
          <p className="text-slate-500 text-sm mt-1">Manage tasks for your selected class.</p>
        </div>

        {/* Class Selection Dropdown [cite: 127] */}
        <select 
          className="p-2 border rounded-lg bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select a Class</option>
          {classList?.data?.map((cls) => (
            <option key={cls._id} value={cls._id}>{cls.className}</option>
          ))}
        </select>
      </div>

      {selectedClass ? (
        <KanbanBoard initialData={studentRes.data?.data || []} classId={selectedClass} />
      ) : (
        <div className="text-center mt-20 text-slate-400">
           Please select a class to view your assignments.
        </div>
      )}
    </div>
  );
}

export default AssignmentPage;