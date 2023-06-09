import React from "react";
import { View, FlatList } from "react-native";
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
      <FlatList
        data={props.checklist.activity_log}
        keyExtractor={(act) => act.date}
        renderItem={({ item }) => <ChecklistHistoryRow history={item} />}
      ></FlatList>
    );
  }
};

export default ChecklistHistory;
