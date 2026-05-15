import React, { useState, useEffect, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  useGetAssignmentsByFieldQuery,
  useUpdateAssignmentGradeMutation,
} from "../services/taskAPI";
import KanbanColumn from "./KanbanColumn";
import Loading from "./Loading";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { X, ExternalLink, CheckSquare, MessageSquare, Award, AlertTriangle, FileText } from "lucide-react";

import { socket } from "../socket";

function TeacherKanbanBoard({ assignmentDetails }) {
  const { data: response, isLoading } = useGetAssignmentsByFieldQuery({
    title: assignmentDetails?._id,
    description: assignmentDetails?.description,
  });

  const [updateGrade, { isLoading: isGrading }] =
    useUpdateAssignmentGradeMutation();

  const [localAssignments, setLocalAssignments] = useState([]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [pendingGradeData, setPendingGradeData] = useState(null);

  const [changeKanbanBoard, setChangeKanbanBoard] = useState("");

  const gradeRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (response?.data) {
      setLocalAssignments(response.data);
    }
  }, [response]);

  useEffect(() => {
    if (!socket) return;

    socket.on("task_submitted", (submittedAssignment) => {
      console.log("Socket received data:", submittedAssignment);

      toast.success(`${submittedAssignment.studentName} submitted a task!`);

      setLocalAssignments((prev) => {
        const exists = prev.find((t) => t._id === submittedAssignment._id);

        if (exists) {
          return prev.map((t) =>
            t._id === submittedAssignment._id ?
              { ...t, ...submittedAssignment, status: "Submitted" }
            : t,
          );
        } else {
          return [...prev, { ...submittedAssignment, status: "Submitted" }];
        }
      });
    });

    return () => {
      socket.off("task_submitted");
    };
  }, []);

  if (isLoading) return <Loading />;

  const columns = ["To-Do", "In-Progress", "Submitted", "Graded"];

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    if (
      source.droppableId === "Submitted" &&
      destination.droppableId === "Graded"
    ) {
      const taskToGrade = localAssignments.find((t) => t._id === draggableId);
      setPendingGradeData(taskToGrade);
      setShowGradeModal(true);
    } else {
      toast.error("Teachers can only move tasks from 'Submitted' to 'Graded'.");
    }
  };

  const handleGradeSubmit = async () => {
    const selectedGrade = gradeRef.current?.value;
    const feedbackText = feedbackRef.current?.value;

    if (!selectedGrade) return toast.error("Please provide a grade!");

    try {
      await updateGrade({
        id: pendingGradeData?._id.toString(),
        grade: selectedGrade,
        feedback: feedbackText,
        studentId: pendingGradeData?.assignedTo?._id,
        status: "Graded",
      }).unwrap();

      toast.success(
        `Graded successfully for ${pendingGradeData.assignedTo?.name}`,
      );

      setTimeout(() => {
        setShowGradeModal(false);
        setPendingGradeData(null);
      }, 1500);
    } catch (err) {
      toast.error(err?.data?.message || "Grading failed. Try again.");
    }
  };

  // Helper check to determine if the submission is a plain link or raw text
  const isPlainLink = /^https?:\/\//i.test(pendingGradeData?.submissionLink || "");

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col overflow-hidden font-['Poppins',sans-serif] text-slate-800 antialiased selection:bg-blue-50">
      <Toaster />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-6 mt-2 items-start no-scrollbar snap-x">
          {columns.map((col) => (
            <KanbanColumn
              key={col}
              columnId={col}
              title={col}
              tasks={localAssignments.filter((t) => t.status === col)}
              isTeacherView={true}
            />
          ))}
        </div>
      </DragDropContext>

      {showGradeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-end transition-all duration-300">
          <div className="w-full max-w-md bg-white h-screen shadow-[0_0_50px_rgba(0,0,0,0.05)] p-8 flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100/80">
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <CheckSquare size={18} className="text-blue-500" /> Review Submission
                </h2>
                <p className="text-xs font-medium text-slate-400 tracking-wide mt-0.5">Evaluate and provide grading criteria.</p>
              </div>
              <button
                onClick={() => setShowGradeModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 mb-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Student Name
                </span>
                <p className="text-slate-800 font-semibold text-sm">
                  {pendingGradeData?.assignedTo?.name || "Student"}
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-200/50 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Submitted Attachment / Link
                </span>
                
                {isPlainLink ? (
                  <a
                    href={pendingGradeData?.submissionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-white border border-slate-200/60 text-blue-500 font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-50/40 hover:border-blue-500/20 transition-all shadow-sm group"
                  >
                    <span>View Student Work</span>
                    <ExternalLink size={13} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </a>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-amber-600 bg-amber-50/50 border border-amber-100/50 p-3 rounded-xl text-xs font-medium leading-relaxed">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                      <span>The student has submitted raw text work instead of an external web attachment asset link. See text contents details below:</span>
                    </div>
                    <div className="p-3.5 bg-white border border-slate-200/60 rounded-xl text-xs text-slate-700 font-medium leading-relaxed max-h-32 overflow-y-auto break-words shadow-xs">
                      {pendingGradeData?.submissionLink}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pr-1">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Award size={14} className="text-slate-400" /> Assign Grade
                </label>
                <select
                  ref={gradeRef}
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl outline-none text-sm font-semibold text-slate-700 cursor-pointer transition-all duration-200"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select performance mark...
                  </option>
                  <option value="A+">A+ (Outstanding)</option>
                  <option value="A">A (Excellent)</option>
                  <option value="B">B (Good)</option>
                  <option value="C">C (Average)</option>
                  <option value="D">D (Needs Improvement)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-slate-400" /> Feedback (Optional)
                </label>
                <textarea
                  ref={feedbackRef}
                  placeholder="Leave structural notes or criteria remarks here..."
                  className="w-full p-4 bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl outline-none text-sm font-medium text-slate-700 h-36 resize-none transition-all duration-200 placeholder:text-slate-400/80 leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-3 mt-6 pt-4 border-t border-slate-100">
              <button
                disabled={isGrading}
                onClick={handleGradeSubmit}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isGrading ? "Saving Grade..." : "Submit Evaluation"}</span>
              </button>

              <button
                onClick={() => setShowGradeModal(false)}
                className="w-full py-4 bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all active:scale-[0.99]"
              >
                Cancel Review
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherKanbanBoard;