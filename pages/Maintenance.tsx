import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView, HStack, Button, Icon, VStack, Text, IconButton } from "native-base";
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ModuleHeader, ModuleScreen, ModuleActionSheet, ModuleActionSheetItem, ModuleDivider, ModuleFullPageModal, ModuleSimpleModal, ModalIcons } from "../components/ModuleLayout";
import ListBox from "../components/Checklist/ListBox";
import instance from "../axios.config";
import { CMMSChecklist } from "../types/interfaces";

const checklistViews: ModuleActionSheetItem[] = [
    {
        label: "Assigned",
        value: "assigned"
    },
    {
        label: "Pending",
        value: "pending"
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
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchChecklist(viewType)
            .then(result => {
                if (result) setChecklists(result);
                else setChecklists([]);
            })
    }, [viewType]);

    const checklistElements = checklists.length > 0 ? checklists.map(cl => {
        return (
            <ListBox key={cl.checklist_id} checklist={cl} />

        );
    }) : <Text>No Checklist Found</Text>;

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Maintenance">
                <HStack space={2}>
                    <Button 
                        w="30" 
                        padding={2} 
                        bg="#C8102E" 
                        leftIcon={
                            <Icon as={MaterialCommunity} name="filter" size="sm"/>
                        } 
                        size="xs"
                        onPress={() => setFilterOpen(true)}
                    ></Button>

                    <Button 
                        w="30" 
                        padding={2} 
                        bg="#C8102E" 
                        leftIcon={
                            <Icon as={AntDesign} name="addfile" size="sm"/>
                        } 
                        size="xs"
                        onPress={() => navigation.navigate("CreateChecklistFormPage")}
                    ></Button>
                </HStack>
            </ModuleHeader>

        
            <ModuleActionSheet 
                items={checklistViews}
                value={viewType}
                setValue={setViewType}
            />

            <ModuleDivider />

            <View>
                <ScrollView>
                    <VStack space={3}>
                        {checklistElements}
                    </VStack>
                </ScrollView>
            </View>

            <ModuleFullPageModal 
                title="Filter"
                isOpen={isFilterOpen}
                setOpen={setFilterOpen}
            >
            </ModuleFullPageModal>

        </ModuleScreen>
    );
};

export default Maintenance;