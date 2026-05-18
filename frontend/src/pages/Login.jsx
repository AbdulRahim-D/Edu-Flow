import { useFormik } from "formik";
import React, { useState } from "react";
import { useLoginMutation } from "../services/authAPI";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../schema/SchemaValidation";
import { Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (userCreds) => {
      try {
        const res = await login(userCreds).unwrap();
        const userData = {
          id: res.id,
          name: res.name,
          email: res.email,
          role: res.role,
        };
        dispatch(setCredentials(userData));
        toast.success(res.message || "Login Successful!");

        navigate(
          res.role === "Teacher" ? "/teacher_dashboard" : "/student_dashboard"
        );
      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center p-6 selection:bg-blue-100 font-['Poppins',sans-serif]">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="max-w-md w-full">
        {/* ✨ Top Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white border border-slate-200/60 rounded-2xl shadow-sm mb-4">
            <span className="text-blue-500 font-extrabold text-xl tracking-tight">E</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium tracking-wide">
            Simplify your workflow with <span className="text-blue-500 font-semibold">Edu-Flow</span>
          </p>
        </div>

        
        <div className="bg-white rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.03)] p-10 border border-slate-100">
          <form className="space-y-6" onSubmit={loginForm.handleSubmit}>
            
            {/* Email Field */}
            <div className="space-y-2">
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
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50/50 border rounded-2xl outline-none transition-all duration-200 text-sm font-medium placeholder:text-slate-300 text-slate-900 ${
                    loginForm.touched.email && loginForm.errors.email
                      ? "border-red-200 bg-red-50/40 focus:ring-4 focus:ring-red-50"
                      : "border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                  {...loginForm.getFieldProps("email")}
                />
              </div>
              {loginForm.touched.email && loginForm.errors.email && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-1">
                  {loginForm.errors.email}
                </p>
              )}
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors duration-200">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? "text" : "password"} // ✨ Dynamic Type
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 bg-slate-50/50 border rounded-2xl outline-none transition-all duration-200 text-sm placeholder:text-slate-300 text-slate-900 ${
                    loginForm.touched.password && loginForm.errors.password
                      ? "border-red-200 bg-red-50/40 focus:ring-4 focus:ring-red-50"
                      : "border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                  {...loginForm.getFieldProps("password")}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
              {loginForm.touched.password && loginForm.errors.password && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-1">
                  {loginForm.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:bg-blue-500 active:scale-[0.98] tracking-wide text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

        
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 font-bold hover:text-blue-600 transition-colors ml-1">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;