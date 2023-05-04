import axios from 'axios';
import { API_URL } from '@env';
import * as RootNavigation from './RootNavigation.js';

const instance = axios.create({
        baseURL: `http://localhost:3002`
});

// Add an interceptor to catch errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
        console.log(error);
    if (!error.response) {
      // Network error, redirect to login
      RootNavigation.navigate('Login');
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401 || status === 403) {
      // Authentication error, redirect to login
      RootNavigation.navigate('Login');
    }

    return Promise.reject(error);
  }
);

export default instance;