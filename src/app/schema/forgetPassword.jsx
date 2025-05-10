import * as Yup from "yup";
export const ForgetSchema = Yup.object({
    email: Yup.string().email().required("Please enter your email"), 
});
