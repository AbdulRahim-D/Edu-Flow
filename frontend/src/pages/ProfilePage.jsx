import React, { useRef } from 'react';
import { useMyProfileQuery, useUpdateProfilePicMutation } from '../services/userAPI';
import Loading from '../components/Loading';
import { User, Mail, ShieldCheck, Camera, Edit2, Hash, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ProfilePage() {
  const { data, isLoading } = useMyProfileQuery();
  const [updateProfilePic, { isLoading: isUpdating }] = useUpdateProfilePicMutation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  if (isLoading) return <Loading />;
  const profile = data?.data;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("File size should be under 2MB !");

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await updateProfilePic(formData).unwrap();
      toast.success("Profile Picture is updated! 🔥");
    } catch (err) {
      toast.error(err?.data?.message || "file Uplaod is Failed!");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#FAFAFC] min-h-screen text-slate-800 font-['Poppins',sans-serif] selection:bg-blue-100">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Profile</h1>
            <p className="text-slate-400 text-sm mt-1.5 font-medium tracking-wide">Manage your academic identity and details.</p>
          </div>
          <button 
            className="group flex items-center gap-2 px-6 py-3.5 bg-blue-500 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
            onClick={() => navigate("/profile/updateprofile")}
          >
            <Edit2 size={16} className="group-hover:rotate-12 transition-transform duration-200" />
            <span>Update Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 👤 Left Avatar Column */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-center shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-md transition duration-500"></div>
              
              <div className="relative">
                <img 
                  src={profile?.profileImage ? `https://edu-flow-be.onrender.com${profile.profileImage}` : `https://ui-avatars.com/api/?name=${profile?.name}&background=3b82f6&color=fff&size=200`}
                  alt="Profile" 
                  className={`w-44 h-44 rounded-[2.2rem] object-cover border-4 border-white shadow-xl bg-white transition-all duration-300 ${isUpdating ? 'opacity-40 scale-95' : 'group-hover:scale-[1.01]'}`}
                />
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                
                <button 
                  disabled={isUpdating}
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 p-3 bg-white border border-slate-100 text-slate-600 rounded-xl shadow-xl hover:text-blue-500 hover:scale-105 transition-all active:scale-95 disabled:cursor-not-allowed"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center w-full">
              <h2 className="text-xl font-bold text-slate-900 truncate px-2">{profile?.name}</h2>
              
              <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
                <ShieldCheck size={13} strokeWidth={2.5} />
                <span>{profile?.role} Verified</span>
              </div>
            </div>
          </div>

          {/*  Right Information Details Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="flex items-center gap-2.5 mb-8">
                <div className="h-5 w-1 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Information Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <ModernField label="Full Legal Name" value={profile?.name} icon={<User size={16}/>} />
                <ModernField label="Primary Email" value={profile?.email} icon={<Mail size={16}/>} />
                <ModernField label="Contact Number" value={profile?.phone} icon={<Phone size={16}/>} />
                <ModernField label="System Reference ID" value={profile?._id} icon={<Hash size={16}/>} />
                <ModernField label="Account Status" value="Active User" icon={<CheckCircle2 size={16}/>} isSpecial />
                <ModernField label="Assigned Role" value={profile?.role} icon={<ShieldCheck size={16}/>} isSpecial />
              </div>
            </div>

            {/*  Footer Info Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-blue-50/30 border border-blue-100/50 rounded-2xl">
               <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[11px] font-bold uppercase tracking-widest">End-to-End Encrypted Sync</span>
               </div>
               <span className="text-[10px] font-bold text-blue-400 tracking-wider">EDU-FLOW CLOUD</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ModernField({ label, value, icon, isSpecial }) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block group-hover:text-blue-500 transition-colors duration-200">
        {label}
      </span>
      <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
        isSpecial 
          ? 'bg-blue-50/30 border-blue-100/70' 
          : 'bg-slate-50/50 border-slate-100 group-hover:bg-white group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-100/20'
      }`}>
        <div className={`p-2 rounded-xl transition-colors ${
          isSpecial 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-slate-400 group-hover:bg-blue-500 group-hover:text-white shadow-sm border border-slate-100/50'
        }`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold truncate ${isSpecial ? 'text-blue-600' : 'text-slate-700'}`}>
          {value || "Not Configured"}
        </span>
      </div>
    </div>
  );
}

export default ProfilePage;
