import React, { useState, createContext, useEffect } from "react";
import { View, ScrollView } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { Input, Icon, TextArea, VStack, Button, IconButton, HStack } from "native-base";
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons } from "../../components/ModuleLayout";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistForm from "../../components/Checklist/ChecklistForm";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistCreator from "../../components/Checklist/ChecklistCreator";
import instance from "../../axios.config";

const fetchSpecificChecklistTemplate = async (id: number): Promise<CMMSChecklist | void> => {
    try {
        const response = instance.get("/api/checklist/template/" + id);
        return (await response).data;
    }
    catch (err) {
        console.log(err);
    };
};

const ChecklistFormContext = createContext(null);

const CreateChecklistFormPage = ({ navigation, route }) => {
    const [checklist, setChecklist] = useState({} as CMMSChecklist);
    const [incompleteModal, setIncompleteModal] = useState<boolean>(false);
    const [successModal, setSuccessModal] = useState<boolean>(false);
    const [sections, setSections] = useState<ChecklistSection[]>([]);
    const [level, setLevel] = useState<number>();
    const { checklistId } = route.params;

    const handleSubmit = () => {
        setLevel(1)

        // if (!validateChecklistFormData(checklist)) {
        //     setIncompleteModal(true);
        // } else {
        //     setSuccessModal(true);
        //     navigation.navigate("Maintenance");
        // }
    };

    const toDataJSON = (sections: ChecklistSection[]) => {
        return sections.map(section => section.toJSON());
    };

    if (level === 0) {
        console.log(toDataJSON(sections))
        setLevel(undefined);
    };

    const validateChecklistFormData = (checklist) => {
        return false;
    };

    useEffect(() => {
        if (checklistId) {
            fetchSpecificChecklistTemplate(checklistId).then(data => {
                if (data) {
                    setChecklist(data);

                    setSections(data.datajson.map(section => ChecklistSection.fromJSON(section)));
                }   
            })
        }
    }, [checklistId]);

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Create Checklist">
                <HStack space={3}>
                    <Button 
                        w="30" 
                        padding={2} 
                        bg="#CCCCCC"
                        leftIcon={
                            <Icon as={AntDesign} name="arrowleft" size="sm"/>
                        } 
                        size="xs"
                        onPress={() => navigation.navigate("ChecklistTemplatesPage")}
                    ></Button>
                </HStack>
            </ModuleHeader>

            <ScrollView>
                <ChecklistForm checklist={checklist} setChecklist={setChecklist} />
                
                <ChecklistFormContext.Provider value={{ sections, setSections, level, setLevel }}>
                    <ChecklistCreator />
                </ChecklistFormContext.Provider>
                
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
export { ChecklistFormContext }