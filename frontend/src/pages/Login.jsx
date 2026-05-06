import { useFormik } from "formik";
import React from "react";
import { useLoginMutation } from "../services/authAPI";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../schema/SchemaValidation";
import { Lock, Mail, Loader2 } from "lucide-react"; // Icons kosam

function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Edu-Flow</h1>
          <p className="text-slate-500 font-medium">Welcome back! Please login to your account.</p>
        </div>

        <form className="space-y-6" onSubmit={loginForm.handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all duration-200 ${
                  loginForm.touched.email && loginForm.errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
                {...loginForm.getFieldProps("email")}
              />
            </div>
            {loginForm.touched.email && loginForm.errors.email && (
              <p className="mt-1 text-xs font-medium text-red-500">{loginForm.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all duration-200 ${
                  loginForm.touched.password && loginForm.errors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
                {...loginForm.getFieldProps("password")}
              />
            </div>
            {loginForm.touched.password && loginForm.errors.password && (
              <p className="mt-1 text-xs font-medium text-red-500">{loginForm.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Authenticating...</span>
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;