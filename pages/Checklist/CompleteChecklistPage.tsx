import React, { useEffect, useState, createContext } from "react";
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons } from "../../components/ModuleLayout";
import instance from "../../axios.config";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistTemplate from "../../components/Checklist/ChecklistTemplate";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center, IconButton } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Table, Rows } from "react-native-table-component";
import ChecklistDetails from "../../components/Checklist/ChecklistDetails";
import ChecklistEditableForm from "../../components/Checklist/ChecklistFillableForm";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistEditableContext from "../../context/checklistContext";

const completeChecklist = async (checklist: CMMSChecklist) => {
    try {
        await instance({
            url: "/api/checklist/complete",
            data: {
                datajson: checklist.datajson
            }
        })
    }
    catch (err) {
        console.log(err);
    }
};

const CompleteChecklistPage = ({navigation, route}) => {
    const [checklist, setChecklist] = useState<CMMSChecklist>({} as CMMSChecklist);
    const [sections, setSections] = useState<ChecklistSection[]>([]);
    const [incompleteModal, setIncompleteModal] = useState<boolean>(false);
    const [successModal, setSuccessModal] = useState<boolean>(false);

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

    const handleSubmit = () => {
        if (!checkIfChecklistIsComplete(sections)) {
            setIncompleteModal(true);
            
        } else {
            setSuccessModal(true);
            completeChecklist(checklist);
            setTimeout(() => {
                navigation.navigate("Maintenance");
            }, 1000)
        };
    };

    const checkIfChecklistIsComplete = (sections: ChecklistSection[]) => {
        return sections.every(section => section.isComplete());
    };

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Complete Checklist">

            </ModuleHeader>
            <ScrollView>
                <Center>
                    <ChecklistDetails checklist={checklist}></ChecklistDetails>
                </Center>
                <ChecklistEditableContext sections={sections} setSections={setSections} />

                <IconButton
                    _icon={{
                        as: Ionicons,
                        name: "checkmark-done"
                    }}
                    colorScheme="white"
                    variant="solid"
                    backgroundColor="#C8102E"
                    onPress={handleSubmit}
                ></IconButton>
                
            </ScrollView>
            
            <ModuleSimpleModal 
                isOpen={incompleteModal}
                setOpen={setIncompleteModal}
                title="Missing Details"
                text="Please ensure that all the checks are filled."
                icon={ModalIcons.Warning}
            />

            <ModuleSimpleModal 
                isOpen={successModal}
                setOpen={setSuccessModal}
                title="Success"
                text="Your checklist has been submitted for approval."
                icon={ModalIcons.Success}
            />

        </ModuleScreen>
    );
};


export default CompleteChecklistPage;