import {
    Text,
    Box,
    HStack,
    IconButton,
    StatusBar,
    NativeBaseProvider,
    Icon,
    Image,
    Pressable,
    Center,
    VStack,
    Flex,
    Container,
    Heading,
    Button,
    Card,
} from "native-base";
import React from "react";
import { CMMSChangeOfParts, CMMSChecklist, CMMSSchedule } from "../../types/interfaces";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ModuleCardContainer } from "../ModuleLayout";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface CalendarEventListProps {
    COPItems?: CMMSChangeOfParts[];
    ChecklistItems?: CMMSSchedule[];
}

const CalendarEventList = (props: CalendarEventListProps) => {
    const COPElements = props.COPItems.map((item) => {
        return <Text key={item.copId}> {item.copId} </Text>;
    });

    const ChecklistElements = props.ChecklistItems.map((item) => {
        return (
            <ModuleCardContainer key={item.scheduleId}>
                <TouchableOpacity>
                    <HStack>
                        <VStack>
                            <HStack>
                                <Icon
                                    mb="1"
                                    as={<MaterialCommunityIcons name="clipboard-clock-outline" />}
                                    color="#C8102E"
                                    size="8"
                                />
                                <Text fontSize={14} fontWeight={600}>
                                    {item.checklistName}
                                </Text>
                            </HStack>

                            <HStack alignItems="center">
                                <Icon as={EntypoIcon} name="location-pin" size="sm"></Icon>

                                <Text fontSize={12} style={{ color: "#454545" }}>
                                    {item.plantName}
                                </Text>
                            </HStack>

                            <Text>Remarks: {item.remarks}</Text>
                        </VStack>
                    </HStack>
                </TouchableOpacity>
            </ModuleCardContainer>
        );
    });
    return (
        <ScrollView>
            <VStack space={3}>
                {/* {COPElements} */}
                {ChecklistElements}
            </VStack>
        </ScrollView>
    );
};

export default CalendarEventList;
