import { useFormik } from "formik";
import React from "react";
import { signupSchema } from "../schema/SchemaValidation";
import { useSignupMutation } from "../services/authAPI";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { User, Mail, Lock, UserCircle, Loader2, ArrowRight } from "lucide-react";

function Signup() {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (userDetails) => {
      try {
        const res = await signup(userDetails).unwrap();
        toast.success(res.message || "Account created successfully!");
        navigate("/login");
      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center p-6 selection:bg-blue-100 font-['Poppins',sans-serif]">
      <Toaster position="top-center" />

      <div className="max-w-md w-full">
        {/* Top Header Context */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white border border-slate-200/60 rounded-2xl shadow-sm mb-4">
            <span className="text-blue-500 font-extrabold text-xl tracking-tight">E</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Get Started</h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium tracking-wide">
            Create your account to join <span className="text-blue-500 font-semibold">Edu-Flow</span>
          </p>
        </div>

        {/* Signup Card Container */}
        <div className="bg-white rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.03)] p-10 border border-slate-100">
          <form className="space-y-5" onSubmit={signupForm.handleSubmit}>
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors duration-200">
                  <User size={18} strokeWidth={2} />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border rounded-2xl outline-none transition-all duration-200 text-sm font-medium placeholder:text-slate-300 text-slate-900 ${
                    signupForm.touched.name && signupForm.errors.name
                      ? "border-red-200 bg-red-50/40 focus:ring-4 focus:ring-red-50"
                      : "border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                  {...signupForm.getFieldProps("name")}
                />
              </div>
              {signupForm.touched.name && signupForm.errors.name && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-1">{signupForm.errors.name}</p>
              )}
            </div>

            {/* Email Address Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors duration-200">
                  <Mail size={18} strokeWidth={2} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border rounded-2xl outline-none transition-all duration-200 text-sm font-medium placeholder:text-slate-300 text-slate-900 ${
                    signupForm.touched.email && signupForm.errors.email
                      ? "border-red-200 bg-red-50/40 focus:ring-4 focus:ring-red-50"
                      : "border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                  {...signupForm.getFieldProps("email")}
                />
              </div>
              {signupForm.touched.email && signupForm.errors.email && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-1">{signupForm.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors duration-200">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border rounded-2xl outline-none transition-all duration-200 text-sm placeholder:text-slate-300 text-slate-900 ${
                    signupForm.touched.password && signupForm.errors.password
                      ? "border-red-200 bg-red-50/40 focus:ring-4 focus:ring-red-50"
                      : "border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                  {...signupForm.getFieldProps("password")}
                />
              </div>
              {signupForm.touched.password && signupForm.errors.password && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-1">{signupForm.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Register as
              </label>
              <div className="grid grid-cols-2 gap-4">
                
                <label className={`flex flex-col items-center justify-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 active:scale-95 ${
                  signupForm.values.role === "Teacher" 
                    ? "border-blue-500 bg-blue-50/40 text-blue-500 shadow-md shadow-blue-50/50" 
                    : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="Teacher"
                    className="hidden"
                    onChange={signupForm.handleChange}
                  />
                  <UserCircle size={22} className="mb-1.5" strokeWidth={2} />
                  <span className="text-xs font-bold tracking-wide">Teacher</span>
                </label>

                <label className={`flex flex-col items-center justify-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 active:scale-95 ${
                  signupForm.values.role === "Student" 
                    ? "border-blue-500 bg-blue-50/40 text-blue-500 shadow-md shadow-blue-50/50" 
                    : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="Student"
                    className="hidden"
                    onChange={signupForm.handleChange}
                  />
                  <UserCircle size={22} className="mb-1.5" strokeWidth={2} />
                  <span className="text-xs font-bold tracking-wide">Student</span>
                </label>

              </div>
              {signupForm.touched.role && signupForm.errors.role && (
                <p className="text-xs font-medium text-red-500 text-center mt-1">{signupForm.errors.role}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:bg-blue-500 active:scale-[0.98] tracking-wide text-sm mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-bold hover:text-blue-600 transition-colors ml-1">
                Log In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;