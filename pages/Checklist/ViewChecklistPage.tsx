import React, { useEffect, useState, createContext } from "react";
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons } from "../../components/ModuleLayout";
import { CMMSChecklist } from "../../types/interfaces";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center, TextArea, FormControl, Button, HStack, Modal } from "native-base";
import ChecklistDetails from "../../components/Checklist/ChecklistDetails";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistEditableContext from "../../context/checklistContext";


const ViewChecklistPage = ({navigation, route}) => {
    const [checklist, setChecklist] = useState<CMMSChecklist>({} as CMMSChecklist);
    const [sections, setSections] = useState<ChecklistSection[]>([]);
    
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
            <ModuleHeader header="View Checklist">

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


export default ViewChecklistPage;