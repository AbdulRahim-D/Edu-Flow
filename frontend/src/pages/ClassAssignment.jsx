import React from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { useGetStudentAssignmentQuery, useGetTeacherAssignmentQuery } from '../services/taskAPI';
import AssignmentCard from '../components/AssignmentCard';

function ClassAssignment() {
    const user = useSelector(state => state.auth.user)
    const { id } = useParams() 
    
    const { data: studentAssignments, isLoading: studentAssignmentsLoading } = useGetStudentAssignmentQuery(undefined, {
        skip: user.role !== "Student"
    })
    const { data: teacherAssignments, isLoading: teacherAssignmentsLoading } = useGetTeacherAssignmentQuery(undefined, {
        skip: user.role !== "Teacher"
    })

    if (teacherAssignmentsLoading || studentAssignmentsLoading) return <Loading />

    const userAssignments = user.role === "Student" ? studentAssignments?.data : teacherAssignments?.data
    

    const classAssignments = userAssignments?.filter((assignment) => {
        const assignmentClassId = typeof assignment.classId === 'object' ? assignment.classId._id : assignment.classId;
        return assignmentClassId === id;
    })

    const isTeacher = user.role === "Teacher"

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {isTeacher ? "Class Submissions" : "My Class Assignments"}
            </h2>

            {classAssignments && classAssignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classAssignments.map(assignment => (
                        <AssignmentCard 
                            key={assignment._id} 
                            assignment={assignment} 
                            isTeacherView={isTeacher} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No assignments found for this class.</p>
                </div>
            )}
        </div>
    )
}

export default ClassAssignment