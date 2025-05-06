// config/apiConfig.js

const isLocalhost = window.location.hostname === 'localhost';

export const API_URLS = {
    DATA_API: isLocalhost
        ? process.env.REACT_APP_DATA_LOCAL_API
        : process.env.REACT_APP_DATA_SERVER_API,

    INIT_API: isLocalhost
        ? process.env.REACT_APP_INIT_LOCAL_API
        : process.env.REACT_APP_INIT_SERVER_API,
};
