import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { HStack, Button, Icon, VStack, Text, IconButton } from "native-base";
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
  ModalIcons,
} from "../components/ModuleLayout";
import ListBox from "../components/Checklist/ListBox";
import instance from "../axios.config";
import { CMMSChecklist, CMMSUser } from "../types/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { _retrieveData, _clear } from "../helper/AsyncStorage";
import { checkConnection } from "../helper/NetInfo";
import { Role } from "../types/enums";

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

const fetchChecklist = async (viewType: string) => {
  try {
    const response = await instance.get(`/api/checklist/${viewType}`);
    return response.data.rows;
  } catch (err) {
    console.log(err);
  }
};

const Maintenance = ({ navigation, route }) => {
  const [checklists, setChecklists] = useState<CMMSChecklist[]>([]);
  const [viewType, setViewType] = useState<string>(
    checklistViews[0].value as string
  );
  const [sendCached, setSendCached] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const sendCachedChecklist = async () => {
    const cachedChecklists = await _retrieveData("checklist");
    if (cachedChecklists != null) {
      const cachedChecklistsArray = JSON.parse(cachedChecklists);
      let error = false;
      await checkConnection(setIsConnected);
      if (isConnected) {
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
          } catch (e) {
            console.log(e);
            error = true;
          }
        }
        if (!error) {
          await AsyncStorage.removeItem("@checklist");
          console.log("Cached checklists sent");
          setSendCached(true);
          const [showDropdown, setShowDropdown] = useState<boolean>(true);

          const [user, setUser] = useState<CMMSUser>({
            id: 0,
            role_id: 0,
            role_name: "",
            name: "",
            email: "",
            fname: "",
            lname: "",
            username: "",
          });

          const fetchUser = async () => {
            const user = await _retrieveData("user");
            setUser(JSON.parse(user));
          };

          useEffect(() => {
            fetchUser();
            const { role_id } = user;

            if (role_id === Role.Specialist) {
              setViewType("assigned");
              setShowDropdown(false);
            }
          }, []);
        }
      }
    }
  };

  useEffect(() => {
    sendCachedChecklist();
    fetchChecklist(viewType).then((result) => {
      if (result) setChecklists(result);
      else setChecklists([]);
    });
  }, [viewType, navigation]);

  const checklistElements =
    checklists.length > 0 ? (
      <FlatList
        data={checklists}
        keyExtractor={(cl) => cl.checklist_id.toString()}
        renderItem={({ item }) => (
          <ListBox checklist={item} navigation={navigation} />
        )}
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
            onPress={() => navigation.navigate("ChecklistTemplatesPage")}
          ></Button>
        </HStack>
      </ModuleHeader>

      {showDropdown && (
        <ModuleActionSheet
          items={checklistViews}
          value={viewType}
          setValue={setViewType}
        />
      )}

      <ModuleDivider />

      <View style={{ marginBottom: 90 }}>
        <VStack space={3}>{checklistElements}</VStack>
      </View>
      <ModuleSimpleModal
        isOpen={sendCached}
        setOpen={setSendCached}
        title="Cached Checklists have been sent"
        text="Checklists that were not sent previously due to network errors have been submitted"
        icon={"Success"}
      ></ModuleSimpleModal>
    </ModuleScreen>
  );
};

export default Maintenance;
