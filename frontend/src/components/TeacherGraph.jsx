import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetTeacherAssignmentQuery, useGetAssignmentStatsQuery } from "../services/taskAPI";
import { useGetClassQuery } from "../services/classAPI";
import Loading from "../components/Loading";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, Cell, Legend,CartesianGrid } from "recharts";
import { Layout, FileText, Users, CheckCircle } from "lucide-react";

function TeacherGraph() {
    const { user } = useSelector((state) => state.auth);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedAssignmentDetails, setSelectedAssignmentDetails] = useState(null);

    // Fetch Teacher Data
    const { data: teacherRes, isLoading: teacherTasksLoading } = useGetTeacherAssignmentQuery(undefined, { skip: user.role !== "Teacher" });
    const { data: teacherClassList, isLoading: teacherClassesLoading } = useGetClassQuery(undefined, { skip: user.role !== "Teacher" });

    const { data: assignmentStats, isLoading: statsLoading } = useGetAssignmentStatsQuery(
        selectedAssignmentDetails?.assignmentId, 
        { skip: !selectedAssignmentDetails?.assignmentId }
    );
    console.log(assignmentStats);
    console.log(selectedAssignmentDetails?.assignmentId);
    
    

    const selectedTeacherAssignments = teacherRes?.data?.filter(
        assignment => (typeof assignment.classId === 'object' ? assignment.classId._id : assignment.classId) === selectedClass
    ) || [];

    const handleAssignmentChange = (e) => {
        const assignmentId = e.target.value;
        const assignmentObj = selectedTeacherAssignments.find(a => a._id === assignmentId);
        setSelectedAssignmentDetails(assignmentObj || null);
    };

    if (teacherTasksLoading || teacherClassesLoading) return <Loading />;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="p-6 min-h-screen bg-slate-50">
            {/* Header Area */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                    <Layout className="text-indigo-600" /> Assignment Analytics
                </h2>
                <p className="text-slate-500">Track student progress and submission statistics visually.</p>
            </div>

            {/* Selectors Bar */}
            <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Select Class</label>
                    <select
                        className="p-3 border border-slate-200 rounded-xl bg-slate-50 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
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

                <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Select Assignment</label>
                    <select
                        className="p-3 border border-slate-200 rounded-xl bg-slate-50 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer disabled:opacity-50"
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

            {/* Stats Overview Grid */}
            {selectedAssignmentDetails && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side: Summary Cards */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                                <FileText size={18} className="text-indigo-500"/> Assignment Info
                            </h4>
                            <div className="space-y-3">
                                <p className="text-sm text-slate-600"><span className="font-semibold">Title:</span> {selectedAssignmentDetails.title}</p>
                                <p className="text-sm text-slate-600"><span className="font-semibold">Subject:</span> {selectedAssignmentDetails.subject}</p>
                                <p className="text-sm text-slate-600 line-clamp-2"><span className="font-semibold">Desc:</span> {selectedAssignmentDetails.description}</p>
                            </div>
                        </div>

                        {/* Quick Count Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100">
                                <Users className="text-indigo-600 mb-2" size={24}/>
                                <p className="text-xs font-bold text-indigo-400 uppercase">Total Submissions</p>
                                <h3 className="text-2xl font-black text-indigo-700">{assignmentStats?.count || 0}</h3>
                            </div>
                            <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
                                <CheckCircle className="text-emerald-600 mb-2" size={24}/>
                                <p className="text-xs font-bold text-emerald-400 uppercase">Graded Tasks</p>
                                <h3 className="text-2xl font-black text-emerald-700">
                                    {assignmentStats?.data?.find(s => s._id === "Graded")?.count || 0}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Bar Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                        <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Submission Status Breakdown</h4>
                        {statsLoading ? <div className="h-64 flex items-center justify-center">Loading Charts...</div> : (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={assignmentStats?.data}>
                                        <XAxis dataKey="_id" axisLine={true} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={true} tickLine={true} tick={{fill: '#94a3b8'}} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                        <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={50}>
                                            {assignmentStats?.data?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                
                                            ))}
                                            <CartesianGrid strokeDasharray="3 3" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!selectedAssignmentDetails && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                        <Layout size={48} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-medium">Please select a class and assignment to view analytics.</p>
                </div>
            )}
        </div>
    );
}

export default TeacherGraph;