import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetTeacherAssignmentQuery, useGetAssignmentStatsQuery } from "../services/taskAPI";
import { useGetClassQuery } from "../services/classAPI";
import Loading from "../components/Loading";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Layout, FileText, Users, CheckCircle, BarChart3 } from "lucide-react";

function TeacherGraph() {
    const { user } = useSelector((state) => state.auth);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedAssignmentDetails, setSelectedAssignmentDetails] = useState(null);

    const { data: teacherRes, isLoading: teacherTasksLoading } = useGetTeacherAssignmentQuery(undefined, { skip: user.role !== "Teacher" });
    const { data: teacherClassList, isLoading: teacherClassesLoading } = useGetClassQuery(undefined, { skip: user.role !== "Teacher" });

    const { data: assignmentStats, isLoading: statsLoading } = useGetAssignmentStatsQuery(
        selectedAssignmentDetails?.assignmentId, 
        { skip: !selectedAssignmentDetails?.assignmentId }
    );


    const selectedTeacherAssignments = teacherRes?.data?.filter(
        assignment => (typeof assignment.classId === 'object' ? assignment.classId._id : assignment.classId) === selectedClass
    ) || [];

    const handleAssignmentChange = (e) => {
        const assignmentId = e.target.value;
        const assignmentObj = selectedTeacherAssignments.find(a => a._id === assignmentId);
        setSelectedAssignmentDetails(assignmentObj || null);
    };

    if (teacherTasksLoading || teacherClassesLoading) return <Loading />;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="p-0 bg-[#FAFAFC] font-['Poppins',sans-serif] text-slate-800 antialiased">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <BarChart3 className="text-blue-500" size={22} /> Assignment Analytics
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">Track student progress and submission statistics visually.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Class</label>
                    <select
                        className="w-full px-4 py-3.5 border border-slate-100 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
                        value={selectedClass}
                        onChange={(e) => {
                            setSelectedClass(e.target.value);
                            setSelectedAssignmentDetails(null);
                        }}
                    >
                        <option value="">Choose Class...</option>
                        {teacherClassList?.data?.map((cls) => (
                            <option key={cls._id} value={cls._id}>{cls.className}</option>
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
                                {assignment._id}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedAssignmentDetails && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 flex flex-col gap-5">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
                            <h4 className="font-bold text-sm text-slate-900 mb-5 flex items-center gap-2 pb-3 border-b border-slate-50 tracking-tight">
                                <FileText size={16} className="text-blue-500"/> Assignment Info
                            </h4>
                            <div className="space-y-3.5">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Title</span>
                                    <p className="text-sm font-semibold text-slate-800">{selectedAssignmentDetails.title}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject</span>
                                    <p className="text-sm font-medium text-slate-600">{selectedAssignmentDetails.subject}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                                    <p className="text-sm font-medium text-slate-500 line-clamp-3 leading-relaxed">{selectedAssignmentDetails.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100/50 space-y-1">
                                <div className="p-2 bg-white rounded-xl text-blue-500 w-fit border border-blue-100/30 shadow-sm">
                                    <Users size={16}/>
                                </div>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider pt-2">Submissions</p>
                                <h3 className="text-2xl font-bold text-blue-600 tracking-tight">{assignmentStats?.count || 0}</h3>
                            </div>
                            <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100/50 space-y-1">
                                <div className="p-2 bg-white rounded-xl text-emerald-500 w-fit border border-emerald-100/30 shadow-sm">
                                    <CheckCircle size={16}/>
                                </div>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider pt-2">Graded Tasks</p>
                                <h3 className="text-2xl font-bold text-emerald-600 tracking-tight">
                                    {assignmentStats?.data?.find(s => s._id === "Graded")?.count || 0}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
                        <h4 className="font-bold text-slate-900 mb-6 tracking-tight text-sm">Submission Status Breakdown</h4>
                        {statsLoading ? (
                            <div className="h-72 flex items-center justify-center text-slate-400 text-sm font-medium tracking-wide">
                                Loading Analytics...
                            </div>
                        ) : (
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={assignmentStats?.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'Poppins', fontWeight: 500}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'Poppins'}} />
                                        <Tooltip 
                                            cursor={{fill: '#f8fafc'}} 
                                            contentStyle={{
                                                background: '#0f172a', 
                                                borderRadius: '12px', 
                                                border: 'none', 
                                                color: '#f8fafc',
                                                fontFamily: 'Poppins',
                                                fontSize: '12px',
                                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                                            }} 
                                        />
                                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                            {assignmentStats?.data?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!selectedAssignmentDetails && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200/80">
                    <div className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-300 border border-slate-100">
                        <Layout size={32} />
                    </div>
                    <p className="text-slate-400 text-sm font-semibold tracking-wide text-center px-4">Please select a class and assignment to view analytics.</p>
                </div>
            )}
        </div>
    );
}

export default TeacherGraph;