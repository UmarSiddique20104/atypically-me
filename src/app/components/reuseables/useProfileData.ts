import getAndDecryptCookie from '@/app/lib/auth';
import API_ENDPOINTS from '../ApiRoutes/apiRoutes';
import { createHeaders, createRequestOptions, fetchApi } from '../utils/Helper';

const getProfileData = async () => {
    const token = getAndDecryptCookie('AccessToken');
    const userId = getAndDecryptCookie('Id');

    const headers = createHeaders(token ?? "");
    const requestOptions = createRequestOptions("GET", headers);
    const url = `${API_ENDPOINTS.GETSINGLEPROFILE}/${userId}`;

    try {
        const result = await fetchApi(url, requestOptions);
        return result;
    } catch (error) {
        console.error('Get Profile Data error:', error);
        throw error;
    }
};

export default getProfileData;