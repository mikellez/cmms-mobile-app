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
      .post("http://10.0.2.2:3002/api/request/", formData, {
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

    /*await axios.post(`http://10.0.2.2:3002/api/request`, {params: formState})
    .then((res)=> {
      console.log(res.data) 
    })
    .catch((err) => {
        console.log(err)
        alert(err.response.data);
    });*/

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
        alert(err.response.data);
    });
  };

  const fetchRequestTypes = async () => {
    await instance.get(`/api/request/types`)
    .then((res)=> {
      setRequestTypes(res.data);
    })
    .catch((err) => {
        console.log(err)
        alert(err.response.data);
    });
  }

  const fetchPlants = async () => {
    await instance.get(`/api/getPlants`)
    .then((res)=> {
      setPlants(res.data);
    })
    .catch((err) => {
        console.log(err)
        alert(err.response.data);
    });
  }

  const fetchAssetTag = async (id: string) => {
    await instance.get(`/api/asset/${id}`)
    .then((res)=> {
      setAssetTags(res.data);
    })
    .catch((err) => {
        console.log(err)
        alert(err.response.data);
    });
  }

  useEffect(() => {
    fetchFaultTypes();
    fetchRequestTypes();
    fetchPlants();

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

            <FormControl isRequired >
              <FormControl.Label>Request Type</FormControl.Label>
              <Radio.Group 
                name="request_type" 
                defaultValue="1" 
                accessibilityLabel="pick a size" 
                onChange={value=>setFormState({...formState, requestTypeID: parseInt(value)})}>

                <HStack flex={1} justifyContent="space-between" w="100%" flexWrap={'wrap'}> 
                  {requestTypes.map((requestType) => (
                    <Radio key={requestType.req_id} value={requestType.req_id} colorScheme="red" size="sm" my={1}>{requestType.request}</Radio>
                  ))}

                </HStack>
              </Radio.Group>
            </FormControl>

            <FormControl isRequired >
              <FormControl.Label>Fault Type</FormControl.Label>
              <Select 
                accessibilityLabel="Choose Fault Type" 
                placeholder="Choose Fault Type" 
                _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }} 
                mt="1" 
                onValueChange={value=>setFormState({...formState, faultTypeID: parseInt(value)})}>

                {faultTypes.map((faultType) => (
                  <Select.Item key={faultType.fault_id} label={faultType.fault_type} value={faultType.fault_id} />
                ))}

              </Select>
            </FormControl>

            <FormControl isRequired >
              <FormControl.Label>Fault Description</FormControl.Label>
              <TextArea h={20} placeholder=""  numberOfLines={4} autoCompleteType={true} onChangeText={value=>setFormState({...formState, description: value})}/>
            </FormControl>

            <FormControl isRequired >
              <FormControl.Label>Plant Location</FormControl.Label>
              <Select 
                accessibilityLabel="Choose Plant Location" 
                placeholder="Choose Plant Location" 
                _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }} 
                mt="1" 
                onValueChange={value=>handlePlantLocationChange(value)}>

                {plants.map((plant) => (
                  <Select.Item key={plant.plant_id} label={plant.plant_name} value={plant.plant_id} />
                ))}

              </Select>
            </FormControl>

            <FormControl isRequired >
              <FormControl.Label>Asset's Tags</FormControl.Label>
              <Select 
                accessibilityLabel="Choose Asset Tag" 
                placeholder="Choose Asset Tag" 
                _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} /> }} 
                mt="1" 
                onValueChange={value=>setFormState({...formState, taggedAssetID: parseInt(value)})}>

                {assetTags.map((assetTag) => (
                  <Select.Item key={assetTag.psa_id} label={assetTag.asset_name} value={assetTag.psa_id} />
                ))}

              </Select>
            </FormControl>

            <FormControl isRequired >
              <FormControl.Label>Image</FormControl.Label>
              <Pressable onPress={handleImagePicker}>
                <ImagePreview source={{ uri : selectedImage }} alt="test"/>
              </Pressable>
            </FormControl>

            <Button bgColor="#C8102E" mt={5} mb={10} onPress={handleSubmit}>Submit</Button>

          </ScrollView>

        </VStack>
      </HStack>



    </App>
  )
}

export default CreateRequest;