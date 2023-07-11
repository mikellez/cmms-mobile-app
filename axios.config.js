import axios from "axios";
import * as RootNavigation from "./RootNavigation.js";
import Constants from 'expo-constants';

// Access the variables
const apiBaseUrl = Constants?.expoConfig?.extra?.API_BASE_URL

const instance = axios.create({
        baseURL: `${apiBaseUrl}`
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
      alert('There seems to be something wrong with network. Please connect to VPN or try again later.');
      RootNavigation.navigate("Login");
      //return Promise.reject(error);
    }

    const { status } = error?.response;

    if (status && (status === 401 || status === 403)) {
      // Authentication error, redirect to login
      alert('There seems to be something wrong with authentication. Please connect try again later.');
      RootNavigation.navigate("Login");
    }

    //return Promise.reject(error);
  }
);

export default instance;
