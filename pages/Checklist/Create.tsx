import React, { useState } from "react";
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Input, Icon, TextArea, VStack, Button } from "native-base";
import { ModuleScreen, ModuleHeader } from "../../components/ModuleLayout";
import { CMMSChecklist } from "../../types/interfaces";

const CreateChecklist = ({ navigation }) => {
    const [checklist, setChecklist] = useState({} as CMMSChecklist);

    const updateChecklist = (value: string | number | Date, field: string) => {
        setChecklist(prev => {
            return {
                ...prev,
                [field]: value
            } as CMMSChecklist
        });
    };

    console.log(checklist);

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
            
            <VStack 
                marginY={3}
                space={3}
                width="100%"
            >
            <Input
                w={{
                    md: "25%"
                }} 
                InputLeftElement={<Icon as={<MaterialIcons name="person" />} 
                size={5} 
                ml="2" 
                color="muted.400" />} 
                placeholder="Name" 
                onChangeText={text => updateChecklist(text, "chl_name")}
                value={checklist.chl_name}
                maxLength={100}
            />

            <TextArea 
                h={20} 
                placeholder="Description" 
                onChangeText={text => updateChecklist(text, "description")}
                value={checklist.description}
                maxLength={200}
            />
            </VStack>

        </ModuleScreen>
    );
};

export default CreateChecklist;