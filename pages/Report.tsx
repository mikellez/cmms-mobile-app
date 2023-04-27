import React, { useEffect, useState } from "react";
import { Flex, HStack, Icon, IconButton, NativeBaseProvider, Image, Center, Pressable, Text, VStack, Heading, Button, ScrollView, Box } from "native-base";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import instance from "../axios.config";
import ListBox from "../components/Request/ListBox";
import App from "./App";

interface CMMSRequest {
  request_id: string;
  request_name?: string;
  created_date: Date;
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


const ReportScreen = ({ navigation }) => {
  const [requestItems, setRequestItems] = useState<CMMSRequest[]>([]);

  const fetchRequest = async () => {

    await instance.get(`/api/request`)
    .then((res)=> {
      setRequestItems(res.data);
    })
    .catch((err) => {
        console.log(err)
    });
  };

  useEffect(() => {
    fetchRequest();
  });

  return (
    <App navigation={navigation}>

      <HStack flex={1} >
        <VStack flex={1}>
          <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
              <Heading size="md" color="#C8102E">Report</Heading>
            </HStack>
            <HStack >
              <Button w="100" padding={2} bg="#C8102E" leftIcon={<Icon as={MaterialCommunityIcons} name="filter" size="sm"/>} size="xs">
                Filter
              </Button>
            </HStack>
          </HStack>

          <Box backgroundColor="#F9F7F7" px="1" py="1" m="2" rounded="md" _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} borderWidth={1} borderStyle={'dashed'} borderColor='#C8102E'>
            <Center>
              <Pressable onPress={()=>navigation.navigate("CreateRequest")}>
                <HStack alignItems={'center'}>
                  <IconButton icon={<Icon size="sm" as={MaterialCommunityIcons} name="plus" color="#C8102E" />} />
                  <Text color="#C8102E">Add new request</Text>
                </HStack>
              </Pressable>
            </Center>
          </Box>

          <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
              <Heading size="md" color="#C8102E">Request</Heading>
            </HStack>
            <HStack >
              <Heading size="md" color="#C8102E">Checklist</Heading>
            </HStack>
          </HStack>
          <ScrollView w="100%" h="80">

          {requestItems.map((item) =>{
              return (
                <ListBox item={item} navigation={navigation} />
              );
            } 
          )
          }
          </ScrollView>
        </VStack>
      </HStack>

    </App>
  );
};

export default ReportScreen;