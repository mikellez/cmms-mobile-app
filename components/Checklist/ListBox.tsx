import React from "react";
import { View, StyleSheet } from "react-native";
import { HStack, Heading, Text, Box, Center, IconButton, Icon, Pressable, VStack } from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { CMMSChecklist } from "../../types/interfaces";
import { shortDate, getChecklistStatusColor } from "../../helper";
import { ModuleCardContainer } from "../ModuleLayout";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const ListBox = ({ checklist, navigation }:
     { checklist: CMMSChecklist,navigation?: any }) => {

    const rightAction = () => {
        return (
            <View
                style={styles.leftSwipeView}
            >
                <Text>Hello</Text>
            </View>
        )
    }

    const page = checklist.status_id === 4 ? 
        "ManageChecklistPage" :
        checklist.status_id === 2 ?
        "CompleteChecklistPage" : ""

    return (
        <Pressable
            onPress={() => {navigation.navigate(page, checklist)}}
        >
            <Swipeable
                renderRightActions={rightAction}
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
            </Swipeable>
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