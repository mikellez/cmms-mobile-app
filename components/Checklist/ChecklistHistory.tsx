import React from "react";
import { View, FlatList } from "react-native"
import { HStack, VStack } from "native-base";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistHistoryRow from "./ChecklistHistoryRow";
import { Table, Row, Rows } from "react-native-table-component";

interface ChecklistHistoryProps {
    checklist: CMMSChecklist;
}

const ChecklistHistory = (props: ChecklistHistoryProps) => {
    // const tableHead = ["Status", "Action", "Date", "Name"];
    // const tableData = [];
    // if (props.checklist && props.checklist.activity_log) {
    //     for (let i = 0; i < props.checklist.activity_log.length; i++) {
    //         const row = [];
    //         for (const [key, value] of Object.entries(props.checklist.activity_log[i])) {
    //         row.push(value);
    //     }
    //     tableData.push(row);
    //     }
    // }
    
    // return <Table>
    //     <Row data={tableHead}></Row>
    //     <Rows data={tableData} textStyle={{}}></Rows>
    // </Table>
    if (props.checklist && props.checklist.activity_log) {
        return <FlatList
        data={props.checklist.activity_log}
        keyExtractor={act => act.date}
        renderItem={({item}) => <ChecklistHistoryRow
        history={item}/>}

        ></FlatList>
    }
}

export default ChecklistHistory;