import React, { useEffect, useState } from "react";
import ChecklistSection from "./classes/ChecklistSection";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CMMSChecklist } from "../../types/interfaces";

const ChecklistFillableForm = () => {
    
    return (
        <SafeAreaView>

        </SafeAreaView>
    );
};

const ChecklistFillableFormSections = ({sections}: {sections: ChecklistSection[]}) => {
    return (
        <SafeAreaView>
            <FlatList 
                data={sections}
                keyExtractor={section => section.getId()}
                renderItem={({ item }) => <ChecklistFillableFormSection section={item} />}
            />
        </SafeAreaView>
    );  
};

const ChecklistFillableFormSection = ({section}: {section: ChecklistSection}) => {
    return (
        <SafeAreaView>

        </SafeAreaView>
    );
};

export default ChecklistFillableForm;