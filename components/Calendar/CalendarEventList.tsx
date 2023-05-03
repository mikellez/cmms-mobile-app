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
import ScheduleChecklistEvent from "./ScheduleChecklistEvent";
import ScheduleCOPEvent from "./ScheduleCOPEvent";

interface CalendarEventListProps {
    COPItems?: CMMSChangeOfParts[];
    ChecklistItems?: CMMSSchedule[];
}

const CalendarEventList = (props: CalendarEventListProps) => {
    var COPElements;
    var ChecklistElements;
    if (props.COPItems) {
        COPElements = props.COPItems.map((item) => {
            return <ScheduleCOPEvent key={item.copId} COPSchedule={item} />;
        });
    }
    if (props.ChecklistItems) {
        ChecklistElements = props.ChecklistItems.map((item) => {
            return <ScheduleChecklistEvent key={item.scheduleId} checklistSchedule={item} />;
        });
    }
    return (
        <ScrollView>
            <VStack space={3}>
                {ChecklistElements}
                {COPElements}
            </VStack>
        </ScrollView>
    );
};

export default CalendarEventList;
