import axios from 'axios';
import { API_URL } from './constants';

const axiosApi = axios.create({
  baseURL: API_URL,
});

export const addInterceptors = ( ) =>{
  axiosApi.interceptors.request.use((request) => {

    return request;
  });
};

export default axiosApi;
