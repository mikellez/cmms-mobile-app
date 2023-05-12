import React, { useEffect, useState, createContext } from "react";
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons } from "../../components/ModuleLayout";
import instance from "../../axios.config";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistTemplate from "../../components/Checklist/ChecklistTemplate";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center, TextArea, FormControl, Button, HStack, Modal } from "native-base";
import { Table, Rows } from "react-native-table-component";
import ChecklistDetails from "../../components/Checklist/ChecklistDetails";
import ChecklistEditableForm from "../../components/Checklist/ChecklistFillableForm";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistEditableContext from "../../context/checklistContext";
import { Action } from "../../types/enums";

const manageChecklist = async (url: "approve" | "reject", checklistId: number, remarks?: string) => {
    try {
        await instance.patch(`/api/checklist/${url}/${checklistId}`, { remarks });
    }
    catch (err) {
        console.log(err);
    }
};

const ManageChecklistPage = ({navigation, route}) => {
    const [checklist, setChecklist] = useState<CMMSChecklist>({} as CMMSChecklist);
    const [sections, setSections] = useState<ChecklistSection[]>([]);
    const [managerComments, setManagerComments] = useState<string>("");
    const [warningModal, setWarningModal] = useState<boolean>(false);
    const [approveModal, setApproveModal] = useState<boolean>(false);
    const [rejectModal, setRejectModal] = useState<boolean>(false);
    
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

    const handleButtonPress = (action: Action) => {
        if (action === Action.Approve) {
            approveChecklist();
        } else if (action === Action.Reject) {
            rejectChecklist();
        }
    }

    const approveChecklist = () => {
        manageChecklist("approve", checklist.checklist_id)
        setApproveModal(true);
        leavePage();
    };

    const rejectChecklist = () => {
        if (managerComments.trim().length === 0) {
            setWarningModal(true);
            return;
        } 
        setRejectModal(true);
        manageChecklist("reject", checklist.checklist_id, managerComments);
        leavePage();
    };

    const leavePage = () => {
        setTimeout(() => {
            navigation.navigate("Maintenance");
        }, 1000);
    };

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Manage Checklist">

            </ModuleHeader>
            <ScrollView>
                <Center>
                    <ChecklistDetails checklist={route.params}></ChecklistDetails>
                </Center>
                <ChecklistEditableContext sections={sections} setSections={setSections} isDisabled />

                <VStack space={2}>
                    <FormControl.Label>Manager's Comments</FormControl.Label>
                    <TextArea 
                        autoCompleteType={true} 
                        value={managerComments}
                        onChangeText={text => setManagerComments(text)}
                    />
                    
                    <HStack width="full">
                        <Button 
                            width="45%" 
                            backgroundColor="#E64848"
                            onPress={(e) => handleButtonPress(Action.Reject)}
                        >Reject</Button>

                        <Button 
                            width="45%" 
                            marginLeft="auto" 
                            backgroundColor="#36AE7C"
                            onPress={(e) => handleButtonPress(Action.Approve)}
                        >Approve</Button>
                    </HStack>
                </VStack>
            </ScrollView>

            <ModuleSimpleModal
                isOpen={warningModal}
                setOpen={setWarningModal}
                title="Missing Comments"
                text="Please provide comments for rejection."
                icon={ModalIcons.Warning}
            />

            <ModuleSimpleModal
                isOpen={approveModal}
                setOpen={setApproveModal}
                title="Done"
                text="Checklist has been approved."
                icon={ModalIcons.Success}
            />

            <ModuleSimpleModal
                isOpen={rejectModal}
                setOpen={setRejectModal}
                title="Done"
                text="Checklist has been rejected."
                icon={ModalIcons.Success}
            />

        </ModuleScreen>
    );
};

export default ManageChecklistPage;