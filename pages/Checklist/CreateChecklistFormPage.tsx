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
import { ChecklistType } from "../../types/enums";


const fetchSpecificChecklist = async (id: number, type: ChecklistType): Promise<CMMSChecklist | void> => {
    try {
        const response = instance.get(`/api/checklist/${type}/${id}`);
        return (await response).data;
    }
    catch (err) {
        console.log(err);
    }
};

const createChecklist = async (checklist: CMMSChecklist) => {
    try {
        instance.post("/api/checklist/record/", { checklist })
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
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const { checklistId, checklistType } = route.params;

    const user = useCurrentUser();

    const editChecklist = async (checklist: CMMSChecklist) => {
        try {
            instance.patch(`/api/checklist/record/${checklist.checklist_id}`, {checklist });
        } catch(err) {
            console.log(err);
        }
    };

    const pageTitle = checklistType === ChecklistType.Template ? "Create Checklist" : "Edit Checklist";
    const backPage = checklistType === ChecklistType.Template ? "ChecklistTemplatesPage" : "Maintenance";
    const successModalText = checklistType === ChecklistType.Template ?
        "New checklist successfully created" :
        "Checklist successfully edited";

    const APICall = async (checklist: CMMSChecklist) => {
        if (checklistType === ChecklistType.Template) {
            return await createChecklist(checklist);
        }
        return await editChecklist(checklist);
    };

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

    const updateChecklistDataJSON = async () => {
        setChecklist(prevChecklist => {
            const newChecklist = {...prevChecklist};
            newChecklist.datajson = toDataJSON(sections);
            return newChecklist;
        });
    };

    const leavePage = () => {
        navigation.navigate("Maintenance");
    };

    useEffect(() => {
        if (isSubmitting) {
            if (!validateChecklistFormData(checklist)) {
                setIncompleteModal(true); 
            } else {
                APICall(checklist).then(res => {
                    setSuccessModal(true);
                })   
            }
        }

        setSubmitting(false);

    }, [checklist])

    if (level === 0) {
        updateChecklistDataJSON();
        setLevel(undefined); 
    };

    useEffect(() => {
        if (checklistId) {
            fetchSpecificChecklist(checklistId, checklistType).then(data => {
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
    }, [checklistId, checklistType]);

    const header = <ChecklistForm checklist={checklist} setChecklist={setChecklist}/>;
    
    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header={pageTitle}>
                <HStack space={3}>
                    <Button 
                        w="30" 
                        padding={2} 
                        bg="#CCCCCC"
                        leftIcon={
                            <Icon as={AntDesign} name="arrowleft" size="sm"/>
                        } 
                        size="xs"
                        onPress={() => navigation.navigate(backPage)}
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