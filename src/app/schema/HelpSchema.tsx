import * as Yup from "yup";
export const HelpSchema = Yup.object({
    email: Yup.string().email().required("Please enter your email"),
    subject: Yup.string().required("Please enter a subject"),
    details: Yup.string().required("Please enter description"),
});
