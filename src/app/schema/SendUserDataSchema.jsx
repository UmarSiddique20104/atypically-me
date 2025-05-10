import * as Yup from 'yup';

export const SendUserDataSchema = Yup.object().shape({
    fname: Yup.string().required('First name is required'),
    lname: Yup.string().required('Last name is required'),
    Nname: Yup.string().required('Nick name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
});
