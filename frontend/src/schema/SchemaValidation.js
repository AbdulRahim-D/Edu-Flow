import * as Yup from "yup";

export const signupSchema = Yup.object({
  name: Yup.string()
    .min(3, "name should be atleast 3 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("give a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password should be atleast 6 characters")
    .required("Password is required"),
    

});

export const loginSchema = Yup.object({
  email: Yup.string().email("enter Valid Email").required("Email is Required"),
  password: Yup.string().required("Password is Required"),
});
