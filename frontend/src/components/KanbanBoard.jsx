import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  useGetStudentAssignmentQuery,
  useUpdateAssignmentStatusMutation,
} from "../services/taskAPI";
import KanbanColumn from "./KanbanColumn";
import Loading from "./Loading";
import toast, { Toaster } from "react-hot-toast";
import { X, Send, LayoutGrid, AlertTriangle, Lock } from "lucide-react";
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

    const handleGradeUpdate = (gradedAssignment) => {
      setLocalAssignments((prev) => {
        return prev.map((item) =>
          item._id === gradedAssignment._id ?
            { ...item, ...gradedAssignment, status: "Graded" }
          : item,
        );
      });
      toast.success(`Task Graded: ${gradedAssignment.assignmentTitle}`);
    };

    const handleAssignmentDeleted = (deletedData) => {
      setLocalAssignments((prev) => 
        prev.filter((item) => 
          item.title !== deletedData.title || 
          item.description !== deletedData.description
        )
      );
      toast.error(deletedData.message || "An assignment was removed by the teacher!");
    };

    socket.on("grade_updated", handleGradeUpdate);
    socket.on("assignment_deleted", handleAssignmentDeleted);

    return () => {
      socket.off("grade_updated", handleGradeUpdate);
      socket.off("assignment_deleted", handleAssignmentDeleted);
    };
  }, [socket]);

  if (isLoading) return <Loading />;

  const activeClassId =
    classId ||
    (localAssignments.length > 0 ? localAssignments[0]?.classId : null);
  const classAssignments =
    localAssignments.filter((t) => t.classId === activeClassId) || [];

  const columns = ["To-Do", "In-Progress", "Submitted", "Graded"];

  // Helper function to check if deadline is crossed
  const isDeadlineCrossed = (deadline) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    if (destination.droppableId === "Graded") {
      setGradeMessage("Update to Grade: Only teachers can grade!");
      setTimeout(() => setGradeMessage(""), 3000);
      return;
    }

    // Find the current dragged task
    const currentTask = localAssignments.find((t) => t._id === draggableId);

    if (destination.droppableId === "Submitted" && isDeadlineCrossed(currentTask?.deadline)) {
      toast.error("SUBMISSION LOCKED: Deadline has passed!");
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
    
    if (isDeadlineCrossed(currentTask?.deadline)) {
      toast.error("Submission blocked. Deadline passed!");
      setShowModal(false);
      return;
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

  const targetTask = localAssignments.find((t) => t._id === pendingTaskId);
  const isCurrentModalLocked = isDeadlineCrossed(targetTask?.deadline);

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col overflow-hidden font-['Poppins',sans-serif] text-slate-800 antialiased selection:bg-blue-50">
      <Toaster 
        position="top-right" 
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
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <LayoutGrid className="text-blue-500" size={22} />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Assignment Tracker
          </h2>
        </div>
        {gradeMessage && (
          <div className="bg-amber-50 text-amber-600 border border-amber-100 px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide animate-pulse">
            ⚠️ {gradeMessage}
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-6 items-start no-scrollbar snap-x">
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-end transition-all duration-300">
          <div className="w-full max-w-md bg-white h-screen shadow-[0_0_50px_rgba(0,0,0,0.05)] p-8 flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100/80">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  {isCurrentModalLocked ? (
                    <>
                      <Lock size={18} className="text-rose-500" />
                      <span className="text-slate-500 line-through">Submit Work</span>
                    </>
                  ) : (
                    "Submit Work"
                  )}
                </h2>
                <p className="text-xs font-medium text-slate-400 tracking-wide mt-0.5">
                  {isCurrentModalLocked ? "This assignment is no longer accepting submissions." : "Provide your assignment workspace link."}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {isCurrentModalLocked ? (
                <div className="flex items-start gap-2.5 text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl text-xs font-semibold leading-relaxed">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <span>SUBMISSION DEADLINE EXCEEDED: You can no longer upload or change files for this track. Please approach your teacher directly.</span>
                </div>
              ) : (
                <>
                  <p className="text-amber-600 bg-amber-50/50 border border-amber-100/50 px-4 py-3 rounded-xl text-xs font-medium leading-relaxed">
                    Careful! Submitting after the assigned target deadline passes logs a late marker to the instructor timeline view.
                  </p>
                  <div className="flex items-start gap-2.5 text-rose-600 bg-rose-50/50 border border-rose-100/50 px-4 py-3 rounded-xl text-xs font-medium leading-relaxed">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span><strong>WARNING:</strong> Double-check your submission field before submitting. Providing an invalid or broken link may lead to 0 marks or an immediate task failure.</span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Submission Link
                </label>
                <input
                  type="text"
                  disabled={isCurrentModalLocked}
                  placeholder={isCurrentModalLocked ? "Submission is locked." : "Paste your link or text work here..."}
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl outline-none text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  onClick={handleFinalSubmit}
                  disabled={isCurrentModalLocked}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <Send size={15} /> <span>Submit Assignment</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all active:scale-[0.99]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;