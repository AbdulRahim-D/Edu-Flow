import React, { useEffect } from "react";
import { useFormik } from "formik";
import {
  useUpdateProfileMutation,
  useMyProfileQuery,
} from "../services/userAPI";
import toast, { Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import { User, Phone, CheckCircle, ArrowLeft } from "lucide-react";
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

  // Data fetch ayyaka form fields ni current values tho fill cheyadam
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
    <div className="p-8 bg-white min-h-screen">
      <Toaster />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Profile
      </button>

      <div className="max-w-xl mx-auto">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Update Profile
          </h1>
          <p className="text-slate-500 font-medium">
            Keep your account information accurate and up to date.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div className="flex flex-col gap-2 group">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[2.5px] ml-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <User size={20} />
              </div>
              <input
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-2 group">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[2.5px] ml-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Phone size={20} />
              </div>
              <input
                name="phone"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.phone}
                placeholder="Enter 10-digit number"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={updateLoading}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100 disabled:opacity-70"
            >
              {updateLoading ? (
                "Saving Changes..."
              ) : (
                <>
                  <CheckCircle size={22} />
                  Save Updates
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                navigate("/profile");
              }}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
