import React, { useEffect, useState, useContext, SetStateAction } from "react";
import ChecklistSection from "./classes/ChecklistSection";
import ChecklistRow from "./classes/ChecklistRow";
import { FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CMMSChecklist } from "../../types/interfaces";
import { ChecklistEditableFormContext } from "../../context/checklistContext";
import { ModuleDivider } from "../ModuleLayout";

const ChecklistEditableForm = ({header, footer}) => {
    const { sectionsRef, sections, setSections } = useContext(ChecklistEditableFormContext);
    console.log('re-render')

    return (
        <SafeAreaView style={{marginBottom: 42}}>
            <ModuleDivider/>
            <FlatList 
                ListHeaderComponent={header}
                ListFooterComponent={footer}
                data={sectionsRef.current}
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
                renderItem={({ item }) => {
                    return (<React.Fragment>{item.renderEditableForm(sectionId, row.getId())}</React.Fragment>)}
                }
                keyExtractor={check => check.getId()}
            />
        </SafeAreaView>
    );
};

// Editing sectionState using setSections based on changed value in check
const updateSpecificCheck = (
    sectionId: string,
    rowId: string,
    checkId: string,
    value: string,
    setSections: React.Dispatch<SetStateAction<ChecklistSection[]>>,
    sectionsRef: React.MutableRefObject<ChecklistSection[]>
) => {
    /*setSections(prevSections => {
        const newSections = [...prevSections];

        for (let i = 0; i < prevSections.length; i++) {
            if (newSections[i].getId() === sectionId) {
                newSections[i].updateSection(rowId, checkId, value);
            }
        }
        return newSections;
    })*/
    for(let i = 0; i < sectionsRef.current.length; i++) {
        if (sectionsRef.current[i].getId() === sectionId) {
            sectionsRef.current[i].updateSection(rowId, checkId, value);
        }
    }

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