import { useFormik } from "formik";
import React from "react";
import { signupSchema } from "../schema/SchemaValidation";
import { useSignupMutation } from "../services/authAPI";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
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
        toast.success(res.message);
        navigate("/login")

      } catch (error) {
        toast.error("something went wrong")

      }

    },
  });
  return (
    <div className="flex-1">
      <div><Toaster /></div>
      <form onSubmit={signupForm.handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          {...signupForm.getFieldProps("name")}
        />
        {signupForm.touched.name && signupForm.errors.name && <span>{signupForm.errors.name}</span>}
        <br />
        <input
          type="password"
          placeholder="Enter Password"
          {...signupForm.getFieldProps("password")}
        />
        {signupForm.touched.password && signupForm.errors.password && <span>{signupForm.errors.password}</span>}
        <br />
        <input
          type="email"
          placeholder="enter yor email"
          {...signupForm.getFieldProps("email")}
        />
        {signupForm.touched.email && signupForm.errors.email && <span>{signupForm.errors.email}</span>}
        <br />
        <label>
          <input
            type="radio"
            name="role"
            value="Teacher"
            onChange={signupForm.handleChange}
            onBlur={signupForm.handleBlur}
            checked={signupForm.values.role === "Teacher"}
          />
          Teacher
        </label>

        <label>
          <input
            type="radio"
            name="role"
            value="Student"
            onChange={signupForm.handleChange}
            onBlur={signupForm.handleBlur}
            checked={signupForm.values.role === "Student"}
          />
          Student
        </label>
        {signupForm.touched.role && signupForm.errors.role && (
          <span style={{ color: "red" }}>{signupForm.errors.role}</span>
        )}
        <br />
        <button type="submit" disabled={isLoading}>{isLoading ? "Please wait..." : "Create Account"}</button>
      </form>

    </div>
  );
}

export default Signup;
