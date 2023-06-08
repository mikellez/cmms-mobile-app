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
import ChecklistEditableProvider from "../../context/checklistContext";
import ChecklistHeader from "../../components/Checklist/ChecklistHeader";

const completeChecklist = async (checklist: CMMSChecklist) => {
    try {
        await instance({
            url: `/api/checklist/complete/${checklist.checklist_id}`,
            data: {
                datajson: checklist.datajson
            },
            method: "patch"
        })
    }
    catch (err) {
        console.log(err);
    }
};

const CompleteChecklistPage = ({navigation, route}) => {
    const [checklist, setChecklist] = useState<CMMSChecklist>({} as CMMSChecklist);
    const [sections, setSections] = useState<ChecklistSection[]>([]);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [incompleteModal, setIncompleteModal] = useState<boolean>(false);
    const [successModal, setSuccessModal] = useState<boolean>(false);

    useEffect(() => {
        if (route.params) setChecklist(route.params);
    }, [route.params]);

    useEffect(() => {
        if (checklist && checklist.datajson) {
            setSections(checklist.datajson.map(section => ChecklistSection.fromJSON(section)))
        }

        if (isSubmitting) {
            completeChecklist(checklist);
        }

    }, [checklist, isSubmitting])

    const toDataJSON = (sections: ChecklistSection[]) => {
        return sections.map(section => section.toJSON());
    };

    const updateChecklistDataJSON = (sections) => {
        setChecklist(prevChecklist => {
            const newChecklist = {...prevChecklist};
            newChecklist.datajson = toDataJSON(sections);
            return newChecklist;
        });
        setSubmitting(true);
    }

    const handleSubmit = () => {
        if (!checkIfChecklistIsComplete(sections)) {
            setIncompleteModal(true);
            
        } else {
            setSuccessModal(true);
            updateChecklistDataJSON(sections);
            setTimeout(() => {
                    setSubmitting(false);
                navigation.navigate("Maintenance");
            }, 1000);
        };
    };

    const checkIfChecklistIsComplete = (sections: ChecklistSection[]) => {
        return sections.every(section => section.isComplete());
    };

    const header = <Center>
        <ChecklistDetails checklist={checklist}></ChecklistDetails>
    </Center>
    const footer = <IconButton
        _icon={{
            as: Ionicons,
            name: "checkmark-done"
        }}
        colorScheme="white"
        variant="solid"
        backgroundColor="#C8102E"
        onPress={handleSubmit}
    ></IconButton>

    return (
        <ModuleScreen navigation={navigation}>
            <ChecklistHeader navigation={navigation} header={"Complete Checklist"}/>
                
            <ChecklistEditableProvider sections={sections} setSections={setSections} isDisabled={false}>
                <ChecklistEditableForm header={header} footer={footer}/>
            </ChecklistEditableProvider>

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