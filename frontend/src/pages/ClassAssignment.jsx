import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, X, BookOpen, Calendar, AlignLeft, Send } from 'lucide-react';

import Loading from '../components/Loading';
import AssignmentCard from '../components/AssignmentCard';
import { useCreateAssignmentMutation, useGetStudentAssignmentQuery, useGetTeacherAssignmentQuery } from '../services/taskAPI';
import { assignmentSchema } from '../schema/SchemaValidation';

function ClassAssignment() {
    const user = useSelector(state => state.auth.user);
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();

    // Data Fetching with skip logic [cite: 3, 4]
    const { data: studentRes, isLoading: sLoading } = useGetStudentAssignmentQuery(undefined, { skip: user.role !== "Student" });
    const { data: teacherRes, isLoading: tLoading } = useGetTeacherAssignmentQuery(undefined, { skip: user.role !== "Teacher" });

    const assignmentForm = useFormik({
        initialValues: { title: "", description: "", subject: "Others", classId: id, deadline: "" },
        validationSchema: assignmentSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await createAssignment(values).unwrap();
                toast.success(res.message || "Assignment Created!");
                resetForm();
                setIsModalOpen(false);
            } catch (error) {
                toast.error(error.data?.message || "Creation Failed");
            }
        }
    });

    if (sLoading || tLoading) return <Loading />;

    const userAssignments = user.role === "Student" ? studentRes?.data : teacherRes?.data;
    const classAssignments = userAssignments?.filter(task => {
        const assignmentClassId = typeof task.classId === 'object' ? task.classId._id : task.classId;
        return assignmentClassId === id;
    });

    const isTeacher = user.role === "Teacher";

    return (
        <div className="p-6 min-h-screen bg-slate-50/50">
            <Toaster position="top-right" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {isTeacher ? "Class Submissions" : "My Assignments"}
                    </h2>
                    <p className="text-slate-500 mt-1">Manage and track classroom tasks effectively.</p>
                </div>

                {isTeacher && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 font-semibold"
                    >
                        <Plus size={20} /> Create Assignment
                    </button>
                )}
            </div>

            {/* Assignments Grid */}
            {classAssignments?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classAssignments.map(task => (
                        <AssignmentCard key={task._id} assignment={task} isTeacherView={isTeacher} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <BookOpen className="text-slate-400" size={40} />
                    </div>
                    <p className="text-slate-500 font-medium text-lg">No assignments found for this class.</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-md bg-white h-full shadow-2xl p-8 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-800">New Assignment</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} className="text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={assignmentForm.handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Assignment Title</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        {...assignmentForm.getFieldProps("title")}
                                        className={`w-full pl-4 pr-4 py-3 bg-slate-50 border ${assignmentForm.touched.title && assignmentForm.errors.title ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                                        placeholder="Enter title"
                                    />
                                </div>
                                {assignmentForm.touched.title && assignmentForm.errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{assignmentForm.errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea 
                                    rows="3"
                                    {...assignmentForm.getFieldProps("description")}
                                    className={`w-full p-4 bg-slate-50 border ${assignmentForm.touched.description && assignmentForm.errors.description ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none`}
                                    placeholder="Task details..."
                                />
                                {assignmentForm.touched.description && assignmentForm.errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{assignmentForm.errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                                    <input 
                                        type="text" 
                                        {...assignmentForm.getFieldProps("subject")}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline</label>
                                    <input 
                                        type="date" 
                                        {...assignmentForm.getFieldProps("deadline")}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                    />
                                    {assignmentForm.touched.deadline && assignmentForm.errors.deadline && <p className="text-red-500 text-xs mt-1">{assignmentForm.errors.deadline}</p>}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isCreating}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {isCreating ? "Publishing..." : <><Send size={18} /> Publish Assignment</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClassAssignment;