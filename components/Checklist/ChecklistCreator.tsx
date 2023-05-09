import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import { IconButton, ScrollView, VStack } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import ChecklistSection from "./classes/ChecklistSection";
import ChecklistCreatorSection from "./ChecklistCreatorSection";
import { ChecklistFormContext } from "../../pages/Checklist/CreateChecklistFormPage";

const ChecklistCreator = () => {
    const { sections, setSections, level, setLevel } = useContext(ChecklistFormContext)

    const addSection = () => {
        const newSection = new ChecklistSection();
        setSections(prev => [...prev, newSection]);
    };

    const sectionElements = sections.map(section => {
        return (
            <ChecklistCreatorSection
                key={section.getId()}
                section={section}
            />
        );
    });

    if (level === 1) {
        setLevel(0);
    }
 
    return (
        <View>
            <VStack>
                <IconButton 
                    _icon={{
                        as: Ionicons,
                        name: "add"
                    }}
                    variant="solid"
                    colorScheme="white"
                    backgroundColor="#C8102E"
                    size={7}
                    onPress={addSection}
                />
                <ScrollView>
                    {sectionElements}
                </ScrollView>
            </VStack>
        </View>
    );
};

export default ChecklistCreator;