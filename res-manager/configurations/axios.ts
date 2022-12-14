import axios from "axios";
// import Cookies from "js-cookie";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const configAxios = axios.create({
    baseURL: publicRuntimeConfig.NEXT_PUBLIC_API_ROOT_URL,
    headers: {
        "Content-type": "application/json",
        "x-hasura-admin-secret": publicRuntimeConfig.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
    },
});

// Add a request interceptor
// configAxios.interceptors.request.use(
//     function (config) {
//         if (config && config.headers) {
//             const accessToken = Cookies.get("accessToken");
//             config.headers["Authorization"] = `Bearer ${accessToken || ""}`;
//         }
//         return config;
//     },
//     function (error) {
//         // Do something with request error
//         return Promise.reject(error);
//     }
// );

// // Add a response interceptor
// configAxios.interceptors.response.use(
//     function (response) {
//         // Do something with response data
//         if (response.status === 401) {
//             let refreshToken = Cookies.get("refreshToken");
//             configAxios
//                 .post("/auth/refresh", {
//                     refreshToken: refreshToken,
//                 })
//                 .then((response) => {
//                     if (response.status === 200) {
//                         let accessToken = response?.data?.data?.accessToken;
//                         let refreshToken = response?.data?.data?.refreshToken;
//                         Cookies.set("accessToken", accessToken);
//                         Cookies.set("refreshToken", refreshToken);
//                         const config = response.config;
//                         if (config && config.headers) {
//                             config.headers["Authorization"] = `Bearer ${accessToken || ""}`;
//                         }
//                         return configAxios(config);
//                     } else {
//                         Cookies.remove("accessToken");
//                         Cookies.remove("refreshToken");
//                         Cookies.remove("user");
//                     }
//                 });
//         }
//         return response;
//     },
//     function (error) {
//         // Do something with response error
//         return Promise.reject(error);
//     }
// );

export default configAxios;
