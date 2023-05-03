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
import { View, StyleSheet, ScrollView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import App from "./App";
import {
    Agenda,
    DateData,
    AgendaEntry,
    AgendaSchedule,
    CalendarProvider,
    WeekCalendar,
    AgendaList,
    Calendar,
} from "react-native-calendars";
import instance from "../axios.config";
import { TouchableOpacity } from "react-native";
import {
    ModuleHeader,
    ModuleScreen,
    ModuleActionSheet,
    ModuleActionSheetItem,
    ModuleDivider,
} from "../components/ModuleLayout";
import axios from "axios";
import { shortDate } from "../helper";
import CalendarEventList from "../components/Calendar/CalendarEventList";
import { CMMSChecklist } from "../types/interfaces";

export interface ScheduleInfo {
    assigned_fnames: string[];
    assigned_lnames: string[];
    assigned_roles: string[];
    assigned_emails: string[];
    assigned_usernames: string[];
    assigned_ids: number[];
    calendar_dates: string[];
    checklist_id: number;
    checklist_name: string;
    start_date: Date;
    end_date: Date;
    prev_start_date?: Date;
    prev_end_date?: Date;
    period: number;
    plant: string;
    plantId: number;
    remarks: string;
    schedule_id: number;
    timeline_id: number;
    exclusionList: number[];
    isSingle: boolean;
    index?: number;
    status?: number;
}

const getSchedules = async (id: number) => {
    try {
        const response = await instance.get<ScheduleInfo[]>(`/api/schedule/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

const CalendarTab = ({ navigation }) => {
    const [items, setItems] = useState({});
    const [selectedPlant, setSelectedPlant] = useState<number>(0);
    const [isReady, setIsReady] = useState<boolean>(false);
    let markedDates = {};
    const [markedDatesProp, setMarkedDatesProp] = useState({});
    const [selectDatesProp, setSelectDatesProp] = useState({});
    const [checklistItems, setChecklistItems] = useState<CMMSChecklist[]>([]);

    const addItems = async () => {
        return await getSchedules(selectedPlant).then((results) => {
            results.forEach((result) => {
                // console.log(result);
                result.calendar_dates.forEach((day) => {
                    markedDates[day] = { marked: true };

                    // console.log(day);
                    var newItems = items;
                    if (!newItems[day]) {
                        newItems[day] = [];
                    }
                    newItems[day].push({
                        scheduleId: result.schedule_id,
                        checklistId: result.checklist_id,
                        checklistName: result.checklist_name,
                        plantName: result.plant,
                        plantId: result.plantId,
                        date: day,
                        startDate: result.start_date,
                        endDate: result.end_date,
                        period: result.period,
                        assignedIds: result.assigned_ids,
                        assignedUsers: result.assigned_usernames,
                        remarks: result.remarks,
                    });
                    setItems(newItems);
                    // 02-05-2023 : [{obj1},{obj2}]

                    // 2nd
                    // setItems((prev) => {
                    //     if (!prev[day]) {
                    //         return {
                    //             ...prev,
                    //             day: [
                    //                 {
                    //                     name: result.checklist_id,
                    //                     day: day,
                    //                 },
                    //             ],
                    //         };
                    //     } else {
                    //         var newItems = prev;
                    //         newItems[day].push({
                    //             name: result.checklist_id,
                    //             day: day,
                    //         });
                    //         return newItems;
                    //     }
                    // });
                });
            });
        });
    };

    useEffect(() => {
        setIsReady(false);
        setItems({});
        // console.log(selectedPlant);
        addItems().then(() => {
            setMarkedDatesProp(markedDates);
            setSelectDatesProp(markedDates);
            setIsReady(true);
        });
    }, [selectedPlant]);

    function timeToString(time: number) {
        const date = new Date(time);
        return date.toISOString().split("T")[0];
    }

    // const loadItems = (day: DateData) => {
    //     console.log(day);
    //     setTimeout(() => {
    //         for (let i = -15; i < 20000; i++) {
    //             const time = day.timestamp + i * 24 * 60 * 60 * 1000;
    //             const strTime = timeToString(time);

    //             if (!items[strTime]) {
    //                 items[strTime] = [];

    //                 const numItems = Math.floor(Math.random() * 3 + 1);
    //                 for (let j = 0; j < numItems; j++) {
    //                     items[strTime].push({
    //                         name: "Item for " + strTime + " #" + j,
    //                         height: Math.max(50, Math.floor(Math.random() * 150)),
    //                         day: strTime,
    //                     });
    //                 }
    //             }
    //         }
    //     });
    //     // console.log(items);
    // };

    const renderPress = (day: DateData) => {
        console.log(items[day.dateString]);
        console.log(day.dateString);
        setChecklistItems(items[day.dateString]);
        setSelectDatesProp({
            ...markedDatesProp,
            [day.dateString]: { marked: true, selected: true },
        });
    };

    const renderItem = (item) => {
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: "white",
                    flex: 1,
                    borderRadius: 5,
                    padding: 10,
                    marginRight: 10,
                    marginTop: 30,
                    height: 320,
                }}
            >
                {/* // <Card> */}
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 300,
                    }}
                >
                    <Text> Schedule ID: {item.scheduleId}</Text>
                    <Text> Checklist ID: {item.checklistId}</Text>
                    <Text> Plant: {item.plant}</Text>
                    <Text> Date: {shortDate(new Date(item.date))}</Text>
                    <Text> Start Date: {shortDate(new Date(item.startDate))}</Text>
                    <Text> End Date:{shortDate(new Date(item.endDate))}</Text>
                    <Text> Recurring Period: {item.period}</Text>
                    <Text> Assigned To: {item.assignedUsers}</Text>
                    <Text> Remarks: {item.remarks}</Text>
                </View>
                {/* // </Card> */}
            </TouchableOpacity>
        );
    };
    // const renderEmptyDate = () => {
    //     return (
    //         <TouchableOpacity style={{ marginRight: 10, marginTop: 30, height: 300 }}>
    //             <Card>
    //                 <View>
    //                     <Text> No EVENTS </Text>
    //                 </View>
    //             </Card>
    //         </TouchableOpacity>
    //     );
    // };

    // const pressButton = () => {
    //     console.log(items);
    // };

    // if (isReady) {
    //     console.log(items);
    // }

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Calendar">
                <HStack>
                    <Button
                        w="30"
                        padding={2}
                        bg="#C8102E"
                        leftIcon={<Icon as={MaterialCommunityIcons} name="filter" size="sm" />}
                        size="xs"
                        // onPress={pressButton}
                    ></Button>
                </HStack>
            </ModuleHeader>

            <ModuleDivider />
            {/* <CalendarProvider date="2023-05-02" showTodayButton> */}
            {/* <WeekCalendar /> */}
            {/* <AgendaList
                    sections={items}
                    // renderItem={renderItem}
                    // scrollToNextEvent
                    // sectionStyle={styles.section}
                    // dayFormat={'yyyy-MM-d'}
                /> */}
            {/* </CalendarProvider> */}
            {isReady && (
                <View>
                    <Calendar markedDates={selectDatesProp} onDayPress={renderPress} />
                    <ModuleDivider />
                </View>
            )}
            {isReady && (
                <ScrollView>
                    <CalendarEventList COPItems={[]} ChecklistItems={checklistItems} />
                </ScrollView>
            )}
        </ModuleScreen>
    );
};

export default CalendarTab;

const styles = StyleSheet.create({
    calendarWrapper: {
        height: 10,
    },
});
