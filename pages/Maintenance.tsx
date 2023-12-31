import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, GestureResponderEvent } from "react-native";
import { HStack, Button, Icon, VStack, Text, IconButton, Center, Alert, Box } from "native-base";
import MaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  ModuleHeader,
  ModuleScreen,
  ModuleActionSheet,
  ModuleActionSheetItem,
  ModuleDivider,
  ModuleFullPageModal,
  ModuleSimpleModal,
} from "../components/ModuleLayout";
import ListBox from "../components/Checklist/ListBox";
import instance from "../axios.config";
import { CMMSChecklist, CMMSUser } from "../types/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { _retrieveData, _clear, _storeData } from "../helper/AsyncStorage";
import { checkConnection, subscribeToConnectionChanges } from "../helper/NetInfo";
import ChecklistHistory from "../components/Checklist/ChecklistHistory";
import { useIsFocused } from "@react-navigation/native";
import { ChecklistID, Role } from "../types/enums";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { set } from "react-native-reanimated";
import * as FileSystem from 'expo-file-system';
import Loading from "../components/Loading";

const checklistViews: ModuleActionSheetItem[] = [
  {
    label: "Assigned",
    value: "assigned",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "For Review",
    value: "record",
  },
  {
    label: "Approved",
    value: "approved",
  },
];


