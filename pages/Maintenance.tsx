import React, { useState, useEffect } from "react";
import { ScrollView, HStack, Button, Icon, VStack, Actionsheet, useDisclose, Text, ChevronDownIcon } from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ModuleHeader, ModuleScreen, ModuleActionSheet, ModuleActionSheetItem, ModuleDivider } from "../components/ModuleLayout";
import ListBox from "../components/Checklist/ListBox";
import instance from "../axios.config";
import { CMMSChecklist } from "../types/interfaces";

const checklistViews: ModuleActionSheetItem[] = [
    {
        label: "Assigned",
        value: "assigned"
    },
    {
        label: "For Review",
        value: "record"
    },
    {
        label: "Approved",
        value: "approved"
    },
];

const fetchChecklist = async (viewType: string) => {
    try {
        const response = await instance.get(`/api/checklist/${viewType}`);
        return response.data.rows;

    } catch (err) {
        console.log(err)
    };
};

const Maintenance = ({ navigation }) => {
    const [checklists, setChecklists] = useState<CMMSChecklist[]>([]);
    const [viewType, setViewType] = useState<string>(checklistViews[0].value as string);

    useEffect(() => {
        fetchChecklist(viewType)
            .then(result => setChecklists(result))
    }, [viewType]);

    const checklistElements = checklists.map(cl => {
        return (
            <ListBox key={cl.checklist_id} checklist={cl} />
        );
    });

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Maintenance">
                <HStack>
                    <Button w="30" padding={2} bg="#C8102E" leftIcon={
                        <Icon as={MaterialCommunityIcons} name="filter" size="sm"/>
                    } size="xs"></Button>
                </HStack>
            </ModuleHeader>

            <ModuleActionSheet 
                items={checklistViews}
                value={viewType}
                setValue={setViewType}
            />
            <ModuleDivider />
            <ScrollView>
                <VStack space={3}>
                    {checklistElements}
                </VStack>
            </ScrollView>
        </ModuleScreen>
    );
};

export default Maintenance;