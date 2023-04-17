import React, { useEffect, useState } from "react";
import { Flex, HStack, Icon, IconButton, NativeBaseProvider, Image, Center, Pressable, Text, VStack, Heading, Button, ScrollView, Divider } from "native-base";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import moment from "moment";
//import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

import ImageComponent from "../../components/Image";
import App from "../App";

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


const ReportScreen = ({ route, navigation }) => {
  const [requestItems, setRequestItems] = useState<CMMSRequest>();

  const fetchRequest = async () => {
    const { id } = route.params;
    await axios.get(`http://10.0.2.2:3002/api/request/${id}`)
    .then((res)=> {
      setRequestItems(res.data);
    })
    .catch((err) => {
        console.log(err)
        alert(err.response.data);
    });
  };


  useEffect(() => {
    fetchRequest();
  });

  function moment(arg0: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <App navigation={navigation}>

      <HStack flex={1} >
        <VStack flex={1} px={3} py={3}>
          <HStack w="100%" justifyContent="space-between">
            <HStack alignItems="center">
                <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="chevron-left" color="#C8102E" />} onPress={()=>navigation.goBack()}/>
              <Heading size="md" color="#C8102E">Case ID: {requestItems?.request_id}</Heading>
            </HStack>
            <HStack alignItems="center">
              <Heading size="sm">{requestItems?.status}</Heading>
            </HStack>
          </HStack>
          <HStack flexDirection="row-reverse">
            <HStack alignItems="center">
              <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="chevron-up" color="#C8102E" />} />
              <Text>{ requestItems?.priority }</Text>
            </HStack>
          </HStack>

          <ScrollView w="100%" h="80">

            <Text><Heading size="xs">Created On: </Heading>{ requestItems?.created_date }</Text>
            <Text><Heading size="xs">Reported By:</Heading>{ requestItems?.assigned_user_name }</Text>
            <Text><Heading size="xs">Assigned To:</Heading>{ requestItems?.assigned_user_name }</Text>

            <Heading size="sm" pt="3" pb="1" color="#C8102E">
              Fault Description
            </Heading>

            <Divider w="100%" mb="3"/>

            <Text>{requestItems?.fault_description ?? 'No text'}</Text>

            <Heading size="sm" pt="3" pb="1" color="#C8102E">
              Attachment
            </Heading>

            <Divider w="100%" mb="3"/>

            { requestItems?.uploaded_file?.data ? 
              (<ImageComponent bufferData={requestItems?.uploaded_file.data}/>) : (<Text>No Image</Text>)
            }

            <Heading size="sm" pt="3" pb="1" color="#C8102E">
              Completion Attachment
            </Heading>

            <Divider w="100%" mb="3"/>

            { requestItems?.completion_file?.data ? 
              (<ImageComponent bufferData={requestItems?.completion_file.data}/>) : (<Text>No Image</Text>)
            }

            <Heading size="sm" pt="3" pb="1" color="#C8102E">
              Completion Comment
            </Heading>

            <Divider w="100%" mb="3"/>

            <Text>{requestItems?.complete_comments ?? 'No Text'}</Text>

          </ScrollView>

        </VStack>
      </HStack>
      
    </App>
  );
};

export default ReportScreen;