import React from "react";
import { View, Text } from "react-native"
import { HStack, VStack } from "native-base";
import { Table, Row, Rows } from "react-native-table-component";
import { ModuleDivider } from "../ModuleLayout";

interface ChecklistHistoryRowProps {
    history: {[key: string]: string};
} 

const ChecklistHistoryRow = ({history}) => {
    return <VStack>
        <ModuleDivider></ModuleDivider>
        <HStack mb={1} justifyContent="space-between">
            <Text>Status:</Text>
            <Text>{history["activity_type"]}</Text>
        </HStack>
        <HStack mb={1} justifyContent="space-between">
            <Text>Action:</Text>
            <Text>{history["activity"]}</Text>
        </HStack>
        <HStack mb={1} justifyContent="space-between">
            <Text>Date:</Text>
            <Text>{history["date"]}</Text>
        </HStack>
        <HStack mb={1} justifyContent="space-between">
            <Text>Name:</Text>
            <Text>{history["name"]}</Text>
        </HStack>
    </VStack> 
    //<View>
    //     <HStack>
    //         <VStack>
    //             <HStack>
    //                 {props.history["date"]}
    //             </HStack>
    //             <HStack>

    //             </HStack>
    //         </VStack>
    //         <VStack>
    //             <HStack>

    //             </HStack>

    //         </VStack>
    //     </HStack>
    // </View>
}

export default ChecklistHistoryRow;