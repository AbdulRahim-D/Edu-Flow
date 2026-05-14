import React, { useEffect } from "react";
import { useGetStudentAssignmentQuery } from "../services/taskAPI";
import Loading from "../components/Loading";
import { useGetClassQuery } from "../services/classAPI";
import { Book, CheckCircle, Clock, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { socket } from "../socket";
import StudentOverview from "../components/StudentOverview";

function StudentDashboard() {
  const { data: assignmentData, isLoading: assignmentLoading } =
    useGetStudentAssignmentQuery();
  const { data: classData, isLoading: classLoading } = useGetClassQuery();
  const navigate = useNavigate();

  if (assignmentLoading || classLoading) return <Loading />;

  const totalAssignments = assignmentData?.data?.length || 0;
  const totalClasses = classData?.data?.length || 0;
  const pendingTasks =
    assignmentData?.data?.filter(
      (t) => t.status === "To-Do" || t.status === "In-Progress",
    ).length || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-500 text-sm font-medium">Overall View</p>
      </div>

      <hr className="border-gray-200 mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/classes")}
          className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="bg-blue-100 p-3 rounded-md text-blue-600">
            <Book size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{totalClasses}</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Total Classes
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-md text-indigo-600">
            <List size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {totalAssignments}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Total Assignments
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm flex items-center gap-4">
          <div
            className={`p-3 rounded-md ${pendingTasks > 0 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}
          >
            {pendingTasks > 0 ?
              <Clock size={24} />
            : <CheckCircle size={24} />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {pendingTasks > 0 ? `${pendingTasks} Pending` : "All Done!"}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Assignment Status
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-bold text-gray-700 uppercase mb-4 tracking-wider font-mono">
          Recent Activity
        </h2>
        <div className="py-10 border-2 border-dashed border-gray-100 rounded-md text-center">
          <StudentOverview />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
