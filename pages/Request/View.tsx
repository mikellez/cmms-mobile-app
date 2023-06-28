import React, { useEffect, useState } from "react";
import { Flex, HStack, Icon, IconButton, NativeBaseProvider, Image, Center, Pressable, Text, VStack, Heading, Button, ScrollView, Divider } from "native-base";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import instance from "../../axios.config";
import moment from "moment";

import ImageComponent from "../../components/Image";
import App from "../App";
import { CMMSRequest } from "../../types/interfaces";
import { shortDateWithDay } from "../../helper/DateFormat";
import { getRequestPriority, getRequestStatus } from "../../helper";
import { ActivityIndicator } from "react-native";
import Loading from "../../components/Loading";


const ReportScreen = ({ route, navigation }) => {
  const [requestItems, setRequestItems] = useState<CMMSRequest>();
  const [loading, setLoading] = useState<boolean>(false)

  const fetchRequest = async () => {
    setLoading(true);
    const { id } = route.params;
    await instance.get(`/api/request/${id}`)
    .then((res)=> {
      setRequestItems(res.data);
      setLoading(false);
    })
    .catch((err) => {
        console.log(err)
    });
  };


  useEffect(() => {
    fetchRequest();
  }, []);


  const activityLogLastItem = (items) => {
    return items?.activity_log[items?.activity_log.length-1];
  }

  return (
    <App navigation={navigation} layout={undefined} >

      {loading && <Loading />}
      {!loading && <HStack flex={1} >
        <VStack flex={1} px={3} py={3}>
          <HStack w="100%" justifyContent="space-between">
            <HStack alignItems="center">
                <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="chevron-left" color="#C8102E" />} onPress={()=>navigation.goBack()}/>
              <Heading size="md" color="#C8102E">Case ID: {requestItems?.request_id}</Heading>
            </HStack>
            <HStack alignItems="center">
              <Heading size="sm"><Text color={getRequestStatus(requestItems?.status)?.color}>{requestItems?.status}</Text></Heading>
            </HStack>
          </HStack>
          <HStack flexDirection="row-reverse">
            <HStack alignItems="center">
              {requestItems?.priority && 
                <>
                <IconButton icon={<Icon size="lg" as={AntDesign} name={getRequestPriority(requestItems.priority).icon} color={getRequestPriority(requestItems.priority).color} />} />
                <Text color={requestItems.priority && getRequestPriority(requestItems.priority).color}>{ requestItems?.priority }</Text>
                </>
              }
            </HStack>
          </HStack>

          <ScrollView w="100%" h="200" px={3}>

            <Text><Heading size="xs">Created On: </Heading>{ requestItems?.created_date ? moment(requestItems.created_date).format('MMMM Do YYYY, h:mm:ss a') : "NIL" }</Text>
            <Text><Heading size="xs">Reported By: </Heading>{ requestItems?.created_by }</Text>
            <Text><Heading size="xs">Assigned To: </Heading>{ (requestItems?.assigned_user_name || '').trim() || 'NIL'}</Text>

            <Heading size="sm" pt="3" pb="1" color="#C8102E">
              Fault Type
            </Heading>

            <Divider w="100%" mb="3"/>

            <Text>{requestItems?.fault_name ?? 'No text'}</Text>

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

            {activityLogLastItem(requestItems)?.activity_type === 'REJECTED' && 
              <>
                <Heading size="sm" pt="3" pb="1" color="#C8102E">
                  Rejection Comment
                </Heading>

                <Divider w="100%" mb="3"/>

                <Text>{activityLogLastItem(requestItems)?.remarks ?? 'No Text'}</Text>
              </>
            }

            {activityLogLastItem(requestItems)?.activity_type === 'APPROVED' && 
              <>
                <Heading size="sm" pt="3" pb="1" color="#C8102E">
                  Approved Comment
                </Heading>

                <Divider w="100%" mb="3"/>

                <Text>{activityLogLastItem(requestItems)?.remarks ?? 'No Text'}</Text>
              </>
            }

          </ScrollView>

        </VStack>
      </HStack>
      }
      
    </App>
  );
};

export default ReportScreen;