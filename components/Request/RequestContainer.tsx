import React, { useEffect, useState } from 'react';

import { 
  Button, 
  CheckIcon, 
  Container, 
  FormControl, 
  HStack, 
  Heading, 
  Radio, 
  ScrollView, 
  Select, 
  Stack, 
  Text, 
  TextArea, 
  VStack, 
  WarningOutlineIcon,
  Image, 
  Pressable} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import mime from "mime";
import ImagePreview from '../../components/ImagePreview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';


import instance from '../../axios.config';
import Form from '../../components/Request/Form';
import axios from 'axios';
import { ModuleScreen } from '../ModuleLayout/ModuleScreen';

type FormValues = {
  requestTypeID: number;
  faultTypeID: number;
  description: string;
  plantLocationID: number;
  taggedAssetID: number;
  image: any;
};

type CompletionFormValues = {
  complete_comments: string;
  completion_file?: any;
};

interface CMMSRequest {
  request_id: string;
  request_name?: string;
  created_date: string;
  fullname: string;
  fault_name: string;
  fault_id?: number;
  asset_name: string;
  psa_id?: number;
  req_id?: number;
  plant_name: string;
  plant_id?: number;
  priority: string;
  priority_id: number;
  status: string;
  status_id?: number;
  assigned_user_email: string;
  assigned_user_id: number;
  assigned_user_name: string;
  fault_description?: string;
  uploaded_file?: any;
  requesthistory?: string;
  complete_comments?: string;
  completion_file?: any;
  rejection_comments: string;
}

export interface CMMSRequestPriority {
  p_id?: number;
  priority?: string;
}

