import getAndDecryptCookie from "@/app/lib/auth";
import API_ENDPOINTS from "../ApiRoutes/apiRoutes";
import axios, { AxiosResponse } from "axios";
const token = getAndDecryptCookie('AccessToken');
// const GOOGLE_MAPS_API_KEY = "AIzaSyBGQJdwHp1kT8NRP9rZ2RhqpBZsRAvXUkw";
const GOOGLE_MAPS_API_KEY = "AIzaSyCTZVUuZjiH91J4vEhrtLpIlGyk9QTrkJw";

interface UserData {
    attributes: {
        email: string;
        nickName: string;
        image: string;
        Id: string;
        friendRequest: boolean;
    };
}

interface ReportResponse {
    // Define the structure of the response data
    id: string;
    // Add other properties based on the response structure
}
interface SuccessResponse {
    data: UserData;
}
type Geolocation = {
    latitude: number;
    longitude: number;
    placeId: string;
    formattedAddress: string;
};

interface ErrorResponse {
    message: string;
    // You can define other error properties if necessary
}

interface PlaceAttributes {
    placeId: string;
    name: string;
    placeRatings?: {
        averageRating: number;
        numberOfRatings: number;
        percentages: number[];
        isRated: boolean;
        userRating: number;
    };
    types: string[];
    distance: number;
    images: string[];
    formattedAddress: string;
    openingHours?: {
        open_now: boolean;
        periods: { open: { time: string }; close: { time: string } }[];
    };
    website: string;
    url: string;
}
interface requestResponse {
    status: number;
    data: any;
}

interface ApiResponse {
    data: {
        map(arg0: (data: any) => { id: any; name: any; color: any; price: any; duration: any; }): TransformedSubscription[];
        data: {
            attributes: PlaceAttributes;
        };
    };
    status: number;
}

interface TransformedData {
    id: string;
    name: string;
    rating: number;
    totalRatings: number;
    type: string;
    distance: number;
    images: string[];
    address: string;
    open: boolean;
    openingTime?: string;
    closingTime?: string;
    website: string;
    url: string;
    ratingPercentage?: number[];
    isRated?: boolean;
    userRatings?: number;
}

interface TransformedSubscription {
    id: string;
    name: string;
    color: string;
    price: number;
    duration: string;
}

export const createHeaders = (token: string) => {
    const headers = new Headers();
    // headers.append("Origin", "*");
    // headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    return headers;
};
export const createRequestOptions = (method: string, headers: Headers, data?: any): RequestInit => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return {
        method: method,
        headers: headers,
        redirect: "follow",
        body: body || undefined,
    };
};


export const fetchApi = async (url: string, options: RequestInit) => {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Fetch API error:', error);
        throw error;
    }
};

