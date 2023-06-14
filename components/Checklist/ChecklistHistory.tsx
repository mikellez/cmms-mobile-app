import React from "react";
import { View, FlatList, ScrollView } from "react-native";
import { HStack, VStack } from "native-base";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistHistoryRow from "./ChecklistHistoryRow";
import { Table, Row, Rows } from "react-native-table-component";

interface ChecklistHistoryProps {
  checklist: CMMSChecklist;
}

const ChecklistHistory = (props: ChecklistHistoryProps) => {
  if (props.checklist && props.checklist.activity_log) {
    return (
      <ScrollView>
        { props.checklist.activity_log.map((item)=> <ChecklistHistoryRow history={item}/>) }
      </ScrollView>
    );
  } 
  return null;
};

export default ChecklistHistory;
