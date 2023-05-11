import React, { useEffect, useState, useContext } from "react";
import ChecklistSection from "./classes/ChecklistSection";
import ChecklistRow from "./classes/ChecklistRow";
import { FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CMMSChecklist } from "../../types/interfaces";
import { ChecklistEditableFormContext } from "../../context/checklistContext";

const ChecklistEditableForm = () => {
    const { sections, setSections } = useContext(ChecklistEditableFormContext);

    return (
        <SafeAreaView>
            <FlatList 
                data={sections}
                keyExtractor={section => section.getId()}
                renderItem={({ item }) => <ChecklistEditableFormSection section={item} />}
            />
        </SafeAreaView>
    );  
};


const ChecklistEditableFormSection = ({section}: {section: ChecklistSection}) => {
    return (
        <SafeAreaView>
            <Text style={styles.sectionTitle}>{section.description}</Text>
            <FlatList 
                data={section.rows}
                renderItem={({ item }) => <ChecklistEditableFormRow sectionId={section.getId()} row={item} />}
                keyExtractor={row => row.getId()}
            />
        </SafeAreaView>
    );
};

const ChecklistEditableFormRow = ({sectionId, row}: {sectionId: string, row: ChecklistRow}) => {
    return (
        <SafeAreaView>
            <Text style={styles.rowTitle}>{row.description}</Text>
            <FlatList
                data={row.checks}
                renderItem={({ item }) => <React.Fragment>{item.renderEditableForm()}</React.Fragment>}
                keyExtractor={check => check.getId()}
            />
        </SafeAreaView>
    );
};

const updateSpecificCheck = () => {
    
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    rowTitle: {
        fontSize: 15,
        fontWeight: "500",
    },
})

export { updateSpecificCheck }
export default ChecklistEditableForm;