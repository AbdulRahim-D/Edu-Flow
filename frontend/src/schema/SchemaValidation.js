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


export const assignmentSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  subject: Yup.string().required("Subject is required"),
  deadline: Yup.date()
    .min(new Date(), "Deadline cannot be in the past")
    .required("Deadline is required"),
});