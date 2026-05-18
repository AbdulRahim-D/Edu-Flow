import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetTeacherAssignmentQuery, useGetAssignmentStatsQuery } from "../services/taskAPI";
import { useGetClassQuery } from "../services/classAPI";
import Loading from "../components/Loading";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Layout, FileText, CheckCircle, BarChart3, Clock, Send } from "lucide-react";
import { socket } from "../socket";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl">
                <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Status: <span className="text-white ml-1">{payload[0].payload._id}</span>
                </p>
                <p className="text-blue-400 font-semibold text-sm flex items-center gap-1.5">
                    Count: <span className="text-white text-lg">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

function TeacherGraph() {
    const { user } = useSelector((state) => state.auth);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedAssignmentDetails, setSelectedAssignmentDetails] = useState(null);

    const { data: teacherRes, isLoading: teacherTasksLoading } = useGetTeacherAssignmentQuery(undefined, { skip: user.role !== "Teacher" });
    const { data: teacherClassList, isLoading: teacherClassesLoading } = useGetClassQuery(undefined, { skip: user.role !== "Teacher" });

    const { data: assignmentStats, isLoading: statsLoading, refetch: refetchStats } = useGetAssignmentStatsQuery(
        selectedAssignmentDetails?._id || selectedAssignmentDetails?.assignmentId, 
        { skip: !(selectedAssignmentDetails?._id || selectedAssignmentDetails?.assignmentId) }
    );

    useEffect(() => {
        if (!socket) return;

        const handleGraphUpdate = () => {
            if (selectedAssignmentDetails) {
                refetchStats(); 
            }
        };

        socket.on("task_submitted", handleGraphUpdate);
        socket.on("grade_updated", handleGraphUpdate);

        return () => {
            socket.off("task_submitted", handleGraphUpdate);
            socket.off("grade_updated", handleGraphUpdate);
        };
    }, [socket, selectedAssignmentDetails, refetchStats]);

    const selectedTeacherAssignments = teacherRes?.data?.filter(
        assignment => (typeof assignment.classId === 'object' ? assignment.classId._id : assignment.classId) === selectedClass
    ) || [];

    const handleAssignmentChange = (e) => {
        const assignmentId = e.target.value;
        const assignmentObj = selectedTeacherAssignments.find(a => a._id === assignmentId);
        setSelectedAssignmentDetails(assignmentObj || null);
    };

    if (teacherTasksLoading || teacherClassesLoading) return <Loading />;

   
    const statsData = assignmentStats?.data || [];
    const getCount = (status) => statsData.find(s => s._id === status)?.count || 0;
    
    const gradedCount = getCount("Graded");
    const submittedCount = getCount("Submitted") + gradedCount; 
    const pendingCount = getCount("To-Do") + getCount("In-Progress");

    // Semantic Colors based on Status
    const STATUS_COLORS = {
        "To-Do": "#94a3b8",       
        "In-Progress": "#f59e0b", 
        "Submitted": "#3b82f6",   
        "Graded": "#10b981"       
    };
    const fallbackColor = "#6366f1";

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
                                {assignment.title || assignment._id}
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
                                    <p className="text-sm font-medium text-slate-600 w-fit px-2.5 py-1 bg-slate-100 rounded-md mt-1">{selectedAssignmentDetails.subject}</p>
                                </div>
                                <div className="space-y-0.5 pt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                                    <p className="text-xs font-medium text-slate-500 line-clamp-3 leading-relaxed mt-1">{selectedAssignmentDetails.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Dynamic Metric Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60 space-y-1 relative overflow-hidden group hover:bg-blue-50 transition-all duration-300">
                                <div className="p-2 bg-white rounded-xl text-blue-500 w-fit border border-blue-100 shadow-sm relative z-10">
                                    <Send size={16}/>
                                </div>
                                <p className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider pt-2 relative z-10">Submissions</p>
                                <h3 className="text-3xl font-black text-blue-600 tracking-tight relative z-10">{submittedCount}</h3>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500"><Send size={80}/></div>
                            </div>

                            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/60 space-y-1 relative overflow-hidden group hover:bg-emerald-50 transition-all duration-300">
                                <div className="p-2 bg-white rounded-xl text-emerald-500 w-fit border border-emerald-100 shadow-sm relative z-10">
                                    <CheckCircle size={16}/>
                                </div>
                                <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider pt-2 relative z-10">Graded</p>
                                <h3 className="text-3xl font-black text-emerald-600 tracking-tight relative z-10">{gradedCount}</h3>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500"><CheckCircle size={80}/></div>
                            </div>

                            <div className="col-span-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/60 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl text-amber-500 border border-amber-100 shadow-sm">
                                        <Clock size={16}/>
                                    </div>
                                    <p className="text-[11px] font-bold text-amber-600/70 uppercase tracking-wider">Pending Tasks</p>
                                </div>
                                <h3 className="text-2xl font-black text-amber-600">{pendingCount}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] h-full flex flex-col">
                        <h4 className="font-bold text-slate-900 mb-8 tracking-tight text-sm flex items-center gap-2">
                            Submission Status Breakdown
                        </h4>
                        
                        {statsLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                                <span className="text-sm font-semibold tracking-wide">Loading Analytics...</span>
                            </div>
                        ) : statsData.length > 0 ? (
                            <div className="flex-1 min-h-75 w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis 
                                            dataKey="_id" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#64748b', fontSize: 11, fontFamily: 'Poppins', fontWeight: 600}} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94a3b8', fontSize: 11, fontFamily: 'Poppins'}} 
                                            allowDecimals={false}
                                        />
                                        <Tooltip cursor={{fill: '#f8fafc', radius: 8}} content={<CustomTooltip />} />
                                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={45} animationDuration={1000}>
                                            {statsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id] || fallbackColor} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium tracking-wide border-2 border-dashed border-slate-100 rounded-xl">
                                No data available for this assignment yet.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!selectedAssignmentDetails && (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200/80">
                    <div className="bg-slate-50 p-5 rounded-2xl mb-4 text-slate-300 border border-slate-100 shadow-sm">
                        <Layout size={36} strokeWidth={1.5} />
                    </div>
                    <p className="text-slate-400 text-sm font-semibold tracking-wide text-center px-4">Please select a class and assignment to view analytics.</p>
                </div>
            )}
        </div>
    );
}

export default TeacherGraph;