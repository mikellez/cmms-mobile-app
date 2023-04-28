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
import instance from '../../axios.config';
import Form from '../../components/Request/Form';
import RequestContainer from '../../components/Request/RequestContainer';

type FormValues = {
  requestTypeID: number;
  faultTypeID: number;
  description: string;
  plantLocationID: number;
  taggedAssetID: number;
  image: any
};

const CreateRequest = ({ navigation }) => {
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

  const handleSubmit = async () => {
    //console.log('formState', formState);

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

  const handleChange = (name: string, value: number) => {
    setFormState({...formState, [name]: value});
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

  useEffect(() => {
    fetchFaultTypes();
    fetchRequestTypes();
    fetchPlants();

  }, [])

  return (
    <RequestContainer navigation={navigation} action="create"/>
  )
}

export default CreateRequest;