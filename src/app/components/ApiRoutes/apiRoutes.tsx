

export const BASE_URL = 'https://staging.atypicallyme.com';
// export const BASE_URL = 'http://localhost:3000';

type API_ENDPOINTS = {
    LOGIN: string;
    FORGET_PASSWORD: string;
    NEW_PASSWORD: string;
    REGISTRATION: string;
    CHANGE_PASSWORD: string;

    GET_CODE: string;
    GETDEALS: string;
    CREATEDEALS: string;
    UPDATEDEAL: string;
    DELETEDEAL: string;

    // Categories
    GETCATEGORY: string;

    // Profile
    EDITPROFILE: string;
    GETSINGLEPROFILE: string

    //User-Review
    GetSingleUserReviews: string

    //Templates
    TemplatesDeals: string
    SendTamplatesNumber: string
    GetTemplatesNumber: string

    // userSide
    GET_USERTOPICS: string;
    GET_USERCHALLENGES: string;
    GET_ALLBUSINESS_USER: string;
    GET_ALLBUSINESS_USER_DETAILS: string;
    GET_USER_PROFILE: string;

    //Notifications
    GETNOTI: string;
    FRIEND_REQUEST: string;
    SEARCH_USER: string;

    //GooglePlaces
    PLACES: string;
    RATINGS: string,
    QUESTIONS: string,
    DISCUSSIONS: string,

    POST_REVIEW_FOR_BUSINESS: string,
    POST_SUGGESTION_FOR_BUSINESS: string,
    GET_CHALLANGES: string,
    POST_CHALLANGES: string,
    GETUSER_CHALLANGES: string,
    GET_PRIVACYPOLICY: string,

    SUBSCRIPTIONS: string,
    GOOGLELOGIN: string
    FACEBOOKLOGIN: string
    SOCIALLOGIN: string

    SUPPORT: string
    GET_TERMSCONDITION: string
    FAQS: string
    ABOUT: string
    DELETE_ACCOUNT: string

    // Chat
    GET_CHANNELS: string;
    GET_CONVERSATIONS: string;
    UPLOAD_PHOTO: string;
    LIKE_POST: string;
    SHARE_POST: string;
    GET_COMMENTS: string;
    USERUPLOADPROFILE: string;
    REPORT_ACCOUNT: string;
    GET_MESSAGES: string;
    POSTS: string;

};

const API_ENDPOINTS = {
    REGISTRATION: BASE_URL + "/api/v1/register",
    LOGIN: BASE_URL + '/api/v1/auth',
    FORGET_PASSWORD: BASE_URL + "/api/v1/auth",
    NEW_PASSWORD: BASE_URL + "/api/v1/auth",
    FACEBOOKLOGIN: BASE_URL + "/api/v1/auth/social/facebook",
    SOCIALLOGIN: BASE_URL + "/api/v1/auth/social/google-send-user-data",
    GOOGLELOGIN: BASE_URL + "/api/v1/auth/social/google",
    CHANGE_PASSWORD: BASE_URL + "/api/v1/auth",

    GET_CODE: BASE_URL + "/api/v1/auth/",
    GETDEALS: BASE_URL + "/api/v1/getDeals",
    CREATEDEALS: BASE_URL + "/api/v1/createDeals",
    UPDATEDEAL: BASE_URL + "/api/v1/updateDeal",
    DELETEDEAL: BASE_URL + "/api/v1/deleteDeals",

    // Categories
    GETCATEGORY: BASE_URL + "/api/v1/category/getCategories",

    // Profile
    EDITPROFILE: BASE_URL + "/api/v1/edit-profile",
    GETSINGLEPROFILE: BASE_URL + "/api/v1/get-single-profileData",

    //User-Review
    GetSingleUserReviews: BASE_URL + "/api/v1/get-reviews-single-user",

    //Templates
    TemplatesDeals: BASE_URL + "/api/v1/getUserData/next-page=1",
    SendTamplatesNumber: BASE_URL + "/api/v1/create-templete-number",
    GetTemplatesNumber: BASE_URL + "/api/v1/get-templete-number-single-user",

    // userSide 
    GET_USERTOPICS: BASE_URL + "/api/v1/topics",
    GET_USERCHALLENGES: BASE_URL + "/api/v1/challenges",
    GET_ALLBUSINESS_USER: BASE_URL + "/api/v1/get-all-business-users",
    GET_ALLBUSINESS_USER_DETAILS: BASE_URL + "/api/v1/getUserData/next-page=1/",

    POST_REVIEW_FOR_BUSINESS: BASE_URL + "/api/v1/create-reviews-user/",
    POST_SUGGESTION_FOR_BUSINESS: BASE_URL + "/api/v1/business-suggestion",
    GET_CHALLANGES: BASE_URL + "/api/v1/challenges",
    POST_CHALLANGES: BASE_URL + "/api/v1/userChallenges",
    GETUSER_CHALLANGES: BASE_URL + "/api/v1/userChallenges",
    GET_PRIVACYPOLICY: BASE_URL + "/api/v1/privacyPolicies",
    GET_TERMSCONDITION: BASE_URL + "/api/v1/termAndCondition",
    ABOUT: BASE_URL + "/api/v1/about",

    GET_USER_PROFILE: BASE_URL + "/api/v1/profile",

    //Notifications
    GETNOTI: BASE_URL + "/api/v1/notifications",
    FRIEND_REQUEST: BASE_URL + "/api/v1/friendRequests",

    SEARCH_USER: BASE_URL + "/api/v1/searchUser",

    //Places
    PLACES: BASE_URL + "/api/v1/places",
    RATINGS: BASE_URL + "/api/v1/RATINGS",
    QUESTIONS: BASE_URL + "/api/v1/questions",
    DISCUSSIONS: BASE_URL + "/api/v1/discussions",
    SUBSCRIPTIONS: BASE_URL + "/api/v1/subscriptions",
    SUPPORT: BASE_URL + "/api/v1/support",
    FAQS: BASE_URL + "/api/v1/faqs",


    DELETE_ACCOUNT: BASE_URL + "/api/v1/auth/delete-account",


    // Chat
    GET_CHANNELS: BASE_URL + "/api/v1/channels",
    GET_CONVERSATIONS: BASE_URL + "/api/v1/conversations",
    GET_MESSAGES: BASE_URL + "/api/v1/conversations",
    UPLOAD_PHOTO: BASE_URL + "/api/v1/upload",
    LIKE_POST: BASE_URL + "/api/v1/likes",
    SHARE_POST: BASE_URL + "/api/v1/shares",
    GET_COMMENTS: BASE_URL + "/api/v1/posts",

    USERUPLOADPROFILE: BASE_URL + "/api/v1/profile",

    REPORT_ACCOUNT: BASE_URL + "/api/v1/report",
    BLOCK_ACCOUNT: BASE_URL + "/api/v1/block",

    POSTS: BASE_URL + "/api/v1/posts",


};

export default API_ENDPOINTS;

