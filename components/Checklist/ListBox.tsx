import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  HStack,
  Heading,
  Text,
  Box,
  Center,
  Button,
  Icon,
  Pressable,
  VStack,
  IconButton,
} from "native-base";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { CMMSChecklist } from "../../types/interfaces";
import { shortDate, getChecklistStatusColor } from "../../helper";
import { ModuleCardContainer } from "../ModuleLayout";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { ChecklistID } from "../../types/enums";
import { useCurrentUser } from "../../helper/hooks/SWR";
import { Role, ChecklistType } from "../../types/enums";
import { ModuleSimpleModal } from "../ModuleLayout";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ListBox = ({
  checklist,
  navigation,
  setIsHistory,
  setHistoryCL,
}: {
  checklist: CMMSChecklist;
  navigation?: any;
  setIsHistory: React.Dispatch<React.SetStateAction<boolean>>;
  setHistoryCL: React.Dispatch<React.SetStateAction<CMMSChecklist>>;
}) => {
  const user = useCurrentUser();

  const handlePress = () => {
    const clID = checklist.status_id;
    if (clID === ChecklistID.Assigned) {
      navigation.navigate("CompleteChecklistPage", checklist);
    } else if (
      clID === ChecklistID.WorkDone &&
      (user.data.role_id === Role.Manager || user.data.role_id === Role.Admin)
    ) {
      navigation.navigate("ManageChecklistPage", checklist);
    } else if (clID === ChecklistID.Pending) {
      navigation.navigate("CreateChecklistFormPage", {
        checklistId: checklist.checklist_id,
        checklistType: ChecklistType.Record,
      });
    } else {
      navigation.navigate("ViewChecklistPage", checklist);
    }
  };

  const handleHistory = () => {
    setHistoryCL(checklist);
    setIsHistory(true);
  };

  return (
    <Pressable onPress={handlePress}>
      <ModuleCardContainer>
        <VStack>
          <HStack>
            <VStack style={{ maxWidth: 250 }}>
              <Text
                style={{ flex: 1, textAlign: "left" }}
                fontSize={14}
                fontWeight={600}
              >
                {checklist.checklist_id}
              </Text>
            </VStack>
            <VStack style={{ maxWidth: 250 }}>
              <Text
                style={{ flex: 1, textAlign: "left" }}
                fontSize={14}
                fontWeight={600}
              >
                {checklist.chl_name}
              </Text>
            </VStack>
            <VStack marginLeft="auto">
              <Text marginLeft="auto">
                {shortDate(new Date(checklist.created_date))}
              </Text>
            </VStack>
          </HStack>
          <HStack justifyContent="space-between">
            <VStack style={{ alignSelf: "flex-start" }}>
              <HStack alignItems="center">
                <Icon as={EntypoIcon} name="location-pin" size="sm"></Icon>
                <Text fontSize={12} style={{ color: "#454545" }}>
                  {checklist.plant_name}
                </Text>
              </HStack>

              <Text
                fontSize={12}
                fontWeight={600}
                style={{ color: getChecklistStatusColor(checklist.status_id) }}
              >
                {checklist.status}
              </Text>

              <Text>Created By: {checklist.createdbyuser}</Text>
              <Text>Assigned To: {checklist.assigneduser}</Text>
            </VStack>
            <VStack justifyContent="space-around">
              {/* <Button mt={2} backgroundColor="#C70F2B" onPress={handleHistory}>
                                <IconButton
                                _icon= {{
                                    as: MaterialCommunityIcons,
                                    name: "history"
                                }}
                                onPress={handleHistory}
                                >
                                </IconButton>
                            </Button> */}
              <Button
                w="30"
                h="30"
                bg="#C8102E"
                leftIcon={
                  <Icon as={MaterialCommunityIcons} name="history" size="sm" />
                }
                size="xs"
                onPress={handleHistory}
              ></Button>
            </VStack>
          </HStack>
          {/* <VStack marginLeft="auto">

                        <Text marginLeft="auto">
                            {shortDate(new Date(checklist.created_date))}
                        </Text>
                        </VStack> */}
        </VStack>
      </ModuleCardContainer>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  leftSwipeView: {
    backgroundColor: "#dee2e6",
    padding: 3,
    borderTopRightRadius: 5,
    boerderBottomRightRadius: 5,
    width: "30%",
  },
});

export default ListBox;
