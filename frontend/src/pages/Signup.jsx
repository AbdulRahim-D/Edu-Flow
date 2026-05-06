import { useFormik } from "formik";
import React from "react";
import { signupSchema } from "../schema/SchemaValidation";
import { useSignupMutation } from "../services/authAPI";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { User, Mail, Lock, UserCircle, Loader2 } from "lucide-react"; // Icons

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Edu-Flow</h1>
          <p className="text-slate-500 font-medium">Join us! Create your account today.</p>
        </div>

        <form className="space-y-5" onSubmit={signupForm.handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all ${
                  signupForm.touched.name && signupForm.errors.name ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
                {...signupForm.getFieldProps("name")}
              />
            </div>
            {signupForm.touched.name && signupForm.errors.name && (
              <p className="mt-1 text-xs text-red-500 font-medium">{signupForm.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all ${
                  signupForm.touched.email && signupForm.errors.email ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
                {...signupForm.getFieldProps("email")}
              />
            </div>
            {signupForm.touched.email && signupForm.errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">{signupForm.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all ${
                  signupForm.touched.password && signupForm.errors.password ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
                {...signupForm.getFieldProps("password")}
              />
            </div>
            {signupForm.touched.password && signupForm.errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">{signupForm.errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Register as</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${signupForm.values.role === "Teacher" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"}`}>
                <input
                  type="radio"
                  name="role"
                  value="Teacher"
                  className="hidden"
                  onChange={signupForm.handleChange}
                />
                <UserCircle size={24} className="mb-1" />
                <span className="text-sm font-bold">Teacher</span>
              </label>

              <label className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${signupForm.values.role === "Student" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"}`}>
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  className="hidden"
                  onChange={signupForm.handleChange}
                />
                <UserCircle size={24} className="mb-1" />
                <span className="text-sm font-bold">Student</span>
              </label>
            </div>
            {signupForm.touched.role && signupForm.errors.role && (
              <p className="mt-2 text-xs text-red-500 text-center font-medium">{signupForm.errors.role}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;