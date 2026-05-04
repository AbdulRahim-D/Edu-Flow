import { useFormik } from "formik";
import React from "react";
import { useLoginMutation } from "../services/authAPI";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate ,Link} from "react-router-dom";
import { loginSchema } from "../schema/SchemaValidation";

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
            role: res.role
        };
        dispatch(setCredentials(userData));
        toast.success(res.message);
        
        navigate(
            res.role === "Teacher"
            ? "/teacher_dashboard"
            : "/student_dashboard",
        );
      } catch (error) {
        toast.error("something went wrong");
      }
    },
  });
  return (
    <div>
      <div>
        <Toaster />
      </div>

      <form onSubmit={loginForm.handleSubmit}>
        <input
          type="email"
          placeholder="enter your email"
          {...loginForm.getFieldProps("email")}
        />
        {loginForm.touched.email && loginForm.errors.email && (
          <span>{loginForm.errors.email}</span>
        )}
        <br />
        <input
          type="password"
          placeholder="enter your password"
          {...loginForm.getFieldProps("password")}
        />
        {loginForm.touched.password && loginForm.errors.password && (
          <span>{loginForm.errors.password}</span>
        )}
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : "Login"}
        </button>
      </form>
      <h3>Don't Have Account? <Link to="/signup">SignUp</Link> </h3>
    </div>
  );
}

export default Login;
