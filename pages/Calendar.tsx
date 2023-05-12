import { HStack, Icon, Button, Center, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import { DateData, Calendar } from "react-native-calendars";
import instance from "../axios.config";
import { ModuleHeader, ModuleScreen, ModuleDivider } from "../components/ModuleLayout";
import CalendarEventList from "../components/Calendar/CalendarEventList";
import { CMMSChangeOfParts, CMMSSchedule } from "../types/interfaces";
import { PlantSelect } from "../components/General";

export interface ChecklistScheduleInfo {
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

const getChecklistSchedules = async (plantId: number) => {
    try {
        const response = await instance.get<ChecklistScheduleInfo[]>(`/api/schedule/${plantId}`);
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

const getCOPSchedules = async (plantId: number) => {
    try {
        var apiURL = "/api/changeOfParts";
        if (plantId != 0) {
            apiURL += `/${plantId}`;
        }
        const response = await instance.get<CMMSChangeOfParts[]>(apiURL);
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

const CalendarTab = ({ navigation }) => {
    const [items, setItems] = useState([{}, {}]);
    const [selectedPlant, setSelectedPlant] = useState<number>(0);
    const [isReady, setIsReady] = useState<boolean>(false);
    let markedDates = {};
    const [markedDatesProp, setMarkedDatesProp] = useState({});
    const [selectDatesProp, setSelectDatesProp] = useState({});
    const [checklistItems, setChecklistItems] = useState<CMMSSchedule[]>([]);
    const [COPItems, setCOPItems] = useState<CMMSChangeOfParts[]>([]);
    const [isCalendarView, setIsCalendarView] = useState<boolean>(true);
    const [dateSelected, setDateSelected] = useState<DateData>();

    const checklistCalConfig = {key: 'checklist', color: 'green'};
    const copCalConfig = {key: 'cop', color: 'purple'};

    const addItems = async (plantId) => {
        setItems([{}, {}]);

        await getChecklistSchedules(plantId).then((results) => {
            if (results) {
                results.forEach((result) => {
                    result.calendar_dates.forEach((date) => {
                        const dots = markedDates[date]?.dots || [];
                        const cond = dots.length === 0 || (dots > 0 && dots.filter(i => i.key !== 'checklist'));

                        markedDates[date] = { dots: [...dots, (cond ? checklistCalConfig : {})] };
                        var newItems = items;
                        if (!newItems[0][date]) {
                            newItems[0][date] = [];
                        }
                        newItems[0][date].push({
                            scheduleId: result.schedule_id,
                            checklistId: result.checklist_id,
                            checklistName: result.checklist_name,
                            plantName: result.plant,
                            plantId: result.plantId,
                            date: date,
                            startDate: result.start_date,
                            endDate: result.end_date,
                            recurringPeriod: result.period,
                            assignedIds: result.assigned_ids,
                            assignedUsers: result.assigned_usernames,
                            remarks: result.remarks,
                        });
                        setItems(newItems);
                    });
                });
            }
        });
        await getCOPSchedules(plantId).then((results) => {
            if (results) {
                results.forEach((result) => {
                    const date = result.changedDate
                        ? new Date(result.changedDate).toISOString().split("T")[0]
                        : new Date(result.scheduledDate).toISOString().split("T")[0];
                    const dots = markedDates[date]?.dots || [];
                    const cond = dots.length === 0 || (dots.length > 0 && dots.filter(i => i.key !== 'cop'));

                    markedDates[date] = { dots: [...dots, (cond ? copCalConfig : {})] };
                    var newItems = items;
                    if (!newItems[1][date]) {
                        newItems[1][date] = [];
                    }
                    newItems[1][date].push({
                        copId: result.copId,
                        psaId: result.psaId,
                        asset: result.asset,
                        plant: result.plant,
                        plantId: result.plantId,
                        changedDate: result.changedDate,
                        scheduledDate: result.scheduledDate,
                        description: result.description,
                        assignedUserId: result.assignedUserId,
                        assignedUser: result.assignedUser,
                    });
                    setItems(newItems);
                });
            }
        });
    };

    useEffect(() => {
        setIsReady(false);
        markedDates = {};
        addItems(selectedPlant).then(() => {
            setMarkedDatesProp(markedDates);
            setSelectDatesProp(markedDates);
            setIsReady(true);
        });
    }, [selectedPlant]);

    const dayPress = (day: DateData) => {
        setChecklistItems(items[0][day.dateString]);
        setCOPItems(items[1][day.dateString]);
        setDateSelected(day);
        console.log(markedDatesProp[day.dateString])
        setSelectDatesProp({
            ...markedDatesProp,
            [day.dateString]: { ...markedDatesProp[day.dateString], selected: true, selectedColor: '#C8102E' }
        });
    };

    const toggleCalendarView = () => {
        setIsCalendarView((prev) => !prev);
    };

    const plantFilter = (plantId) => {
        setItems([{}, {}]);
        setChecklistItems([]);
        setCOPItems([]);
        setDateSelected(null);

        setTimeout(() => {
            setSelectedPlant(plantId);
        }, 500);
    };

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Calendar">
                <HStack style={{ gap: 2, height: 25, minWidth: 200 }} mb={3}>
                    {isCalendarView && (
                        <Button
                            w="30"
                            padding={2}
                            bg="#C8102E"
                            leftIcon={
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name="calendar-import"
                                    size="sm"
                                />
                            }
                            size="xs"
                            onPress={toggleCalendarView}
                        ></Button>
                    )}
                    {!isCalendarView && (
                        <Button
                            w="30"
                            padding={2}
                            bg="#C8102E"
                            leftIcon={
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name="calendar-export"
                                    size="sm"
                                />
                            }
                            size="xs"
                            onPress={toggleCalendarView}
                        ></Button>
                    )}
                    <PlantSelect
                        onChange={(value) => plantFilter(+value)}
                        accessControl
                        selectAllPlants
                        maxHeight={25}
                        minWidth={150}
                        style={{ height: 40 }}
                    />
                </HStack>
            </ModuleHeader>

            <ModuleDivider />
            
            { isCalendarView && <View style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <VStack>
                    <HStack>
                        <Icon
                            as={Octicons}
                            name="dot-fill"
                            size="xs"
                            color="green.800"
                        />
                        <Text fontSize={10}>Checklist</Text>

                    </HStack>
                    <HStack>
                        <Icon
                            as={Octicons}
                            name="dot-fill"
                            size="xs"
                            color="purple.800"
                        />
                        <Text fontSize={10}>Change of Parts</Text>
                    </HStack>

                </VStack>
            </View>
            }

            {isReady && isCalendarView && (
                <View>
                    <Calendar 
                        markingType={'multi-dot'} 
                        markedDates={selectDatesProp} 
                        onDayPress={dayPress} 
                        onDayLongPress={dayPress} 
                        style={{ marginTop: 5, marginBottom: 20}}
                        theme={{
                            todayTextColor: '#C8102E',
                            arrowColor: '#C8102E',
                        }}
                        />
                    <ModuleDivider />
                </View>
            )}
            {isReady && dateSelected && (
                <ScrollView>
                    <CalendarEventList
                        dateSelected={dateSelected}
                        COPItems={COPItems}
                        ChecklistItems={checklistItems}
                    />
                </ScrollView>
            )}
        </ModuleScreen>
    );
};

export default CalendarTab;
