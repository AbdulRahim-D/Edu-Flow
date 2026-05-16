import React, { useEffect } from "react";
import { useFormik } from "formik";
import {
  useUpdateProfileMutation,
  useMyProfileQuery,
} from "../services/userAPI";
import toast, { Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import { User, Phone, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading: fetchLoading } = useMyProfileQuery();
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateProfileMutation();

  const profile = profileData?.data;

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    onSubmit: async (values) => {
      try {
        await updateProfile(values).unwrap();
        toast.success("Profile updated successfully!");
        setTimeout(() => navigate("/profile"), 1500);
      } catch (error) {
        toast.error(error.data?.message || "Update failed!");
      }
    },
  });

  useEffect(() => {
    if (profile) {
      formik.setValues({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  if (fetchLoading) return <Loading />;

  return (
    <div className="p-6 md:p-10 bg-[#FAFAFC] min-h-screen font-['Poppins',sans-serif] text-slate-800 antialiased selection:bg-blue-100">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "#0F172A",
            color: "#F8FAFC",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "500",
          }
        }}
      />

      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-500 font-semibold text-sm mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Profile</span>
        </button>

        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Update Profile
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium tracking-wide">
            Keep your account information accurate and up to date.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors duration-200">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 text-sm font-medium text-slate-800 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors duration-200">
                  <Phone size={18} />
                </div>
                <input
                  name="phone"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  placeholder="Enter 10-digit number"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 text-sm font-medium text-slate-800 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={updateLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 active:scale-[0.99] transition-all duration-200 shadow-xl shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {updateLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Save Updates</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-3.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all active:scale-[0.99]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;