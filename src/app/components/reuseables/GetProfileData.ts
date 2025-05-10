// hooks/useTemplatesData.ts
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { saveDealsList, setError, setLoading } from '@/app/redux/templatesDataSlice';
import { createHeaders, createRequestOptions, fetchApi } from '../utils/Helper';
import API_ENDPOINTS from '../ApiRoutes/apiRoutes';
import getAndDecryptCookie from '@/app/lib/auth';
const token = getAndDecryptCookie('AccessToken');
const userId = getAndDecryptCookie('Id');
const GetProfileData = () => {
    const dispatch = useDispatch();

    const GetTemplatesData = useCallback(async () => {
        dispatch(setLoading(true));
        const headers = createHeaders(token ? token : "");
        const requestOptions = createRequestOptions("GET", headers);
        const url = `${API_ENDPOINTS.TemplatesDeals}/${userId}`;
        try {
            const result = await fetchApi(url, requestOptions);
            handleApiResponse(result);
        } catch (error) {
            console.error('GetDeals error:', error);
            dispatch(setError('Failed to fetch template data.'));
        }
    }, [token, userId]);

    const handleApiResponse = (result: any) => {
        if (result?.success && result?.status === 200) {
            dispatch(setLoading(false));
            dispatch(saveDealsList(result?.data)); // Dispatch saveDealsList action with the 'deals' data from API response
        } else {
            console.error('API Response Error:', result);
            dispatch(setError(result?.message || 'Unknown error occurred.'));
        }
    };

    return { GetTemplatesData };
};

export default GetProfileData;
