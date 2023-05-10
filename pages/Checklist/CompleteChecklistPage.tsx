import React, { useEffect, useState } from "react";
import { ModuleScreen, ModuleHeader } from "../../components/ModuleLayout";
import instance from "../../axios.config";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistTemplate from "../../components/Checklist/ChecklistTemplate";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center} from "native-base";
import { Table, Rows } from "react-native-table-component";
import ChecklistDetails from "../../components/Checklist/ChecklistDetails";



const CompleteChecklistPage = ({navigation, route}) => {

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Complete Checklist">

            </ModuleHeader>
            <ScrollView>
                <Center>
                    <ChecklistDetails checklist={route.params}></ChecklistDetails>
                </Center>
            </ScrollView>
            
        </ModuleScreen>
    );
};



export default CompleteChecklistPage;