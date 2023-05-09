import React, { useEffect, useState } from "react";
import { ModuleScreen, ModuleHeader } from "../../components/ModuleLayout";
import instance from "../../axios.config";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistTemplate from "../../components/Checklist/ChecklistTemplate";
import { ScrollView, StyleSheet } from "react-native";
import { VStack } from "native-base";

const fetchChecklistTemplates = async (): Promise<CMMSChecklist[] | void> => {
    try{
        const response = await instance.get("/api/checklist/templateNames")
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
};  

const ChecklistTemplatesPage = ({navigation}) => {
    const [templates, setTemplates] = useState<CMMSChecklist[]>([]);

    useEffect(() => {
        fetchChecklistTemplates().then(data => {
            if (data) setTemplates(data);
        });
    }, []);

    const templateElements = templates.map(template => {
        return (
            <ChecklistTemplate
                checklist={template}
                navigation={navigation}
            />
        )
    })

    return (
        <ModuleScreen navigation={navigation}>
            <ModuleHeader header="Checklist Templates">

            </ModuleHeader>
            <ScrollView>
                <VStack space={2}>
                    {templateElements}  
                </VStack>
            </ScrollView>
        </ModuleScreen>
    );
};



export default ChecklistTemplatesPage;