import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  useGetStudentAssignmentQuery,
  useUpdateAssignmentStatusMutation,
} from "../services/taskAPI";
import KanbanColumn from "./KanbanColumn";
import Loading from "./Loading";
import toast, { Toaster } from "react-hot-toast";
import { X, Send, Layout } from "lucide-react";
import { socket } from "../socket";

function KanbanBoard({ classId }) {
  const { data: response, isLoading } = useGetStudentAssignmentQuery();
  const [updateStatus] = useUpdateAssignmentStatusMutation();

  const [localAssignments, setLocalAssignments] = useState([]);
  const [gradeMessage, setGradeMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submissionLink, setSubmissionLink] = useState("");
  const [pendingTaskId, setPendingTaskId] = useState(null);

  useEffect(() => {
    if (response?.data) {
      setLocalAssignments(response.data);
    }
  }, [response]);

  useEffect(() => {
    if (!socket) return;

    socket.on("grade_updated", (gradedAssignment) => {
      setLocalAssignments((prev) => {
        return prev.map((item) =>
          item._id === gradedAssignment._id ?
            { ...item, ...gradedAssignment, status: "Graded" }
          : item,
        );
      });
      toast.success(`Task Graded: ${gradedAssignment.assignmentTitle}`);
    });

    return () => socket.off("grade_updated");
  }, [socket]);

  if (isLoading) return <Loading />;

  const activeClassId =
    classId ||
    (localAssignments.length > 0 ? localAssignments[0]?.classId : null);
  const classAssignments =
    localAssignments.filter((t) => t.classId === activeClassId) || [];

  const columns = ["To-Do", "In-Progress", "Submitted", "Graded"];

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    if (destination.droppableId === "Graded") {
      setGradeMessage("Update to Grade: Only teachers can grade!");
      setTimeout(() => setGradeMessage(""), 3000);
      return;
    }

    if (destination.droppableId === "Submitted") {
      setPendingTaskId(draggableId);
      setShowModal(true);
      return;
    }

    const updatedTasks = localAssignments.map((task) =>
      task._id === draggableId ?
        { ...task, status: destination.droppableId }
      : task,
    );
    setLocalAssignments(updatedTasks);

    try {
      await updateStatus({
        id: draggableId,
        status: destination.droppableId,
      }).unwrap();
      toast.success("Status Updated!");
    } catch (err) {
      setLocalAssignments(response.data);
      toast.error("Status Update Failed!");
    }
  };

  const handleFinalSubmit = async () => {
    if (!submissionLink.trim())
      return toast.error("Submission link is required!");

    const currentTask = localAssignments.find((t) => t._id === pendingTaskId);
    const deadlineDate = new Date(currentTask.deadline);
    const today = new Date();

    if (today > deadlineDate) {
      toast.error("LATE SUBMISSION: Deadline Exceeded!", {
        icon: "⚠️",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    }

    const updatedTasks = localAssignments.map((task) =>
      task._id === pendingTaskId ?
        { ...task, status: "Submitted", submissionLink }
      : task,
    );
    setLocalAssignments(updatedTasks);

    try {
      await updateStatus({
        id: pendingTaskId,
        status: "Submitted",
        submissionLink,
      }).unwrap();
      toast.success("Assignment Submitted successfully!");
      setShowModal(false);
      setSubmissionLink("");
    } catch (err) {
      setLocalAssignments(response.data);
      toast.error("Submission failed!");
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col overflow-hidden px-4">
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layout className="text-indigo-600" size={20} />
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Assignment Tracker
          </h2>
        </div>
        {gradeMessage && (
          <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold border border-amber-200 animate-pulse">
            ⚠️ {gradeMessage}
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-5 overflow-x-auto pb-4 no-scrollbar items-start">
          {columns.map((col) => (
            <KanbanColumn
              key={col}
              columnId={col}
              title={col}
              tasks={classAssignments.filter((t) => t.status === col)}
              isTeacherView={false}
            />
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex justify-end">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                Submit Work
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-slate-500 mb-6 text-sm italic">
              Careful! Submitting after the deadline will be marked as late.
            </p>
            <div className="space-y-4">
              <input
                type="url"
                placeholder="https://your-submission-link.com"
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-3xl outline-none transition-all"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
              />
              <button
                onClick={handleFinalSubmit}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 active:scale-95 transition-transform"
              >
                <Send size={20} /> SUBMIT ASSIGNMENT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;
