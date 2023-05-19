import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { HStack, Button, Icon, VStack, Text, IconButton } from "native-base";
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ModuleHeader, ModuleScreen, ModuleActionSheet, ModuleActionSheetItem, ModuleDivider, ModuleFullPageModal, ModuleSimpleModal, ModalIcons } from "../components/ModuleLayout";
import ListBox from "../components/Checklist/ListBox";
import instance from "../axios.config";
import { CMMSChecklist } from "../types/interfaces";
import { useIsFocused } from '@react-navigation/native';

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

const Maintenance = ({ navigation, route }) => {
    const [checklists, setChecklists] = useState<CMMSChecklist[]>([]);
    const [viewType, setViewType] = useState<string>(checklistViews[0].value as string);
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused) {
            fetchChecklist(viewType)
                .then(result => {
                    if (result) setChecklists(result);
                    else setChecklists([]);
                })

        }
    }, [viewType, navigation, isFocused]);

    const checklistElements = checklists.length > 0 
                                ? <FlatList data={checklists}
                                            keyExtractor={cl => cl.checklist_id.toString()}
                                            renderItem={({item}) => <ListBox checklist={item}
                                                                            navigation={navigation}/>}/> 
                                : <Text>No Checklist Found</Text>

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Maintenance">
                <HStack space={2}>

                    <Button 
                        w="30" 
                        padding={2} 
                        bg="#C8102E" 
                        leftIcon={
                            <Icon as={AntDesign} name="addfile" size="sm"/>
                        } 
                        size="xs"
                        onPress={() => navigation.navigate("ChecklistTemplatesPage")}
                    ></Button>
                </HStack>
            </ModuleHeader>

        
            <ModuleActionSheet 
                items={checklistViews}
                value={viewType}
                setValue={setViewType}
            />

            <ModuleDivider />

            <View style={{marginBottom: 90}}>
                    <VStack space={3}>
                        {checklistElements}
                    </VStack>
            </View>
        </ModuleScreen>
    );
};

export default Maintenance;