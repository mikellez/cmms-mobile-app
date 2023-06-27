import React, { useEffect, useState } from "react";
import { Flex, HStack, Icon, IconButton, NativeBaseProvider, Image, Center, Pressable, Text, VStack, Heading, Button, ScrollView, Box } from "native-base";
import { FlatList, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';
import { useIsFocused } from '@react-navigation/native';
import { Table, Rows } from "react-native-table-component";

import instance from "../axios.config";
import ListBox from "../components/Request/ListBox";
import { ModuleActionSheet, ModuleActionSheetItem, ModuleHeader, ModuleScreen, ModuleSimpleModal } from "../components/ModuleLayout";
import App from "./App";
import { _retrieveData } from "../helper/AsyncStorage";
import { CMMSUser, CMMSRequest, CMMSOffline } from "../types/interfaces";
import { Role } from "../types/enums";
import { set } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getRequestPriority, getRequestStatus } from "../helper";
import Loading from "../components/Loading";
import moment from "moment";


const requestlistViews: ModuleActionSheetItem[] = [
  {
    label: "Pending",
    value: "pending"
  },
  {
    label: "Assigned",
    value: "assigned"
  },
  {
    label: "For Review",
    value: "review"
  },
  {
    label: "Approved",
    value: "approved"
  },
];

