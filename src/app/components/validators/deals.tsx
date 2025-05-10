import React from 'react';
import { showMessage } from '../reuseables/Notification';

interface ValidationProps {
    discount: any;
    offer: string;
    dealNumber: string;
    title: string;
}

const validateFormData = (data: ValidationProps, image: any): boolean => {

    const validateFormData = (): boolean => {
        if (!data?.discount) {
            showMessage('Discount field is required', "error");
            return false;
        }
        if (!data?.offer) {
            showMessage('Offer field is required', "error");
            return false;
        }
        if (!data?.dealNumber) {
            showMessage('Deal Number field is required', "error");
            return false;
        }
        if (!data.title) {
            showMessage('Title field is required', "error");
            return false;
        }
        if (!image) {
            showMessage('Deal Image field is required', "error");
            return false;
        }
        return true;
    };

    const isValid = validateFormData();

    return isValid;
};

export default validateFormData;