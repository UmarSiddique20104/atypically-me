import * as Yup from "yup";

export const BusinessSchema = Yup.object().shape({
    bname: Yup.string().min(3, 'Business name must be at least 3 characters long').required('Business name is required'), 
    contactno: Yup.string().min(3, 'Contact number must be at least 3 characters long').required('Contact is required'),
    email: Yup.string()
        .email('Invalid email')
        .matches(/^[^\s@]+@[^\s@]+.[^\s@]+$/, 'Email must contain a dot before the domain')
        .required('Email is required'),
    Password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
        .required("Please enter your password"),
    CPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("Password"), null], "Passwords must match"), 
});