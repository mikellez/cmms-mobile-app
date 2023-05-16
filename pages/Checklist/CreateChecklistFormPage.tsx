import React, { useState, createContext, useEffect } from "react";
import { View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { Input, Icon, TextArea, VStack, Button, IconButton, HStack, ScrollView } from "native-base";
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons } from "../../components/ModuleLayout";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistForm from "../../components/Checklist/ChecklistForm";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistCreator from "../../components/Checklist/ChecklistCreator";
import instance from "../../axios.config";
import { useCurrentUser } from "../../helper/hooks/SWR";
import { ChecklistCreateContextProvider } from "../../context/checklistContext";

const fetchSpecificChecklistTemplate = async (id: number): Promise<CMMSChecklist | void> => {
    try {
        const response = instance.get("/api/checklist/template/" + id);
        return (await response).data;
    }
    catch (err) {
        console.log(err);
    };
};

const submitChecklist = async (checklist: CMMSChecklist) => {
    try {
        instance.post("/api/checklist/record/", { checklist })
    }
    catch (err) {
        console.log(err);
    };
};

// const ChecklistFormContext = createContext(null);

const CreateChecklistFormPage = ({ navigation, route }) => {
    const [checklist, setChecklist] = useState({} as CMMSChecklist);
    const [incompleteModal, setIncompleteModal] = useState<boolean>(false);
    const [successModal, setSuccessModal] = useState<boolean>(false);
    const [sections, setSections] = useState<ChecklistSection[]>([]);
    const [level, setLevel] = useState<number>();
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const { checklistId } = route.params;
    const user = useCurrentUser();

    const handleSubmit = () => {
        setLevel(3);
        setSubmitting(true);
    };

    const toDataJSON = (sections: ChecklistSection[]) => {
        return sections.map(section => section.toJSON());
    };

    const validateChecklistFormData = (checklist: CMMSChecklist) => {
        return true;
    };

    // updating checklist based on sections state edited by the level system
    const updateChecklistDataJSON = async () => {
        setChecklist(prevChecklist => {
            const newChecklist = {...prevChecklist};
            newChecklist.datajson = toDataJSON(sections);
            return newChecklist;
        });
    };

    if (level === 0) {
        updateChecklistDataJSON().then(res => {
            if (!validateChecklistFormData(checklist)) {
                setIncompleteModal(true); 
            } else {
                submitChecklist(checklist).then(res => {
                    setSuccessModal(true);
                })   
            }
        });

        setSubmitting(false);
        setLevel(undefined); 

        setTimeout(() => {
            if (successModal) navigation.navigate("Maintenance");
        }, 1000);
    };

    useEffect(() => {
        if (checklistId) {
            fetchSpecificChecklistTemplate(checklistId).then(data => {
                if (data) {
                    setChecklist({
                        ...data,
                        createdbyuser: user.data.name,
                        created_by_user_id: user.data.id,
                    });

                    setSections(data.datajson.map(section => ChecklistSection.fromJSON(section)));
                }   
            })
        } else {
            setChecklist({
                createdbyuser: user.data.name,
                created_by_user_id: user.data.id,
            } as CMMSChecklist);
        }
    }, [checklistId]);

    const header = <ChecklistForm checklist={checklist} setChecklist={setChecklist} />

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
 
            <ChecklistCreateContextProvider sections={sections}
                                        setSections={setSections}
                                        level={level}
                                        setLevel={setLevel}>
                <ChecklistCreator header={header}/>
            </ChecklistCreateContextProvider>   
            
            <IconButton  
                _icon={{
                    as: Feather,
                    name: "send"
                }}
                colorScheme="white"
                variant="solid"
                backgroundColor="#C8102E"
                onPress={handleSubmit}
                disabled={isSubmitting}
            />

        <ModuleSimpleModal
            isOpen={incompleteModal}
            setOpen={setIncompleteModal}
            title="Missing Details"
            text="Ensure that all fields have been filled"
            icon={ModalIcons.Warning}
        />

        <ModuleSimpleModal
            isOpen={successModal}
            setOpen={setSuccessModal}
            title="Success"
            text="New checklist successfully created"
            icon={ModalIcons.Warning}
        />

        </ModuleScreen>
    );
};

export default CreateChecklistFormPage;