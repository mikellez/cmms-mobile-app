import React, { useEffect, useState, createContext } from "react";
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons } from "../../components/ModuleLayout";
import { CMMSChecklist } from "../../types/interfaces";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center, TextArea, FormControl, Button, HStack, Modal } from "native-base";
import ChecklistDetails from "../../components/Checklist/ChecklistDetails";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistEditableProvider from "../../context/checklistContext";
import ChecklistEditableForm from "../../components/Checklist/ChecklistFillableForm";
import ChecklistHeader from "../../components/Checklist/ChecklistHeader";


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
        // console.log(checklist.datajson);
        if (checklist && checklist.datajson) {
            setSections(checklist.datajson.map(section => ChecklistSection.fromJSON(section)));
        }
    }, [checklist])

    const header =<Center>
        <ChecklistDetails checklist={route.params}></ChecklistDetails>
    </Center>

    return (
        <ModuleScreen navigation={navigation}>
            <ChecklistHeader navigation={navigation} header={"View Checklist"}/>
            
            <ChecklistEditableProvider sections={sections} setSections={setSections} isDisabled>
                <ChecklistEditableForm header={header} footer={null}/>
            </ChecklistEditableProvider>
        </ModuleScreen>
    );
};


export default ViewChecklistPage;