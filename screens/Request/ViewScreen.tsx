import React, { useEffect, useState } from "react";
import { Flex, HStack, Icon, IconButton, NativeBaseProvider, Image, Center, Pressable, Text, VStack, Heading, Button, ScrollView, Divider } from "native-base";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import moment from "moment";

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
    <NativeBaseProvider>
      <Flex flex={1} justifyContent="space-between" backgroundColor={"white"}>
        <HStack bg="#D9D9D9" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="350" borderBottomColor={'#C8102E'} borderBottomWidth={2}>
          <HStack alignItems="center">
            <IconButton icon={<Icon size="lg" as={MaterialIcons} name="menu" color="#C8102E" />} />
          </HStack>
          <HStack alignItems="center">
            <Image size={'2xl'} style={{ resizeMode: 'contain', width: 150, height: 20 }} alt="fallback text" source={ require('../../assets/keppellogo.png')} />
          </HStack>
          <HStack alignItems="center">
            <IconButton icon={<Icon size="lg" as={FontAwesome} name="user-circle-o" color="#C8102E" />} />
          </HStack>
        </HStack>

          <HStack flex={1} >
            <VStack flex={1} pl="1" pr="3">
              <HStack w="100%" justifyContent="space-between">
                <HStack alignItems="center">
                  <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="chevron-left" color="#C8102E" />} />
                  <Heading size="md" color="#C8102E">Case ID: {requestItems?.request_id}</Heading>
                </HStack>
                <HStack alignItems="center">
                  <Heading size="md">{requestItems?.status}</Heading>
                </HStack>
              </HStack>
              <HStack flexDirection="row-reverse">
                <HStack alignItems="center">
                  <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="chevron-up" color="#C8102E" />} />
                  <Text>Priority</Text>
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

                <Text>{requestItems?.fault_description}</Text>

                <Heading size="sm" pt="3" pb="1" color="#C8102E">
                  Attachment
                </Heading>

                <Divider w="100%" mb="3"/>

                <Text>{requestItems?.fault_description}</Text>

                <Heading size="sm" pt="3" pb="1" color="#C8102E">
                  Completion Attachment
                </Heading>

                <Divider w="100%" mb="3"/>

                <Text>{requestItems?.fault_description}</Text>

                <Heading size="sm" pt="3" pb="1" color="#C8102E">
                  Completion Comment
                </Heading>

                <Divider w="100%" mb="3"/>

                <Text>{requestItems?.complete_comments ?? 'No Text'}</Text>

              </ScrollView>

            </VStack>
          </HStack>

        <HStack bg="#D9D9D9" alignItems="center" safeAreaBottom shadow={6} >
          <Pressable py="3" flex={1} >
            <Center>
              <Icon mb="1" as={<MaterialCommunityIcons name="clipboard-clock-outline" />} color="#C8102E" size="lg" />
            </Center>
          </Pressable>
        </HStack>

      </Flex>
    </NativeBaseProvider>
  );
};

export default ReportScreen;