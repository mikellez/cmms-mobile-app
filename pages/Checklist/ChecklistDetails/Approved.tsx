import React, { useEffect, useState } from "react";
import { ModuleScreen, ModuleHeader } from "../../../components/ModuleLayout";
import instance from "../../../axios.config";
import { CMMSChecklist } from "../../../types/interfaces";
import ChecklistTemplate from "../../../components/Checklist/ChecklistTemplate";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center} from "native-base";
import { Table, Rows } from "react-native-table-component";



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
        // <ModuleScreen navigation={navigation}>
        //     <ModuleHeader header="Approved">

        //     </ModuleHeader>
        //     <ScrollView>
        //         <VStack space={2}>
        //            <Text>Approved</Text>
        //         </VStack>
        //     </ScrollView>
        // </ModuleScreen>
        <ModuleScreen navigation={navigation}>
      <ScrollView>
        <Center>
          <Text underline fontSize={18} marginBottom={5}>
            {route.params.chl_name}
          </Text>
            <Table>
              <Rows
                data={tableData}
                widthArr={widthArr}
                style={{
                  margin: 6,
                  borderTopColor: "#cad5dd", 
                  borderTopWidth: 0
                }}
              ></Rows>
            </Table>
        </Center>
      </ScrollView>
    </ModuleScreen>

    );
};



export default Approved;