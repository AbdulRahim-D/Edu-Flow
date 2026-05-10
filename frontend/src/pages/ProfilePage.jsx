import React, { useRef } from 'react';
import { useMyProfileQuery, useUpdateProfilePicMutation } from '../services/userAPI';
import Loading from '../components/Loading';
import { User, Mail, ShieldCheck, Camera, Edit2, Hash, Phone, Loader2 } from 'lucide-react';
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
    <div className="p-6 md:p-12 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans selection:bg-indigo-100">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Account Profile</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your academic identity and details.</p>
          </div>
          <button 
            className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            onClick={() => navigate("/profile/updateprofile")}
          >
            <Edit2 size={18} className="group-hover:rotate-12 transition-transform" />
            Update Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative">
                <img 
                  src={profile?.profileImage ? `http://localhost:6142${profile.profileImage}` : `https://ui-avatars.com/api/?name=${profile?.name}&background=6366f1&color=fff&size=200`}
                  alt="Profile" 
                  className={`w-48 h-52 rounded-[32px] object-cover border-[6px] border-white shadow-2xl bg-white transition-all duration-500 ${isUpdating ? 'opacity-40 scale-95' : 'group-hover:scale-[1.02]'}`}
                />
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                <button 
                  disabled={isUpdating}
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 p-3.5 bg-white border border-slate-100 rounded-2xl shadow-2xl text-indigo-600 hover:scale-110 transition-transform active:scale-90 disabled:cursor-not-allowed"
                >
                  {isUpdating ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-2xl font-black text-slate-900">{profile?.name}</h2>
              <div className={`mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[1.5px] border shadow-sm ${profile?.role === 'Teacher' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                <ShieldCheck size={14} />
                {profile?.role} Verified
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-6 w-1.5 bg-indigo-600 rounded-full"></div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Information Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                <ModernField label="Full Legal Name" value={profile?.name} icon={<User size={18}/>} />
                <ModernField label="Primary Email" value={profile?.email} icon={<Mail size={18}/>} />
                <ModernField label="Contact Number" value={profile?.phone} icon={<Phone size={18}/>} />
                <ModernField label="System Reference ID" value={profile?._id} icon={<Hash size={18}/>} />
                <ModernField label="Account Status" value="Active User" icon={<ShieldCheck size={18}/>} isSpecial />
                <ModernField label="Assigned Role" value={profile?.role} icon={<ShieldCheck size={18}/>} isSpecial />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between px-8 py-5 bg-indigo-50/50 border border-indigo-100 rounded-3xl">
               <div className="flex items-center gap-3 text-indigo-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[11px] font-black uppercase tracking-widest">End-to-End Encrypted Sync</span>
               </div>
               <span className="text-[10px] font-bold text-indigo-300">SWIFT-TASK CLOUD</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ModernField({ label, value, icon, isSpecial }) {
  return (
    <div className="flex flex-col gap-2.5 group">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 group-hover:text-indigo-500 transition-colors">{label}</span>
      <div className={`flex items-center gap-4 p-4 rounded-[22px] border transition-all duration-300 ${isSpecial ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50/50 border-slate-100 group-hover:bg-white group-hover:border-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-100/20'}`}>
        <div className={`p-2.5 rounded-xl transition-colors ${isSpecial ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white shadow-sm'}`}>
          {icon}
        </div>
        <span className={`text-[15px] font-bold truncate ${isSpecial ? 'text-indigo-700' : 'text-slate-700'}`}>
          {value || "Not Configured"}
        </span>
      </div>
    </div>
  );
}

export default ProfilePage;