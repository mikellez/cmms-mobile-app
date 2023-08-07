import { useEffect, useState } from "react";
import { Alert, Center, HStack, Heading, VStack, Text, Box, FlatList, Button, Pressable, Icon } from "native-base";
import { ModuleCardContainer } from "../ModuleLayout";
import ImagePreview from "../ImagePreview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { _retrieveData, _storeData } from "../../helper/AsyncStorage";
import instance from "../../axios.config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { CMMSRequest } from "../../types/interfaces";
import { CMMSSubmitRequest } from "../../redux/features/requestSlice";

const OfflineRequestContainer = ({ navigation, route }) => {
  const isOffline = useSelector<RootState, boolean>((state) => state.offline);
  const [requests, setRequests] = useState<CMMSSubmitRequest[]>([]);
  const [requestItems, setRequestItems] = useState<CMMSSubmitRequest[]>([]);
  const [faultTypes, setFaultTypes] = useState([]); // [{}
  const [plants, setPlants] =  useState([]); // [{}
  const [requestTypes, setRequestTypes] = useState([]); // [{}
  const [assets, setAssets] = useState([]); // [{}
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const fetchLists = async (type) => {
    let result = await _retrieveData(type)
    return JSON.parse(result);
  }

  const fetchData = async () => {

    const promise = Promise.all([
      fetchLists('faultTypes'), 
      fetchLists('plants'), 
      fetchLists('requestTypes'), 
      fetchLists('assetTags'), 
      fetchLists('offlineRequests')
    ])
    .then((res) => {
      setFaultTypes(res[0]);
      setPlants(res[1]);
      setRequestTypes(res[2]);
      setAssets(res[3]);
      setRequests(res[4]);

    })
    
    promise
    .then(()=> {
      const result = requests?.map(({ id, description, faultTypeID, image, plantLocationID, requestTypeID, taggedAssetID })=> {
        const request = {
          id,
          description,
          faultTypeID: faultTypes.find(item => item.fault_id === faultTypeID)?.fault_type,
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

  useEffect(() => {

    if(isOffline) {
      fetchData();
    }

  }, [isOffline, requests.length]);

  return (
    <>
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
          <FlatList
            data={requestItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ModuleCardContainer>
                <Text><Heading size="xs">No:</Heading> {index + 1}</Text>
                <Text><Heading size="xs">Request Type:</Heading> {item.requestTypeID || 'NIL'}</Text>
                <Text><Heading size="xs">Fault Type:</Heading> {item.faultTypeID || 'NIL'}</Text>
                <Text><Heading size="xs">Plant Location:</Heading> {item.plantLocationID || 'NIL'}</Text>
                <Text><Heading size="xs">Assets:</Heading> {item.taggedAssetID || 'NIL'}</Text>
                <Text><Heading size="xs">Description:</Heading> {item.description || 'NIL'}</Text>
                <ImagePreview source={{ uri: item?.image?.uri }} alt="test" addImage={true} onPress={undefined} isDisabled={undefined} />
              </ModuleCardContainer>
            )}
            ListFooterComponent={() => (
              <VStack>
                {/*<Button marginTop="5" padding={2} bg="#C8102E" size="xs" onPress={()=>navigation.navigate('CreateRequest')}>
                  Submit Again
            </Button>*/}
                <Button marginTop="5" padding={2} bg="#C8102E" size="xs" onPress={()=>navigation.navigate('Report')}>
                  Back to Home
                </Button>
                <Pressable py="10" mb="10" flex={1} onPress={()=>navigation.navigate("QRScan")}>
                  <Center>
                    <Icon mb="1" as={<MaterialCommunityIcons name="qrcode-scan" />} color="#C8102E" size="2xl" />
                  </Center>
                  <Center>
                    <Text>QR Scan</Text>
                  </Center>
                </Pressable>
              </VStack>
            )}

          />
          </VStack>
        </Center>
      </VStack>
    </HStack>
    </>
  )
}

export default OfflineRequestContainer;