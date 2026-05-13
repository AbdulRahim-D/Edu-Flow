import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetTeacherAssignmentQuery,
  useGetClassWiseAssignmentsQuery,
} from "../services/taskAPI";
import { useGetClassQuery } from "../services/classAPI";
import Loading from "../components/Loading";
import KanbanBoard from "../components/KanbanBoard";
import TeacherKanbanBoard from "../components/TeacherKanbanBoard";
import { useFormik } from "formik";
import { socket } from "../socket";

function AssignmentPage() {
  const { user } = useSelector((state) => state.auth);
  const [selectedClass, setSelectedClass] = useState("");

  const [selectedAssignmentDetails, setSelectedAssignmentDetails] =
    useState(null);

  const teacherRes = useGetTeacherAssignmentQuery(undefined, {
    skip: user.role !== "Teacher",
  });

  const { data: teacherClassList, isLoading: teacherClassesLoading } =
    useGetClassQuery(undefined, {
      skip: user.role !== "Teacher",
    });

  const selectedTeacherAssignments =
    teacherRes?.data?.data?.filter(
      (assignment) => assignment.classId._id === selectedClass,
    ) || [];

  const studentRes = useGetClassWiseAssignmentsQuery(selectedClass, {
    skip: user.role !== "Student" || !selectedClass,
  });

  const { data: studentClassList, isLoading: studentClassesLoading } =
    useGetClassQuery(undefined, {
      skip: user.role !== "Student",
    });

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

  const isLoading =
    user.role === "Teacher" ?
      teacherRes.isLoading || teacherClassesLoading
    : studentRes.isLoading || studentClassesLoading;

  if (isLoading) return <Loading />;

  if (user.role === "Teacher") {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800">
            Class Assignments
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor progress across all your assigned classes.
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <select
            className="p-2 border rounded-lg bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
            <option value="">Select a Class</option>
            {teacherClassList?.data?.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded-lg bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedAssignmentDetails?._id || ""}
            onChange={handleAssignmentChange}
            disabled={!selectedClass}
          >
            <option value="">Select an Assignment</option>
            {selectedTeacherAssignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.title || assignment._id}
              </option>
            ))}
          </select>
        </div>

        {selectedAssignmentDetails ?
          <TeacherKanbanBoard assignmentDetails={selectedAssignmentDetails} />
        : <div className="text-center mt-20 text-slate-400">
            Please select a class and an assignment to monitor progress.
          </div>
        }

        <div></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">
          My Kanban Board
        </h1>
        <select
          className="p-2 border rounded-lg bg-white shadow-sm outline-none"
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
      {selectedClass ?
        <KanbanBoard
          initialData={studentRes.data?.data || []}
          classId={selectedClass}
        />
      : <div className="text-center mt-20 text-slate-400">
          Please select a class.
        </div>
      }
    </div>
  );
}

export default AssignmentPage;
