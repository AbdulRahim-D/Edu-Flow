import React, { useEffect } from 'react'
import { useGetClassQuery } from '../services/classAPI'
import { useDispatch } from 'react-redux';
import { setClasses } from '../features/classSlice';
import Loading from '../components/Loading';

function TeacherDashboard() {

  const {data,isLoading}=useGetClassQuery();
  console.log(data?.data);
  
  const dispatch=useDispatch();
    useEffect(()=>{
  dispatch(setClasses(data));    
  },[data,dispatch])
  if(isLoading) return <Loading/>
  return (
    <div> 
      <h1 className='text-3xl font-medium text-center text-blue-400'>Teacher Dashboard</h1>
      <h2 className='text-center text-blue-300'>Overall Details</h2>
      <div className="h-fit w-26 border-2 text-center box-border rounded-md p-2 align-middle"><h3 className='text-2xl'>{data?.data?.length}</h3><p className='text-sm'>Total Classes</p></div>     
    </div>
  )
}

export default TeacherDashboard
