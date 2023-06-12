import React, { useEffect, useState } from 'react';
import { Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToConnectionChanges } from '../helper/NetInfo';
import { setOfflineMode } from '../redux/features/offlineSlice';
import { _retrieveData, _storeData } from '../helper/AsyncStorage';
import instance from '../axios.config';
import { RootState } from '../redux/store';
import { CMMSSubmitRequest } from '../redux/features/requestSlice';

function OfflineHandling({ navigation }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const subscribe = subscribeToConnectionChanges(setIsConnected);

    dispatch(setOfflineMode(!isConnected));

  }, [isConnected]);

  const fetchOfflineRequests = async () => {
    let result = await _retrieveData('offlineRequests')
    return JSON.parse(result);
  }

  const submitRequests = async (requests) => {
    await 
    requests.map(async item=> {
      const formData = new FormData();
      formData.append("description", item.description);
      formData.append("faultTypeID", item.faultTypeID.toString());
      formData.append("plantLocationID", item.plantLocationID.toString());
      formData.append("requestTypeID", item.requestTypeID.toString());
      formData.append("taggedAssetID", item.taggedAssetID.toString());
      if (item.image) formData.append("image", item.image);

      console.log('formData', formData);
      //setFormData(formData);

      return await instance
        .post("/api/request/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          alert("Cached Request created successfully");
          
          navigation.navigate("Report");
          return response.data;
        })
        .catch((e) => {
          console.log("error creating request");
          console.log(e);
          return null;
        });
    })

    return true;
  }

  useEffect(() => {

    if(isConnected) {
      fetchOfflineRequests()
      .then((res)=> {
        if(res.length > 0) {
          submitRequests(res);
          _storeData('offlineRequests', []);
        }
      })

    } 

  }, [isConnected]);

  return (
    <></>
  );
}

export default OfflineHandling;