const RequestContainer = ({ 
  route, 
  navigation, 
  action 
} : { 
  route?: RouteProp<{ params: { id: '', plant: '', asset: '' } }, 'params'>;
  navigation?: any;
  action?: string;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [prioritySelected, setPrioritySelected] = useState({});
  const [assignUserSelected, setAssignUserSelected] = useState({});
  const [requestItems, setRequestItems] = useState<CMMSRequest>();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCompletionImage, setSelectedCompletionImage] = useState(null);
  const [actionComment, setActionComment] = useState("");

  const [completionImage, setCompletionImage] = useState(null);

  const [formState, setFormState] = useState<FormValues>({
    requestTypeID: 0,
    faultTypeID: 0,
    description: "",
    plantLocationID: 0,
    taggedAssetID: 0,
    image: null
  });

  const [completionFormState, setCompletionFormState] = useState<CompletionFormValues>({
    complete_comments: "",
    completion_file: null
  });

  const [requestTypes, setRequestTypes] = useState([]);
  const [faultTypes, setFaultTypes] = useState([]);
  const [plants, setPlants] = useState([]);
  const [assetTags, setAssetTags] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [assignUsers, setAssignUsers] = useState([]);

  const [plant, setPlant] = useState(route?.params?.plant);
  const [asset, setAsset] = useState(route?.params?.asset);


  const getData = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key)
      return data != null ? JSON.parse(data) : null;

    } catch(err) {
      console.log(err)
      // error reading value
    }
  }

  const createRequest = async () => {
    const formData = new FormData();
    formData.append("description", formState.description);
    formData.append("faultTypeID", formState.faultTypeID.toString());
    formData.append("plantLocationID", formState.plantLocationID.toString());
    formData.append("requestTypeID", formState.requestTypeID.toString());
    formData.append("taggedAssetID", formState.taggedAssetID.toString());
    if (formState.image) formData.append("image", formState.image);

    console.log('formData', formData);
    //setFormData(formData);

    if(isConnected) {
      return await instance
        .post("/api/request/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          alert("Request created successfully");
          navigation.navigate("Report");
          return response.data;
        })
        .catch((e) => {
          console.log("error creating request");
          console.log(e);
          return null;
        });

    } else {
      let data = await getData('offlineRequests');
      if(!data) {
        data = [];
      }

      const newRequest = {
        id: data.length + 1,
        description: formState.description,
        faultTypeID: formState.faultTypeID,
        plantLocationID: formState.plantLocationID,
        requestTypeID: formState.requestTypeID,
        taggedAssetID: formState.taggedAssetID,
        image: formState.image
      }
      console.log(newRequest)
      data.push(newRequest);
      await _storeData('offlineRequests', data);
      navigation.navigate("OfflineRequest");
    }

  }

  const assignRequest = async () => {
    const { id } = route.params;
    return await instance
      .patch(`/api/request/${id}`, { 
        priority: prioritySelected, 
        assignedUser: assignUserSelected
      })
      .then((response) => {
        alert("Request updated successfully");
        navigation.navigate("Report");
        return response.data;
      })
      .catch((e) => {
        console.log("error updating request");
        console.log(e);
        return null;
      });
  }

  const completeRequest = async () => {
    const { id } = route.params;

    const formData = new FormData();
    formData.append("complete_comments", completionFormState.complete_comments);
    if (completionFormState.completion_file) formData.append("completion_file", completionFormState.completion_file);

    console.log('formData', formData);

    return await instance
      .patch(`/api/request/complete/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        alert("Request completed successfully");
        navigation.navigate("Report");
        return response.data;
      })
      .catch((e) => {
        console.log("error creating request");
        console.log(e);
        return null;
      });
  }

  const handleSubmit = async () => {
    //console.log('formState', formState);
    if(action==='create') {
      createRequest();
    } else if(action==='assign') {
      assignRequest();
    } else if(action==='complete') {
      completeRequest();
    }

  }

  const handleStatusAction = async (status) => {
    const { id } = route.params;
    return await instance
      .patch(`/api/request/${id}/${status}`, { comments: actionComment })
      .then((response) => {
        console.log(response.data)
        alert("Request updated successfully");
        navigation.navigate("Report");
        return response.data;
      })
      .catch((e) => {
        console.log("error updating request");
        console.log(e);
        return null;
      });
  }

  const handleRejectionCommentChange = (value: string) => {
    setActionComment(value);
  }

  const handleChange = (name: string, value: number) => {
    setFormState({...formState, [name]: value});
  }

  const handlePriorityChange = (value: string) => {
    const selectedItem = priorities.find((item) => item.p_id === value);
    console.log(value)
    console.log(selectedItem)
    setPrioritySelected({ p_id: selectedItem.p_id, priority: selectedItem.priority });
  }

  const handleAssignUserChange = (value: string) => {
    const selectedItem = assignUsers.find((item) => item.id === value);
    setAssignUserSelected({ value: selectedItem.id, label: selectedItem.name + ' | ' + selectedItem.email });
  }

  const NativeImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if(result.canceled) return false;

    const uri = result.assets[0].uri
    const type = result.assets[0].type;
    const name = result.assets[0].fileName || 'image.jpg';
    const newImageUri =  "file:///" + uri.split("file:/").join("");

    return {
      oriUri: uri,
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    };
  }

  const handleImagePicker = async () => {
    const file = await NativeImagePicker();

    if(file) {
      setSelectedImage(file.oriUri);
      setFormState({...formState, image: file});
    }
  };

  const handleCompletionImagePicker = async () => {
    const file = await NativeImagePicker();
    console.log(file)

    if(file) {
      setSelectedCompletionImage(file.oriUri);
      setCompletionFormState({...completionFormState, completion_file: file});
    }
  }

  const handleCompletionCommentChange = (value: string) => {
    console.log('completion', value)
    setCompletionFormState({...completionFormState, complete_comments: value});
  }


  const handlePlantLocationChange = (value: number) => {
    setFormState({...formState, plantLocationID: value});
    fetchAssetTag(value);
    fetchAssignUser(value);
  }

  const _storeData = async (key, value) => {
    if(typeof value === 'object') value = JSON.stringify(value);
    console.log(value);

    try {
      await AsyncStorage.setItem(
        '@'+key,
        value,
      );
    } catch (err) {
      // Error saving data
      console.log(err)
    } 
  }

  const _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('@'+key);
      if (value !== null) {
        return value;
      }
    } catch (err) {
      // Error retrieving data
      console.log(err)
    }
  }

  const fetchFaultTypes = async () => {
    if(isConnected) {

      await instance.get(`/api/fault/types`)
        .then(async (res)=> {
          _storeData('faultTypes', res.data);
          setFaultTypes(res.data);
        })
        .catch((err) => {
            console.log(err)
        });

    } else {
      const value = await _retrieveData('faultTypes');
      if(value) setFaultTypes(JSON.parse(value));

    }
  };

  const fetchRequestTypes = async () => {
    if(isConnected) {
      await instance.get(`/api/request/types`)
      .then((res)=> {
        _storeData('requestTypes', res.data);
        setRequestTypes(res.data);
      })
      .catch((err) => {
        console.log(err)
      });

    } else {
      const value = await _retrieveData('requestTypes');
      if(value) setRequestTypes(JSON.parse(value));
    }
  }

  const fetchPlants = async () => {
    if(isConnected) {
      await instance.get(`/api/plants`)
      .then((res)=> {
        _storeData('plants', res.data);
        setPlants(res.data);
      })
      .catch((err) => {
          console.log(err)
      });
    } else {
      const value = await _retrieveData('plants');
      if(value) setPlants(JSON.parse(value));
    }
  }

  const fetchAssetTag = async (id: number) => {
    if(isConnected) {
      await instance.get(`/api/asset/${id}`)
      .then((res)=> {
        setAssetTags(res.data);
      })
      .catch((err) => {
          console.log(err)
      });

    } else {
      const value = await _retrieveData('assetTags');
      if(value) {
        const asset_tags = JSON.parse(value).filter(item => item.plant_id === id);
        setAssetTags(asset_tags);
      }
    }
  }

  const fetchPriority = async () => {
    if(isConnected) {
      await instance.get(`/api/request/priority`)
      .then((res)=> {
        _storeData('priorities', res.data);
        setPriorities(res.data);
      })
      .catch((err)=> {
        console.log(err)
      })
    } else {
      const value = await _retrieveData('priorities');
      setPriorities(JSON.parse(value));
    }
  }

  const fetchAssignUser = async (plant_id) => {
    try {

      await instance.get(`/api/getAssignedUsers/${plant_id}`)
      .then((res)=> {
        setAssignUsers(res.data);
      })
      .catch((err)=> {
        console.log(err)
      })
    } catch(err) {
      console.log(err)
      // error reading value
    }

  }

  const fetchRequest = async () => {
    const { id } = route.params;
    await instance.get(`/api/request/${id}`)
    .then((res)=> {
      setRequestItems(res.data);
    })
    .catch((err) => {
        console.log(err)
    });
  };

  useEffect(() => {
    const checkConnection = async () => {
      const netInfoState = await NetInfo.fetch();
      setIsConnected(netInfoState.isConnected);
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    const fetchData = async () => {
      try {
        await checkConnection();
        // Do something else that depends on the network status
        fetchFaultTypes();
        fetchRequestTypes();
        fetchPlants();

      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };

    if(action==='create') {

      fetchData();

    } else {
      Promise.all([fetchFaultTypes(), fetchRequestTypes(), fetchPlants(), fetchPriority()])
      .then(() => {
        console.log(AsyncStorage.getAllKeys())
        fetchRequest();
      })

    }

    return () => {
      unsubscribe();
    };

  }, [isConnected])

  useEffect(() => {

    if(requestItems) {
      fetchAssetTag(requestItems?.plant_id);
      fetchAssignUser(requestItems?.plant_id);
    }
    if(route?.params?.plant) {
      fetchAssetTag(route.params.plant);
    }

  }, [isConnected, requestItems?.plant_id]);


  return (


    <ScrollView w="100%" h="200" p="5" nestedScrollEnabled={true}>
      { !isConnected && <Text>Offline</Text> }

      <Form 
        action={action}

        plant={plant}
        asset={asset}

        requestItems={requestItems}

        requestTypes={requestTypes}
        onRequestTypeChange={value=>handleChange("requestTypeID", parseInt(value))}

        faultTypes={faultTypes}
        onFaultTypeChange={value=>handleChange("faultTypeID", parseInt(value))}

        onFaultDescriptionChange={value=>handleChange("description", value)}

        plants={plants}
        onPlantLocationChange={value=>handlePlantLocationChange(value)}

        assetTags={assetTags}
        onAssetTagChange={value=>handleChange("taggedAssetID", parseInt(value))}

        imageSource={selectedImage}
        onImagePicker={handleImagePicker}

        prioritySelected={prioritySelected}
        priorities={priorities}
        onPriorityChange={handlePriorityChange}

        assignUserSelected={assignUserSelected}
        assignUsers={assignUsers}
        onAssignUserChange={handleAssignUserChange}

        completionImageSource={selectedCompletionImage}
        onCompletionImagePicker={handleCompletionImagePicker}
        onCompletionCommentChange={handleCompletionCommentChange}

        onSubmit={handleSubmit}
        onStatusAction={handleStatusAction}

        onRejectionCommentChange={handleRejectionCommentChange}
      />

    </ScrollView>

  )
}

export default RequestContainer;