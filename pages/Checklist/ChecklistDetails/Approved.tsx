import React, { useEffect, useState } from "react";
import { ModuleScreen, ModuleHeader } from "../../../components/ModuleLayout";
import instance from "../../../axios.config";
import { CMMSChecklist } from "../../../types/interfaces";
import ChecklistTemplate from "../../../components/Checklist/ChecklistTemplate";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center} from "native-base";
import { Table, Rows } from "react-native-table-component";
import ChecklistDetails from "../../../components/Checklist/ChecklistDetails";



const Approved = ({navigation, route}) => {
    const widthArr = [150,200];
    console.log(route.params);
    const tableData = [
    ['Description',route.params.description],
    ['Created Date',route.params.created_date],
    ['Plant', route.params.plant_name],
    ['Assigned To', route.params.assigneduser],
    ['Created By', route.params.createdbyuser],
    ['Sign Off By', route.params.signoffuser],
    ['Linked Assets', route.params.linkedassets],

];

    return (
        <ModuleScreen navigation={navigation}>
      <ScrollView>
        <Center>
            <ChecklistDetails checklist={route.params}></ChecklistDetails>
        </Center>
      </ScrollView>
    </ModuleScreen>

    );
};



export default Approved;