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
import React, { useEffect, useState } from "react";
import { CMMSChangeOfParts, CMMSChecklist, CMMSSchedule } from "../../types/interfaces";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ModuleCardContainer } from "../ModuleLayout";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ScheduleChecklistEvent from "./ScheduleChecklistEvent";
import ScheduleCOPEvent from "./ScheduleCOPEvent";
import { DateData } from "react-native-calendars";

interface CalendarEventListProps {
    dateSelected: DateData;
    COPItems: CMMSChangeOfParts[];
    ChecklistItems: CMMSSchedule[];
}

const CalendarEventList = (props: CalendarEventListProps) => {
    const [COPElements, setCOPElements] = useState([]);
    const [ChecklistElements, setChecklistElements] = useState([]);

    useEffect(() => {
        if (props.COPItems) {
            setCOPElements(
                props.COPItems.map((item) => {
                    return <ScheduleCOPEvent key={item.copId} COPSchedule={item} />;
                })
            );
        } else {
            setCOPElements([]);
        }
        if (props.ChecklistItems) {
            setChecklistElements(
                props.ChecklistItems.map((item) => {
                    return (
                        <ScheduleChecklistEvent key={item.scheduleId} checklistSchedule={item} />
                    );
                })
            );
        } else {
            setChecklistElements([]);
        }
    }, [props.COPItems, props.ChecklistItems, props.dateSelected]);

    console.log(COPElements);
    console.log(ChecklistElements);
    return (
        <ScrollView>
            <Text>Date selected: {props.dateSelected.dateString}</Text>
            <VStack space={3}>
                {ChecklistElements}
                {COPElements}
            </VStack>
            {!ChecklistElements.length && !COPElements.length && (
                <Text> There are no events on this day</Text>
            )}
        </ScrollView>
    );
};

export default CalendarEventList;
