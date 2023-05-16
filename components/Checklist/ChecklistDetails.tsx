import {Text} from "native-base";
import { CMMSChecklist } from "../../types/interfaces";
import { Table, Rows } from "react-native-table-component";
import { StyleSheet } from "react-native";


const ChecklistDetails = ({checklist} : {
    checklist: CMMSChecklist
}) => {
    const widthArr = [150,200];
    const tableData = [
    ['Description',checklist.description],
    ['Created Date',checklist.created_date],
    ['Plant', checklist.plant_name],
    ['Assigned To', checklist.assigneduser],
    ['Created By', checklist.createdbyuser],
    ['Sign Off By', checklist.signoffuser],
    ['Linked Assets', checklist.linkedassets]
];

    
    return (
        <>
          <Text underline fontSize={18} marginBottom={5} style={styles.tableTitle}>
            {checklist.chl_name}
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
        </>
    );
};

const styles = StyleSheet.create({
  tableTitle: {
    fontSize: 17,
    fontWeight: "600",
  }
})

export default ChecklistDetails;