// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
// });

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     // ❌ ไม่ redirect ที่นี่
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;




import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
})

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    // refresh token logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await axios.post("/auth/refresh", {}, { withCredentials: true })
        return axiosInstance(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance