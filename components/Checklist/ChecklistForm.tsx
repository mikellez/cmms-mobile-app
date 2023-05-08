import React from "react";
import { VStack, Input, TextArea } from "native-base";
import { PlantSelect, AssetSelect, PersonSelect } from "../General";
import { CMMSChecklist } from "../../types/interfaces";

interface ChecklistFormProps {
    checklist: CMMSChecklist,
    setChecklist: React.Dispatch<React.SetStateAction<CMMSChecklist>>,
}

const ChecklistForm = (props: ChecklistFormProps) => {

    const updateChecklist = (value: string | number | Date, field: string) => {
        props.setChecklist(prev => {
            return {
                ...prev,
                [field]: value
            } as CMMSChecklist
        });
    };

    return (
        <VStack 
                marginY={3}
                space={3}
                width="100%"
            >
            <Input
                w={{
                    md: "25%"
                }} 
                placeholder="Checklist Name" 
                onChangeText={text => updateChecklist(text, "chl_name")}
                value={props.checklist.chl_name}
                maxLength={100}
            />

            <TextArea 
                h={20} 
                placeholder="Description" 
                onChangeText={text => updateChecklist(text, "description")}
                value={props.checklist.description}
                maxLength={200}
            />

            <PlantSelect 
                onChange={value => updateChecklist(+value, "plant_id")}
                accessControl
            />

            <AssetSelect 
                onChange={value => updateChecklist(value, "linkedassetids")}
                plantId={props.checklist.plant_id}
            />

            <PersonSelect 
                onChange={value => updateChecklist(+value, "assigned_user_id")}
                plantId={props.checklist.plant_id}
            />

            <PersonSelect 
                onChange={value => updateChecklist(+value, "signoff_user_id")}
                plantId={props.checklist.plant_id}
                placeholder="Sign Off By"
            />
        </VStack>
    );
};

export default ChecklistForm;