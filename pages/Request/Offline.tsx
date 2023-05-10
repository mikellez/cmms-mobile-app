import { Alert, Box, Center, CloseIcon, HStack, Heading, IconButton, NativeBaseProvider, VStack, Text } from 'native-base';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

import { _storeData, _retrieveData } from '../../helper/AsyncStorage';
import { ModuleCardContainer } from '../../components/ModuleLayout';
import ImagePreview from '../../components/ImagePreview';
import instance from '../../axios.config';

const OfflineRequest = ({ route, navigation }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [requests, setRequests] = useState([]); // [{}
  const [requestItems, setRequestItems] = useState([]); // [{}
  const [faultTypes, setFaultTypes] = useState([]); // [{}
  const [plants, setPlants] =  useState([]); // [{}
  const [requestTypes, setRequestTypes] = useState([]); // [{}
  const [assets, setAssets] = useState([]); // [{}

  const fetchOfflineRequests = async () => {
    let result = await _retrieveData('offlineRequests')
    setRequests(JSON.parse(result));
  }

  const fetchLists = async (type) => {
    let result = await _retrieveData(type)
    return JSON.parse(result);
  }


  useEffect(() => {
    const checkConnection = async () => {
      const netInfoState = await NetInfo.fetch();
      setIsConnected(netInfoState.isConnected);
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    const fetchData = async () => {
      await checkConnection();
      const promise = Promise.all([fetchLists('faultTypes'), fetchLists('plants'), fetchLists('requestTypes'), fetchLists('assetTags'), fetchLists('offlineRequests')])
      .then((res) => {
        setFaultTypes(res[0]);
        setPlants(res[1]);
        setRequestTypes(res[2]);
        setAssets(res[3]);
        setRequests(res[4]);

      })
      
      if(isConnected) {
        console.log('requests', requests)
        promise
        .then(()=> {
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
                alert("Request created successfully");
                navigation.navigate("Report");
                return response.data;
              })
              .catch((e) => {
                console.log("error creating request");
                console.log(e);
                return null;
              });
          })
        })

      } else {
        promise
        .then(()=> {
          const result = requests?.map(({ id, description, faultTypeID, image, plantLocationID, requestTypeID, taggedAssetID })=> {
            const request = {
              id,
              description,
              faultTypeID: faultTypes.find(item => item.fault_id === faultTypeID)?.fault_name,
              image,
              plantLocationID: plants.find(item => item.plant_id === plantLocationID)?.plant_name,
              requestTypeID: requestTypes.find(item => item.req_id === requestTypeID)?.request,
              taggedAssetID: assets.find(item => item.psa_id === taggedAssetID)?.asset_name,
            }

            return request;
          });

          setRequestItems(result);
        })

      }
    }

    fetchData();

  }, [isConnected, requests?.length]);

  return (
    <NativeBaseProvider>
      <HStack flex={1}>
        <VStack flex={1}>
          <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
              <Heading size="md" color="#C8102E">Create Request</Heading>
            </HStack>
          </HStack>

          <Center>
            <VStack space={5} maxW="400">
              <Alert w="100%" status="danger">
                <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                  <Alert.Icon size="md" />
                  <Text fontSize="md" fontWeight="medium" _dark={{
                  color: "coolGray.800"
                }}>
                    You are now in offline mode
                  </Text>

                  <Box _text={{
                  textAlign: "center"
                }} _dark={{
                  _text: {
                    color: "coolGray.600"
                  }
                }}>
                    Your requests is pending to be submitted. We will submit your requests once you are back online.
                  </Box>
                </VStack>
              </Alert>
            { 
              requestItems.map((request, index) => {
                return (
                  <ModuleCardContainer>
                    <Text><Heading size="xs">No:</Heading> {index + 1}</Text>
                    <Text><Heading size="xs">Request Type:</Heading> {request.requestTypeID || 'NIL'}</Text>
                    <Text><Heading size="xs">Fault Type:</Heading> {request.faultTypeID || 'NIL'}</Text>
                    <Text><Heading size="xs">Plant Location:</Heading> {request.plantLocationID || 'NIL'}</Text>
                    <Text><Heading size="xs">Assets:</Heading> {request.taggedAssetID || 'NIL'}</Text>
                    <Text><Heading size="xs">Description:</Heading> {request.taggedAssetID || 'NIL'}</Text>
                    <ImagePreview source={{ uri: request?.image?.uri }} alt="test" />
                  </ModuleCardContainer>
                )
              })
            }
            </VStack>
          </Center>
        </VStack>
      </HStack>

    </NativeBaseProvider>

  )
}

export default OfflineRequest;