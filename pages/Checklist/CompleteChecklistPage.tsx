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

const CompleteChecklistPage = ({navigation, route}) => {
    const [checklist, setChecklist] = useState<CMMSChecklist>({} as CMMSChecklist);
    const [sections, setSections] = useState<ChecklistSection[]>([]);

    useEffect(() => {
        if (route.params) setChecklist(route.params);
    }, [route.params]);

    useEffect(() => {
        if (checklist && checklist.datajson) {
            console.log("hello");
            console.log(route.params)
            setSections(checklist.datajson.map(section => ChecklistSection.fromJSON(section)))
        }
    }, [checklist])

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Complete Checklist">

            </ModuleHeader>
            <ScrollView>
                <Center>
                    <ChecklistDetails checklist={checklist}></ChecklistDetails>
                </Center>
                <ChecklistEditableContext sections={sections} setSections={setSections} />
            </ScrollView>
            
        </ModuleScreen>
    );
};


export default CompleteChecklistPage;