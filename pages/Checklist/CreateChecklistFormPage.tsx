import React, { useState } from "react";
import { View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { Input, Icon, TextArea, VStack, Button, IconButton, ScrollView } from "native-base";
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons } from "../../components/ModuleLayout";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistForm from "../../components/Checklist/ChecklistForm";


const CreateChecklistFormPage = ({ navigation }) => {
    const [checklist, setChecklist] = useState({} as CMMSChecklist);
    const [incompleteModal, setIncompleteModal] = useState<boolean>(false);
    const [successModal, setSuccessModal] = useState<boolean>(false);
    

    const handleSubmit = () => {
        if (!validateChecklistFormData(checklist)) {
            setIncompleteModal(true);
        } else {
            setSuccessModal(true);
            navigation.navigate("Maintenance");
        }
    };

    const validateChecklistFormData = (checklist) => {
        return false;
    };

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Create Checklist">
                <Button 
                    w="30" 
                    padding={2} 
                    bg="#C8102E" 
                    leftIcon={
                        <Icon as={AntDesign} name="filetext1" size="sm"/>
                    } 
                    size="xs"
                    // onPress={() => navigation.navigate("CreateChecklist")}
                ></Button>
            </ModuleHeader>
            <ScrollView>
                <ChecklistForm checklist={checklist} setChecklist={setChecklist} />

                <IconButton  
                    _icon={{
                        as: Feather,
                        name: "send"
                    }}
                    colorScheme="white"
                    variant="solid"
                    backgroundColor="#C8102E"
                    onPress={handleSubmit}
                />
            </ScrollView>

            <ModuleSimpleModal
                isOpen={incompleteModal}
                setOpen={setIncompleteModal}
                title="Missing Details"
                text="Ensure that all fields have been filled"
                icon={ModalIcons.Warning}
            />
        </ModuleScreen>
    );
};

export default CreateChecklistFormPage;