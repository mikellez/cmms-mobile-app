import axios from "axios";
import { API_URL } from "@env";
import * as RootNavigation from "./RootNavigation.js";
import { useSelector } from "react-redux";
import NetInfo from '@react-native-community/netinfo';

// import { RootState } from "./redux/store.js";
// const isOffline = useSelector((state) => state.offline);

const instance = axios.create({
        baseURL: `http://10.0.2.2:3001`
});

// Add an interceptor to catch errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log(error);
    if (!error.response) {
      NetInfo.fetch()
        .then(netInfoState => {
          const isOnline = netInfoState.isConnected;
          // console.log(isOnline);
          if (!isOnline) {
            console.log(error.request);
                // Network error, redirect to login
            alert('There seems to be something wrong with network. Please connect to VPN or try again later.');
            RootNavigation.navigate("Login");
            //return Promise.reject(error);
          }
        })
        .catch(error => {
          // console.log(error.message);
          console.log("hello");
        });
      // const isOnline = netInfoState.isConnected;
      
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