const ReportScreen = ({ navigation }) => {

  const isFocused = useIsFocused();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [requestItems, setRequestItems] = useState([]);
  const [viewType, setViewType] = useState<string>(requestlistViews[0].value as string);
  const [showDropdown, setShowDropdown] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState([]);
  const isOffline = useSelector<RootState, boolean>((state) => state.offline);
  const user: CMMSUser = useSelector<RootState, CMMSUser>((state) => state.user);

  useEffect(() => {
    const { role_id } = user;

    if(isOffline) {
      setShowDropdown(false); 
    } else {
      if(role_id === Role.Specialist) {
        setViewType("assigned");
        setShowDropdown(false);
      }
    }
  }, [user.role_id]);


  const fetchRequest = async (viewType) => {
    const PARAMS = [
      "request_id",
      "fault_name",
      "plant_name",
      "asset_name",
      "activity_log",
      "created_date",
      "status"
    ]

    const response = await instance.get(`/api/request/${viewType}?expand=${PARAMS.join(',')}`)

    try {
      return response.data.rows;
    } catch (e) {
      console.log(e)
      console.log('Unable to fetch requests')
    }
    
  };

  useEffect(() => {
    setIsReady(false);

    if(isFocused && !isOffline) {

      fetchRequest(viewType)
      .then((res)=> setRequestItems(res))
      .then(()=> setIsReady(true));

      setSections([])
    }
  }, [isFocused, viewType]);

  const showHistoryDetail = (data) => {
    const historyData = [];
    for(let i = 0; i < data.length; i++){
      historyData.push(["No: ", i+1]);
      historyData.push(["Status: ", data[i].activity_type]);
      historyData.push(["Action: ", data[i].activity]);
      historyData.push(["Date: ", data[i].date]);
      historyData.push(["Role: ", data[i].role]);
      historyData.push(["Name: ", data[i].name]);
      historyData.push(["", ""]);
    }

    console.log(historyData);

    setHistoryData(historyData);
    setShowHistory(true);
  }


  const [state, setState] = useState({
    activeSections: [],
  });

  const { activeSections } = state;

  const setSections = (sections) => {
    setState({ activeSections: sections.includes(undefined) ? [] : sections, });
  };

  const renderHeader = (item, _, isActive) => {

    return (
      <Animatable.View
        duration={100}
        style={[ styles.header, isActive ? styles.active : styles.inactive]}
      >

      {/*<Box key={item.request_id} px="1" mx="2" rounded="md" _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} borderWidth={1} borderColor='#C8102E'>*/}
        <HStack justifyContent="space-between" flex={1}>
          {/*<Pressable onPress={()=>navigation.navigate("ViewRequest", { id: item.request_id })}>*/}
            <HStack justifyContent="space-between" w="100%">
              <HStack alignItems="center" px={2}>
                <VStack alignItems="center">
                  <IconButton icon={<Icon size="md" as={AntDesign} name={item.priority && getRequestPriority(item.priority).icon} color={item.priority && getRequestPriority(item.priority).color} />} />
                  <Text fontSize="10" color={item.priority && getRequestPriority(item.priority).color}>{item.priority}</Text>
                </VStack>
              </HStack>
              <HStack alignItems="center" flex={3}>
                <VStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text><Heading size="xs">Case ID:</Heading> {item.request_id}</Text>
                  </HStack>
                  <Text flexShrink={1}><Heading size="xs">Fault Type:</Heading> {item.fault_name}</Text>
                </VStack>
              </HStack>
              <HStack alignItems="center" flex={1} marginTop={3} marginBottom={3}>
                <VStack alignItems={'center'}>
                  <Text fontSize="12" color={item.status && getRequestStatus(item.status).color} bold>{item.status}</Text>
                  <Icon size="lg" as={MaterialCommunityIcons} name={isActive ? 'chevron-up' : 'chevron-down'} color="#C8102E" />
                </VStack>
              </HStack>
            </HStack>
          {/*</Pressable>*/}
        </HStack>
    {/*</Box>*/}

      </Animatable.View>
    );
  };

  const renderContent = (item, _, isActive) => {
    const { role_id } = user;

    return (
      <Animatable.View
        duration={100}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        {/*<Animatable.Text animation={isActive ? 'bounceIn' : undefined}>*/}
          {/*<Box key={`${item.request_id}_2`} py="2" px="2" mx="2" rounded="md" _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} borderWidth={1} borderColor='#C8102E'>*/}
            <VStack >
              <HStack alignItems="center">
                  <Icon as={EntypoIcon} color={'#C8102E'} name="location-pin" size="md"></Icon>
                  <Text >{item.plant_name}</Text>
              </HStack>
              <Text><Heading size="xs">Asset Name:</Heading> {item.asset_name}</Text>
              <Text><Heading size="xs">Requested By:</Heading> {item?.request_name ?? 'NIL'}</Text>
              <Text><Heading size="xs">Created On:</Heading> {`${moment(new Date(item.created_date)).format('MMMM Do YYYY, h:mm:ss a')}`}</Text>
              <HStack justifyContent="center" w="100%" flex={1}>
                  <IconButton icon={<Icon size="lg" as={AntDesign} name="eyeo" color="#C8102E" />} onPress={()=>navigation.navigate("ViewRequest", { id: item.request_id })}/>
                  <IconButton icon={<Icon size="lg" as={AntDesign} name="link" color="#C8102E" />} onPress={()=>navigation.navigate("CorrectiveRequest", { id: item.request_id, plant: item.plant_id, asset: item.psa_id, fault: item.fault_id })}/>
                  {
                    ['PENDING', 'ASSIGNED'].includes(item.status)
                    && <IconButton icon={<Icon size="lg" as={AntDesign} name="adduser" color="#C8102E" />} onPress={()=>navigation.navigate("AssignRequest", { id: item.request_id })}/>
                  }
                  
                  {
                    ['COMPLETED', 'REJECTED'].includes(item.status)
                    && [1, 2, 3].includes(role_id)
                    && <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="sticker-check-outline" color="#C8102E" />} onPress={()=>navigation.navigate("ManageRequest", { id: item.request_id })}/>
                  }

                  {
                    ['ASSIGNED'].includes(item.status) &&
                    <IconButton icon={<Icon size="lg" as={AntDesign} name="check" color="#C8102E" />} onPress={()=>navigation.navigate("CompleteRequest", { id: item.request_id })}/>
                  }
                  <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="history" color="#C8102E" />} onPress={()=>showHistoryDetail(item.activity_log)}/>
              </HStack>

            </VStack>
          {/*</Box>*/}
        {/*</Animatable.Text>*/}
      </Animatable.View>
    );
  }

  const widthArr = [120, 150];

  return (
    <ModuleScreen navigation={navigation}>

      <ModuleHeader header="Report">
        <HStack >
          {/*<Button padding={2} bg="#C8102E" leftIcon={<Icon as={MaterialCommunityIcons} name="filter" size="sm"/>} size="xs"/>*/}
        </HStack>
      </ModuleHeader>

      {showDropdown && <ModuleActionSheet 
          items={requestlistViews}
          value={viewType}
          setValue={setViewType}
      />}

      <Box backgroundColor="#F9F7F7" px="1" py="1" marginTop="10" marginBottom="10" rounded="md" _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} borderWidth={1} borderStyle={'dashed'} borderColor='#C8102E'>
        <Center>
          <Pressable onPress={()=>navigation.navigate("CreateRequest")}>
            <HStack alignItems={'center'}>
              <IconButton icon={<Icon size="sm" as={MaterialCommunityIcons} name="plus" color="#C8102E" />} />
              <Text color="#C8102E">Add new request</Text>
            </HStack>
          </Pressable>
        </Center>
      </Box>

      {/*!isReady && !isOffline && <Center><Text>Loading ...</Text></Center>*/}
      {!isReady && !isOffline && <Loading/>}
      {isOffline && 
        <Center>
          <Icon as={MaterialCommunityIcons} name="wifi-off" size="lg" />
          <Text style={{ marginTop: 10 }}>You are current offline ...</Text>
        </Center>
      }
      {isReady && requestItems.length === 0 && <Center><Text>No Requests</Text></Center>}

      { isReady &&
        <Accordion
          activeSections={activeSections}
          sections={requestItems}
          touchableComponent={TouchableOpacity}
          renderHeader={renderHeader}
          renderContent={renderContent}
          duration={100}
          onChange={setSections}
          renderAsFlatList={true}
        />
      }
      <ModuleSimpleModal
        title="History"
        isOpen={showHistory}
        setOpen={setShowHistory} text={""}      >
          <Table >
              <Rows
                  data={historyData}
                  widthArr={widthArr}
                  style={{ paddingTop: 5, paddingBottom: 5, borderTopColor: "#ffff", borderTopWidth: 1,  }}
              ></Rows>
          </Table>
      </ModuleSimpleModal>

      {/*<HStack px="5" py="5" w="100%" justifyContent="space-between">
        <HStack>
          <Heading size="md" color="#C8102E">Request</Heading>
        </HStack>
        <HStack >
          <Heading size="md" color="#C8102E">Checklist</Heading>
        </HStack>
      </HStack>*/}
      {/*<ScrollView w="100%" h="80">*/}

      {/*<FlatList
        data={requestItems}
        keyExtractor={(item) => item.request_id.toString()}
        renderItem={({item}: {item: ItemData})=>{
          return (
            <ListBox item={item} navigation={navigation}/>
          );
        }}
      />*/}

      {/*requestItems.map((item) =>{
          return (
            <ListBox item={item} navigation={navigation} />
          );
        } 
      )
      */}
      {/*</ScrollView>*/}

    </ModuleScreen>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#C8102E'
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    backgroundColor: '#fff',
    paddingRight:10,
    paddingLeft: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#D9D9D9',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  active: {
    backgroundColor: '#fff',
  },
  inactive: {
    //backgroundColor: 'rgba(245,252,255,1)',
    backgroundColor: '#fff',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
});