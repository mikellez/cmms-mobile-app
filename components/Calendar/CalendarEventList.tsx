import { Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { CMMSChangeOfParts, CMMSSchedule } from "../../types/interfaces";
import { ScrollView } from "react-native";
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
        let key = 0;
        if (props.COPItems) {
            setCOPElements(
                props.COPItems.map((item) => {
                    return <ScheduleCOPEvent key={key++} COPSchedule={item} />;
                })
            );
        } else {
            setCOPElements([]);
        }
        if (props.ChecklistItems) {
            setChecklistElements(
                props.ChecklistItems.map((item) => {
                    return (
                        <ScheduleChecklistEvent key={key++} checklistSchedule={item} />
                    );
                })
            );
        } else {
            setChecklistElements([]);
        }
    }, [props.COPItems, props.ChecklistItems, props.dateSelected]);

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