export const getUserByEmail = async (email: string): Promise<SuccessResponse | ErrorResponse> => {
    return new Promise(async (resolve, reject) => {
        const url = `${API_ENDPOINTS.SEARCH_USER}/?email=${encodeURIComponent(email)}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                resolve({ data });
            } else if (response.status === 204) {
                // Resolve with an empty object or whatever is appropriate for your use case
                resolve({ data: {} as UserData });
            } else {
                const errorData = await response.json();
                reject(errorData);
            }
        } catch (error) {
            reject(error);
        }
    });
};





export const sendFriendRequest = async (receiverId: string) => {
    const url = `${API_ENDPOINTS.FRIEND_REQUEST}`;

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: { attributes: { receiverId: receiverId } }
                })
            });

            if (response.status === 201) {
                const data = await response.json();
                resolve(data);
            } else {
                const errorData = await response.json();
                reject(errorData);
            }
        } catch (error) {
            reject(error);
        }
    });
};








export const getLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};

export const getUserGeolocation = (): Promise<Geolocation> => {
    console.log('workingGeoLocation')
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject("Geolocation is not supported by this browser.");
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {

                    if (!GOOGLE_MAPS_API_KEY) {
                        return reject("Google Maps API Key is not set.");
                    }

                    const response = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
                    );

                    console.log('workingGeoLocatioResult', response.data)


                    if (response.data.status === 'OK') {
                        const placeId = response.data.results[0].place_id;
                        const formattedAddress = response.data.results[0].formatted_address;

                        resolve({
                            latitude,
                            longitude,
                            placeId,
                            formattedAddress,
                        });
                    } else {
                        reject("Failed to fetch place ID from Google Maps API.");
                    }
                } catch (error: any) {
                    reject(error.message);
                }
            },
            (error) => {
                reject(error.message + " Please go to settings and change permissions.");
            },
            { enableHighAccuracy: false, timeout: 25000, maximumAge: 3600000 }
        );
    });
};


export const getGooglePlacesResult = async (
    sort: string,
    search: string,
    latitude: any,
    longitude: any
) => {
    console.log('working')

    const url = `${API_ENDPOINTS.PLACES}?sort=${sort}&search=${search}&latitude=${latitude}&longitude=${longitude}`;
    console.log('url', url)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY, // Replace with your actual API key if needed
            },
        });
        const res = await response.json();

        console.log('checkGoogleReult', res)

        if (response.status === 200) {

            const transformedArray = res.data.map((data: {
                attributes: {
                    placeId: any; name: string; image: any; types: any[]; distance: any; openingHours: {
                        open_now: any; periods: {
                            open: any; close: { time: any; };
                        }[];
                    }; placeRatings: { averageRating: any; numberOfRatings: any; isRated: any; }; website: any;
                };
            }) => ({
                id: data?.attributes?.placeId,
                name: data?.attributes?.name,
                image: data?.attributes?.image,
                type: data?.attributes?.types[0],
                distance: data?.attributes?.distance,
                open: data?.attributes?.openingHours?.open_now,
                openingTime: data?.attributes?.openingHours?.periods[0]?.open.time,
                closingTime: data?.attributes?.openingHours?.periods[0]?.close?.time,
                rating: data?.attributes?.placeRatings?.averageRating || 0,
                totalRatings: data?.attributes?.placeRatings?.numberOfRatings || 0,
                isRated: data?.attributes?.placeRatings?.isRated,
                website: data?.attributes?.website,
            }));
            return transformedArray;
        } else if (response.status === 204) {
            return [];
        } else {
            const errorData = await response.json();
            throw new Error(errorData);
        }
    } catch (error) {
        throw error;
    }
};



export const getGooglePlacesById = async (
    placeId: string,
    latitude: number,
    longitude: number,
    token: string
): Promise<TransformedData> => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Goog-Api-Key", GOOGLE_MAPS_API_KEY);

        const requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch(
            `${API_ENDPOINTS.PLACES}/${placeId}?latitude=${latitude}&longitude=${longitude}`,
            requestOptions
        );

        const res: ApiResponse = await response.json();
        if (response.ok) {
            const attributes = res.data.data.attributes;

            const transformedData: TransformedData = {
                id: attributes.placeId,
                name: attributes.name,
                rating: attributes.placeRatings?.averageRating || 0,
                totalRatings: attributes.placeRatings?.numberOfRatings || 0,
                type: attributes.types[0],
                distance: attributes.distance || 0,
                images: attributes.images,
                address: attributes.formattedAddress,
                open: attributes.openingHours?.open_now || false,
                openingTime: attributes.openingHours?.periods[0]?.open?.time,
                closingTime: attributes.openingHours?.periods[0]?.close?.time,
                website: attributes.website,
                url: attributes.url,
                ratingPercentage: attributes.placeRatings?.percentages,
                isRated: attributes.placeRatings?.isRated,
                userRatings: attributes.placeRatings?.userRating,
            };

            return transformedData;
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error("Error in getGooglePlacesById:", error);
        throw error;
    }
};


export const postQuestion = async (values: any) => {
    try {
        const res = await axios.post(API_ENDPOINTS.QUESTIONS, values, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                Accept: 'multipart/form-data',

            },
        });

        if (res.status === 201) {
            return res.data;
        } else {
            throw new Error('Failed to post question');
        }
    } catch (error) {
        // Check if error is of type AxiosError
        if (axios.isAxiosError(error)) {
            // Use error.response?.data safely
            throw new Error(error.response?.data || 'Failed to post question');
        } else {
            throw new Error('Failed to post question');
        }
    }
};


export const getDiscussions = async (id: string) => {
    try {
        const res = await axios.get(`${API_ENDPOINTS.DISCUSSIONS}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass token in headers
            },
        });
        if (res.status === 200) {
            return res.data;
        } else if (res?.status === 204) {
            return res;
        } else {
            throw new Error('Failed to get discussions');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data || 'Failed to get discussions');
        } else {
            throw new Error('Failed to get discussions');
        }
    }
};


export const getAllSubscriptions = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res: AxiosResponse<ApiResponse> = await axios.get(API_ENDPOINTS.SUBSCRIPTIONS, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const transformedArray: TransformedSubscription[] = res?.data?.data?.map((data: any) => ({
                    id: data.id,
                    name: data.attributes.name,
                    color: data.attributes.color,
                    price: data.attributes.price,
                    duration: data.attributes.duration,
                }));

                return resolve(transformedArray);
            } else if (res.status === 204) {
                resolve([]);
            } else {
                reject(res.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || 'Failed to get Subscription Data');
            } else {
                throw new Error('Failed to get Subscription Data');
            }
        }
    });
};


export const reportAccount = async (userId: string, reason: string): Promise<ReportResponse> => {
    const url = API_ENDPOINTS.REPORT_ACCOUNT;

    try {
        const response = await axios.post(url, {
            data: { attributes: { userId, reason } },
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 201 || response.status === 400) {
            return response.data as ReportResponse;
        } else {
            throw new Error('Failed to report account');
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data && error.response.data.error) {
                // Handle specific error cases from the API
                throw new Error(error.response.data.error[0].title);
            } else {
                throw new Error(error.message || 'Failed to report account');
            }
        } else {
            throw new Error('Failed to report account');
        }
    }
};


export const getCommunityPostById = async (postId: string) => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.POSTS}/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const transformedData = {
                id: response.data.data[0]?.id,
                text: response.data.data[0]?.attributes?.text,
                likes: response.data.data[0]?.attributes?.likes,
                comments: response.data.data[0]?.attributes?.comments,
                userId: response.data.data[0]?.attributes?.userId,
                createdAt: response.data.data[0]?.attributes?.createdAt,
                image:
                    response.data.data[0]?.attributes?.image ||
                    response.data.data[0]?.attributes?.attachment,
                isLiked: response.data.data[0]?.attributes?.isLiked,
            };
            return transformedData;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        throw error;
    }
};