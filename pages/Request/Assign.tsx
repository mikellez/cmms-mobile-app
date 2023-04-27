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
import App from '../App';
import * as ImagePicker from 'expo-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import mime from "mime";
import ImagePreview from '../../components/ImagePreview';
import AsyncStorage from '@react-native-async-storage/async-storage';


import instance from '../../axios.config';
import Form from '../../components/Request/Form';
import axios from 'axios';

type FormValues = {
  requestTypeID: number;
  faultTypeID: number;
  description: string;
  plantLocationID: number;
  taggedAssetID: number;
  image: any
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

const AssignRequest = ({ route, navigation }) => {
  const [prioritySelected, setPrioritySelected] = useState({});
  const [assignUserSelected, setAssignUserSelected] = useState({});
  const [requestItems, setRequestItems] = useState<CMMSRequest>();
  const [selectedImage, setSelectedImage] = useState(null);
  //const [formData, setFormData] = useState(new FormData());
  const [formState, setFormState] = useState<FormValues>({
    requestTypeID: 0,
    faultTypeID: 0,
    description: "",
    plantLocationID: 0,
    taggedAssetID: 0,
    image: null
  });

  const [requestTypes, setRequestTypes] = useState([]);
  const [faultTypes, setFaultTypes] = useState([]);
  const [plants, setPlants] = useState([]);
  const [assetTags, setAssetTags] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [assignUsers, setAssignUsers] = useState([]);

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

  }

  const updateRequest = async () => {
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


  const handleSubmit = async () => {
    //console.log('formState', formState);
    updateRequest();

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

  const handleImagePicker = async () => {
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

      if(result.canceled) return;
      const uri = result.assets[0].uri
      const type = result.assets[0].type;
      const name = result.assets[0].fileName || 'image.jpg';
      const newImageUri =  "file:///" + uri.split("file:/").join("");

      const file = {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      };

      console.log(file)

      setSelectedImage(uri);
      setFormState({...formState, image: file});
  };

  const handlePlantLocationChange = (value: string) => {
    setFormState({...formState, plantLocationID: parseInt(value)});
    fetchAssetTag(value);
  }

  const fetchFaultTypes = async () => {
    await instance.get(`/api/fault/types`)
    .then((res)=> {
      setFaultTypes(res.data);
    })
    .catch((err) => {
        console.log(err)
    });
  };

  const fetchRequestTypes = async () => {
    await instance.get(`/api/request/types`)
    .then((res)=> {
      setRequestTypes(res.data);
    })
    .catch((err) => {
        console.log(err)
    });
  }

  const fetchPlants = async () => {
    await instance.get(`/api/getPlants`)
    .then((res)=> {
      setPlants(res.data);
    })
    .catch((err) => {
        console.log(err)
    });
  }

  const fetchAssetTag = async (id: string) => {
    await instance.get(`/api/asset/${id}`)
    .then((res)=> {
      setAssetTags(res.data);
    })
    .catch((err) => {
        console.log(err)
    });
  }

  const fetchPriority = async () => {
    await instance.get(`/api/request/priority`)
    .then((res)=> {
      setPriorities(res.data);
    })
    .catch((err)=> {
      console.log(err)
    })
  }

  const fetchAssignUser = async () => {
    try {
      const user = getData('@user');
      console.log(user)

      await instance.get(`/api/getAssignedUsers/4`)
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
    if(requestItems) {
      fetchAssetTag(requestItems?.plant_id.toString());
    }
  }, [requestItems?.plant_id]);


  useEffect(() => {
    console.log('test')
    //fetchFaultTypes();
    //fetchRequestTypes();
    //fetchPlants();
    Promise.all([fetchFaultTypes(), fetchRequestTypes(), fetchPlants(), fetchPriority(), fetchAssignUser()])
    .then(() => {
      fetchRequest();
    })

  }, [])

  return (
    <App navigation={navigation}>

      <HStack flex={1}>
        <VStack flex={1}>
          <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
              <Heading size="md" color="#C8102E">Create Request</Heading>
            </HStack>
          </HStack>

          <ScrollView w="100%" h="200" p="5">

            <Form 
              action="assign"

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

              onSubmit={handleSubmit}
            />

          </ScrollView>

        </VStack>
      </HStack>



    </App>
  )
}

export default AssignRequest;