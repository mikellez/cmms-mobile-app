import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { VStack, Input, TextArea, FormControl} from "native-base";
import { PlantSelect, AssetSelect, PersonSelect, AssetMultiSelect } from "../General";
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
                // space={3}
                width="100%"
            >
            <FormControl.Label>Checklist Name</FormControl.Label>
            <Input
                w={{
                    md: "25%"
                }} 
                // placeholder="Checklist Name" 
                onChangeText={text => updateChecklist(text, "chl_name")}
                value={props.checklist.chl_name}
                maxLength={100}
            />
            
            <FormControl.Label>Description</FormControl.Label>
            <TextArea 
                h={20} 
                placeholder="Description" 
                onChangeText={text => updateChecklist(text, "description")}
                value={props.checklist.description}
                maxLength={200}
                autoCompleteType={false}
            />

            <FormControl.Label>Plant</FormControl.Label>
            <PlantSelect 
                onChange={value => updateChecklist(+value, "plant_id")}
                accessControl
                value={props.checklist.plant_id ? props.checklist.plant_id.toString() : null}
            />

            <FormControl.Label>Asset</FormControl.Label>
            {/* <AssetSelect 
                onChange={value => updateChecklist(value, "linkedassetids")}
                plantId={props.checklist.plant_id}
            /> */}

            <AssetMultiSelect
                onChange={items => updateChecklist(items.join(","), "linkedasstids")}
                plantId={props.checklist.plant_id}
            />

            <FormControl.Label>Assign To</FormControl.Label>
            <PersonSelect 
                onChange={value => updateChecklist(+value, "assigned_user_id")}
                plantId={props.checklist.plant_id}
                placeholder=""
            />

            <FormControl.Label>Sign Off By</FormControl.Label>
            <PersonSelect 
                onChange={value => updateChecklist(+value, "signoff_user_id")}
                plantId={props.checklist.plant_id}
                placeholder=""
                value={props.checklist.signoff_user_id ? props.checklist.signoff_user_id.toString() : null}
            />
            
        </VStack>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 15,
        fontWeight: "500",
    }
})

export default ChecklistForm;