const Maintenance = ({ navigation, route }) => {
    const [checklists, setChecklists] = useState<CMMSChecklist[]>([]);
    const [viewType, setViewType] = useState<string>(
        checklistViews[0].value as string
    );
    const [sendCached, setSendCached] = useState<boolean>(false);
    //const [isConnected, setIsConnected] = useState<boolean>(true);
    const [isHistory, setIsHistory] = useState<boolean>(false);
    const [historyCL, setHistoryCL] = useState<CMMSChecklist>();
    const [restricted, setRestricted] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const user: CMMSUser = useSelector<RootState, CMMSUser>((state) => state.user);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEndReached, setIsEndReached] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isListLoading, setIsListLoading] = useState(false);
    const [data, setData] = useState([]);
    const [cachedData, setCachedData] = useState([]);
    const isOffline = useSelector<RootState, boolean>((state) => state.offline);

    const storeFile = async (checklist) => {
      const filePath = FileSystem.documentDirectory + '/checklist.txt';
      const fileContent = JSON.stringify(checklist);

      try {
        await FileSystem.writeAsStringAsync(filePath, fileContent);
        console.log('File stored successfully!');
      } catch (error) {
        console.log('Error storing file:', error);
      }
    };

    const readFile = async () => {
      const filePath = FileSystem.documentDirectory + '/checklist.txt';

      try {
        const content = await FileSystem.readAsStringAsync(filePath);
        console.log('File content retrieved successfully!');
        return content;
      } catch (error) {
        console.log('Error reading file:', error);
      }
    };

    const cachedAssignedList = async (page: number) => {
      const response = await instance.get(`/api/checklist/assigned?page=${currentPage}`);
      const jsonData = response.data.rows;
      const newData = [...cachedData, ...jsonData]; // Append new data to existing data array

      // Create an empty object to keep track of unique objects by their ID
      const uniqueMap = {};

      // Filter the array, only keeping objects with unique IDs
      const uniqueData = newData.filter((item) => {
        if (!uniqueMap[item.checklist_id]) {
          uniqueMap[item.checklist_id] = true; // Mark this ID as seen
          return true; // Include this object in the result
        }
        return false; // Duplicate, exclude from the result
      });

      setCachedData(newData);
      storeFile(uniqueData);
      console.log('checklist offline data', uniqueData)
      console.log('checklist length', uniqueData.length)
    }

    const fetchChecklist = async (viewType: string) => {
      console.log('viewType', viewType)
      setIsListLoading(true);

      if(!isOffline) {
        if (isEndReached) return;

        try {
          const PARAMS = [
            "checklist_id",
            "chl_name",
            "description",
            "plant_name",
            "createdbyuser",
            "assigneduser",
            "status",
            "status_id",
            "created_date",
            "activity_log"
          ]
          const response = await instance.get(`/api/checklist/${viewType}?page=${currentPage}&expand=${PARAMS.join(',')}`);
          const jsonData = response.data.rows;
          const newData = [...data, ...jsonData]; // Append new data to existing data array
          //console.log(newData)
          setCurrentPage(currentPage + 1);
          setData(newData);
          setIsEndReached(jsonData.length < 10);
          setIsLoading(false);
          setIsListLoading(false);

          if(viewType === 'assigned') {
            cachedAssignedList(currentPage);
          }

          return response.data.rows;
        } catch (err) {
          console.log(err);
          console.log('Unable to call checklists')
          setIsLoading(false);
          setIsListLoading(false);
        }

      } else {
        const cachedChecklisting = await readFile();
        setData(JSON.parse(cachedChecklisting));
        console.log('cachedChecklisting', cachedChecklisting)
        setIsLoading(false);
        setIsListLoading(false);
      }
      
    };

    const handleLoadMore = () => {
      if (!isLoading && !isOffline) {
        fetchChecklist(viewType);
      }
    };



    const sendCachedChecklist = async () => {
        if(isOffline) return;

        const cachedChecklists = await _retrieveData("checklist");
        if (cachedChecklists != null) {
            const cachedChecklistsArray = JSON.parse(cachedChecklists);
            for (const index in cachedChecklistsArray) {
                try {
                    const checklist = cachedChecklistsArray[index];
                    console.log("Sending");
                    await instance({
                    url: `/api/checklist/complete/${checklist.checklist_id}`,
                    data: {
                        datajson: checklist.datajson,
                    },
                    method: "patch",
                    });
                    console.log("Finished sending");
                    await AsyncStorage.removeItem("@checklist");
                    console.log("Cached checklists sent");
                    setSendCached(true);
                } catch (e) {
                  console.log(e);
                  console.log('Unable to complete checklist')
                }
            }
        }

        return;
    };

    const offlineFilterChecklist = async () => {
        const cachedChecklists = await _retrieveData("checklist");
        if (cachedChecklists != null) {
            const cachedChecklistsArray = JSON.parse(cachedChecklists) as CMMSChecklist[];
            const cachedChecklistsID = cachedChecklistsArray.map(cl => cl.checklist_id);
            /*setChecklists(prev => {
                return prev.filter(cl => !cachedChecklistsID.includes(cl.checklist_id))
            })*/
            setData(prev => {
              return prev.filter(cl => !cachedChecklistsID.includes(cl.checklist_id))
            });
        }
    }

    useEffect(() => {

      const fetchData = async () => {

        await sendCachedChecklist();

        const result = await fetchChecklist(viewType);
        /*if (result) {
          setChecklists(result);
        } else {
          setChecklists([]);
        }*/

        if (isOffline) {
          offlineFilterChecklist();
        }
      };

      fetchData();

    }, [isOffline, isLoading])

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      setIsEndReached(false);
      setData([]);
      setCurrentPage(1);
    };

    if (isFocused) {
      fetchData();
    }
    
  }, [viewType, isFocused, isOffline]);

  const handleActionChange = (e: GestureResponderEvent, value: string) => {
    /*setViewType(value);
    setCurrentPage(1);
    setData([]);
    setIsLoading(true);*/
  }

  const renderFooter = () => {
    if (isEndReached || isOffline) return (<Center><Text>No more checklists</Text></Center>);
    if (!isListLoading) return null;

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const checklistElements =
    data.length > 0 ? (
      <FlatList
        data={data}
        //keyExtractor={(cl) => cl.checklist_id.toString()}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Adjust the threshold as needed
        renderItem={({ item }) => (
          <ListBox
            checklist={item}
            navigation={navigation}
            setIsHistory={setIsHistory}
            setHistoryCL={setHistoryCL}
          />
        )}
        ListFooterComponent={renderFooter}
      />
    ) : (
      <Text>No Checklist Found</Text>
    );


  return (
    <ModuleScreen navigation={navigation}>
      <ModuleHeader header="Maintenance">
        <HStack space={2}>
          <Button
            w="30"
            padding={2}
            bg="#C8102E"
            leftIcon={<Icon as={AntDesign} name="addfile" size="sm" />}
            size="xs"
            isDisabled={isOffline}
            onPress={() => navigation.navigate("ChecklistTemplatesPage")}
          ></Button>
        </HStack>
      </ModuleHeader>
      {isOffline && <Alert w="100%" status="danger">
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
              You can still access and complete your checklists that have loaded.
            </Box>
          </VStack>
        </Alert>}

      {user && user.role_id !== 4 && <ModuleActionSheet
        items={checklistViews}
        value={viewType}
        setValue={setViewType}
        //onSelect={handleActionChange}
      />}

      <ModuleDivider/>

      <View style={{ marginBottom: isOffline? 200 : 90 }}>
        <VStack space={3}>{isLoading ? <Loading/> : checklistElements}</VStack>
      </View>
      <ModuleSimpleModal
        isOpen={sendCached}
        setOpen={setSendCached}
        title="Cached Checklists have been sent"
        text="Checklists that were not sent previously due to network errors have been submitted. Please reload the page to see the changes"
        icon={"Success"}
      ></ModuleSimpleModal>
      {/* <ModuleFullPageModal title="title" isOpen={isHistory} setOpen={setIsHistory}>
<Text>Hello</Text>
</ModuleFullPageModal> */}
      <ModuleSimpleModal
        isOpen={isHistory}
        setOpen={setIsHistory}
        title="View History"
        text=""
      >
            <ChecklistHistory checklist={historyCL}></ChecklistHistory>
      </ModuleSimpleModal>
    </ModuleScreen>
  );
};

export default Maintenance;
