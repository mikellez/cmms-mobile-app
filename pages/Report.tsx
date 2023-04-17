import React, { useEffect, useState } from "react";
import { Flex, HStack, Icon, IconButton, NativeBaseProvider, Image, Center, Pressable, Text, VStack, Heading, Button, ScrollView } from "native-base";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";

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
    await axios.get("http://10.0.2.2:3002/api/request")
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

  return (
    <NativeBaseProvider>
      <Flex flex={1} justifyContent="space-between" backgroundColor={"white"}>
        <HStack bg="#D9D9D9" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="350" borderBottomColor={'#C8102E'} borderBottomWidth={2}>
          <HStack alignItems="center">
            <IconButton icon={<Icon size="lg" as={MaterialIcons} name="menu" color="#C8102E" />} />
          </HStack>
          <HStack alignItems="center">
            <Image size={'2xl'} style={{ resizeMode: 'contain', width: 150, height: 20 }} alt="fallback text" source={ require('../assets/keppellogo.png')} />
          </HStack>
          <HStack alignItems="center">
            <IconButton icon={<Icon size="lg" as={FontAwesome} name="user-circle-o" color="#C8102E" />} />
          </HStack>
        </HStack>

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
                  <HStack  key={item.request_id} p="3" justifyContent="space-between">
                    <Pressable onPress={()=>navigation.navigate("ViewRequest", { id: item.request_id })}>
                      <Center borderWidth="1" borderColor="#C8102E" rounded="md"  >
                        <HStack justifyContent="space-between" w="100%">
                          <HStack alignItems="center" flex={1}>
                            <VStack>
                              <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="clipboard-clock-outline" color="#C8102E" />} />
                              <Text fontSize="10">{item.priority}</Text>
                            </VStack>
                          </HStack>
                          <HStack alignItems="center" flex={2}>
                            <VStack>
                              <Text><Heading size="xs">Case ID:</Heading> {item.request_id}</Text>
                              <Text flexShrink={1}><Heading size="xs">Fault Type:</Heading> {item.asset_name}</Text>
                            </VStack>
                          </HStack>
                          <HStack alignItems="center" flex={1}>
                            <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="chevron-down" color="#C8102E" />} />
                          </HStack>
                        </HStack>
                      </Center>
                    </Pressable>
                  </HStack>
                );
              } 
              )}
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