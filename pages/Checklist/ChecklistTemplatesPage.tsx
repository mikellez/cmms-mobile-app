import React, { useEffect, useState } from "react";
import { ModuleScreen, ModuleHeader } from "../../components/ModuleLayout";
import instance from "../../axios.config";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistTemplate from "../../components/Checklist/ChecklistTemplate";
import { FlatList } from "react-native";
import { VStack } from "native-base";
import ChecklistHeader from "../../components/Checklist/ChecklistHeader";

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


    const templateElements = <FlatList data={templates}
                                        keyExtractor={template => template.checklist_id.toString()}
                                        renderItem={({item}) => <ChecklistTemplate checklist={item}
                                                                                   navigation={navigation}/>}/>

    return (
        <ModuleScreen navigation={navigation}>
            <ChecklistHeader navigation={navigation} header={"Checklist Templates"}/>

                <>
                    {templateElements}  
                </>
        </ModuleScreen>
    );
};



export default ChecklistTemplatesPage;