import React, { useEffect, useState } from "react";
import { Flex, HStack, Icon, IconButton, NativeBaseProvider, Image, Center, Pressable, Text, VStack, Heading, Button, ScrollView, Box } from "native-base";
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';

import instance from "../axios.config";
import ListBox from "../components/Request/ListBox";
import { ModuleHeader, ModuleScreen } from "../components/ModuleLayout";
import App from "./App";

export type ItemData = {
  request_id: number;
  request_name: string;
  priority: string;
  status: string;
  asset_name: string;
  plant_name: string;
};

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
  //requesthistory?: string;
  //complete_comments?: string;
  //completion_file?: any;
  //rejection_comments: string;
}

const BACON_IPSUM =
  'Bacon ipsum dolor amet chuck turducken landjaeger tongue spare ribs. Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';

const CONTENT = [
  {
    title: 'First',
    content: BACON_IPSUM,
  },
  {
    title: 'Second',
    content: BACON_IPSUM,
  },
  {
    title: 'Third',
    content: BACON_IPSUM,
  },
  {
    title: 'Fourth',
    content: BACON_IPSUM,
  },
  {
    title: 'Fifth',
    content: BACON_IPSUM,
  },
];


const ReportScreen = ({ navigation }) => {
  const [requestItems, setRequestItems] = useState([]);

  const fetchRequest = async () => {

    await instance.get(`/api/request/filter/0/0/date/all`)
    .then((res)=> {
      setRequestItems(res.data.rows);
    })
    .catch((err) => {
        console.log(err)
    });
  };

  useEffect(() => {
    fetchRequest();
  }, []);


  const [state, setState] = useState({
    activeSections: [],
    collapsed: true,
    multipleSelect: false,
  });

  const { multipleSelect, activeSections } = state;

  const toggleExpanded = () => {
    setState({ collapsed: !state.collapsed });
  };

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
              <HStack alignItems="center" px={3}>
                <VStack>
                  <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="clipboard-clock-outline" color="#C8102E" />} />
                  <Text fontSize="10">{item.priority}</Text>
                </VStack>
              </HStack>
              <HStack alignItems="center" flex={3}>
                <VStack>
                  <HStack w="100%" justifyContent="space-between">
                    <Text><Heading size="xs">Case ID:</Heading> {item.request_id}</Text>
                    <Text><Heading size="xs">{item.status}</Heading></Text>
                  </HStack>
                  <Text flexShrink={1}><Heading size="xs">Fault Type:</Heading> {item.asset_name}</Text>
                </VStack>
              </HStack>
              <HStack alignItems="center" flex={1} marginTop={3}>
                <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name={isActive ? 'chevron-up' : 'chevron-down'} color="#C8102E" />} />
              </HStack>
            </HStack>
          {/*</Pressable>*/}
        </HStack>
    {/*</Box>*/}

      </Animatable.View>
    );
  };

  const renderContent = (item, _, isActive) => {
    return (
      <Animatable.View
        duration={100}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        {/*<Animatable.Text animation={isActive ? 'bounceIn' : undefined}>*/}
          {/*<Box key={`${item.request_id}_2`} py="2" px="2" mx="2" rounded="md" _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} borderWidth={1} borderColor='#C8102E'>*/}
            <VStack >
              <Text><Heading size="xs">Location:</Heading> {item.plant_name}</Text>
              <Text><Heading size="xs">Asset Name:</Heading> {item.asset_name}</Text>
              <Text><Heading size="xs">Requested By:</Heading> {item?.request_name ?? 'NIL'}</Text>
              <HStack justifyContent="center" w="100%" flex={1}>
                  <IconButton icon={<Icon size="lg" as={AntDesign} name="eyeo" color="#C8102E" />} onPress={()=>navigation.navigate("ViewRequest", { id: item.request_id })}/>
                  {
                    ['PENDING', 'ASSIGNED'].includes(item.status)
                    && <IconButton icon={<Icon size="lg" as={AntDesign} name="adduser" color="#C8102E" />} onPress={()=>navigation.navigate("AssignRequest", { id: item.request_id })}/>
                  }
                  <IconButton icon={<Icon size="lg" as={AntDesign} name="check" color="#C8102E" />} onPress={()=>navigation.navigate("CompleteRequest", { id: item.request_id })}/>
              </HStack>

            </VStack>
          {/*</Box>*/}
        {/*</Animatable.Text>*/}
      </Animatable.View>
    );
  }

  return (
    <ModuleScreen navigation={navigation}>

      <ModuleHeader header="Report">
        <HStack >
          <Button w="100" padding={2} bg="#C8102E" leftIcon={<Icon as={MaterialCommunityIcons} name="filter" size="sm"/>} size="xs">
            Filter
          </Button>
        </HStack>
      </ModuleHeader>

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

      <Accordion
        activeSections={activeSections}
        sections={requestItems}
        touchableComponent={TouchableOpacity}
        expandMultiple={multipleSelect}
        renderHeader={renderHeader}
        renderContent={renderContent}
        duration={100}
        onChange={setSections}
        renderAsFlatList={true}
      />

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
    margin: 10,
    marginBottom: 0,
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
    paddingTop: 10,
    paddingRight:10,
    paddingLeft: 10,
    paddingBottom: 10,
    marginLeft:10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
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