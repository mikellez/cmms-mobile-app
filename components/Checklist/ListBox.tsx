import React from "react";
import { View, StyleSheet } from "react-native";
import { HStack, Heading, Text, Box, Center, IconButton, Icon, Pressable, VStack } from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { CMMSChecklist } from "../../types/interfaces";
import { shortDate, getChecklistStatusColor } from "../../helper";
import { ModuleCardContainer } from "../ModuleLayout";
import { Swipeable } from "react-native-gesture-handler";
import { ChecklistID } from "../../types/enums";
import { useCurrentUser } from "../../helper/hooks/SWR";
import { Role } from "../../types/enums";

const ListBox = ({ checklist, navigation }:
     { checklist: CMMSChecklist, navigation?: any }
) => {
    
    const user = useCurrentUser();
    console.log(user.data);

    const handlePress = () => {
        const clID = checklist.status_id;
        if (clID === ChecklistID.Assigned) 
        {
            navigation.navigate("CompleteChecklistPage", checklist);
        } 
        else if (
            clID === ChecklistID.WorkDone && (
                user.data.role_id === Role.Manager ||
                user.data.role_id === Role.Admin
            )) 
        {
            navigation.navigate("ManageChecklistPage", checklist);
        } else {
            navigation.navigate("ViewChecklistPage", checklist);
        }
    }
        
    return (
        <Pressable
            onPress={handlePress}
        >

                <ModuleCardContainer>
                    <HStack>
                        <VStack>
                            <Text
                                fontSize={14}
                                fontWeight={600}
                            >
                                {checklist.chl_name}
                            </Text>

                            <HStack alignItems="center">
                                <Icon as={EntypoIcon} name="location-pin" size="sm"></Icon>
                                <Text
                                    fontSize={12}
                                    style={{color: '#454545'}}
                                >
                                    {checklist.plant_name}
                                </Text>
                            </HStack>

                            <Text
                                fontSize={12}
                                fontWeight={600}
                                style={{color: getChecklistStatusColor(checklist.status_id)}}
                            >
                                {checklist.status}
                            </Text>

                            <Text>
                                Created By: {checklist.createdbyuser}
                            </Text>

                            <Text>
                                Assigned To: {checklist.assigneduser}
                            </Text>
                        </VStack>

                        <Text marginLeft="auto">
                            {shortDate(new Date(checklist.created_date))}
                        </Text>
                    </HStack>
                </ModuleCardContainer>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    leftSwipeView: {
        backgroundColor: '#dee2e6',
        padding: 3,
        borderTopRightRadius: 5,
        boerderBottomRightRadius: 5,
        width: "30%",
    }
})

export default ListBox;