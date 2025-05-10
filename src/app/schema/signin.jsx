import * as Yup from "yup";
export const LoginSchema = Yup.object({
    email: Yup.string().email().required("Please enter your email").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'),
    Password: Yup.string().min(8).required("Please enter your password"),
});