import axios from 'axios';

const baseURL = process.env.REACT_APP_API;
console.log(baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: { 'Bearer-Token': localStorage.getItem('token') }
});

axiosInstance.interceptors.response.use(
  (response) =>
    new Promise((resolve, reject) => {
      resolve(response);
    }),
  (error) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
);

export default axiosInstance;
