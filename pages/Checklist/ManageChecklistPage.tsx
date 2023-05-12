import React, { useEffect, useState, createContext } from "react";
import { ModuleScreen, ModuleHeader } from "../../components/ModuleLayout";
import instance from "../../axios.config";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistTemplate from "../../components/Checklist/ChecklistTemplate";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center} from "native-base";
import { Table, Rows } from "react-native-table-component";
import ChecklistDetails from "../../components/Checklist/ChecklistDetails";
import ChecklistEditableForm from "../../components/Checklist/ChecklistFillableForm";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistEditableContext from "../../context/checklistContext";

const ManageChecklistPage = ({navigation, route}) => {
    const [checklist, setChecklist] = useState<CMMSChecklist>({} as CMMSChecklist);
    const [sections, setSections] = useState<ChecklistSection[]>([]);
    // const [remarks, setRemarks] = useState<string>("");
    
    useEffect(() => {
        console.log(route.params)
        if (route.params) {
            setChecklist(route.params);
        }
    }, [route.params])

    useEffect(() => {
        console.log("hellodqwerqerqwerqwer world");
        if (checklist && checklist.datajson) {
            setSections(checklist.datajson.map(section => ChecklistSection.fromJSON(section)));
        }
    }, [checklist])

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Manage Checklist">

            </ModuleHeader>
            <ScrollView>
                <Center>
                    <ChecklistDetails checklist={route.params}></ChecklistDetails>
                </Center>
                <ChecklistEditableContext sections={sections} setSections={setSections} isDisabled />
            </ScrollView>
            
        </ModuleScreen>
    );
};


// export ChecklistEditableFormContext ; 
export default ManageChecklistPage;