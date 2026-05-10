import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { 
  useGetAssignmentsByFieldQuery, 
  useUpdateAssignmentGradeMutation 
} from '../services/taskAPI';
import KanbanColumn from './KanbanColumn';
import Loading from './Loading';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { X, ExternalLink } from 'lucide-react';

function TeacherKanbanBoard({ assignmentDetails }) {
  const { data: response, isLoading } = useGetAssignmentsByFieldQuery({
    title: assignmentDetails?._id,
    description: assignmentDetails?.description
  });

  const [updateGrade, { isLoading: isGrading }] = useUpdateAssignmentGradeMutation();

  const [localAssignments, setLocalAssignments] = useState([]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [pendingGradeData, setPendingGradeData] = useState(null);
  
  const gradeRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (response?.data) {
      setLocalAssignments(response.data);
    }
  }, [response]);

  if (isLoading) return <Loading />;

  const columns = ["To-Do", "In-Progress", "Submitted", "Graded"];

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    if (source.droppableId === "Submitted" && destination.droppableId === "Graded") {
      const taskToGrade = localAssignments.find(t => t._id === draggableId);
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
        status: "Graded"
      }).unwrap();

      toast.success(`Graded successfully for ${pendingGradeData.assignedTo?.name}`);
      
      setTimeout(() => {
        setShowGradeModal(false);
        setPendingGradeData(null);
      }, 1500);

    } catch (err) {
      toast.error(err?.data?.message || "Grading failed. Try again.");
    }
  };

  return (
    <div className="h-[calc(100vh-150px)] flex flex-col overflow-hidden">
      <Toaster/>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-5 overflow-x-auto pb-4 no-scrollbar items-start">
          {columns.map(col => (
            <KanbanColumn 
              key={col} 
              columnId={col} 
              title={col} 
              tasks={localAssignments.filter(t => t.status === col)} 
              isTeacherView={true}
            />
          ))}
        </div>
      </DragDropContext>

      {showGradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-end">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-black text-slate-800 tracking-tighter">REVIEW SUBMISSION</h2>
               <button onClick={() => setShowGradeModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Student</p>
              <p className="text-slate-800 font-bold">{pendingGradeData?.assignedTo?.name || "Student"}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Submitted Link</p>
                <a 
                  href={pendingGradeData?.submissionLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-indigo-600 font-bold hover:underline"
                >
                  View Work <ExternalLink size={14}/>
                </a>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Assign Grade</label>
                <select 
                  ref={gradeRef} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Select Grade</option>
                  <option value="A+">A+ (Outstanding)</option>
                  <option value="A">A (Excellent)</option>
                  <option value="B">B (Good)</option>
                  <option value="C">C (Average)</option>
                  <option value="D">D (Needs Improvement)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Feedback (Optional)</label>
                <textarea 
                  ref={feedbackRef} 
                  placeholder="Write your feedback here..."
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl outline-none h-32 resize-none"
                />
              </div>

              <button 
                disabled={isGrading}
                onClick={handleGradeSubmit} 
                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isGrading ? "SAVING..." : "SUBMIT REVIEW"}
              </button>
              
              <button 
                onClick={() => setShowGradeModal(false)}
                className="w-full py-4 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherKanbanBoard;