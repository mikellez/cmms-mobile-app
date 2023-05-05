import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, ScrollView, VStack } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistSection from "./classes/ChecklistSection";
import ChecklistRow from "./classes/ChecklistRow";
import ChecklistCreatorSection from "./ChecklistCreatorSection";


const ChecklistCreator = ({ checklist, setChecklist } : { 
    checklist: CMMSChecklist,
    setChecklist: React.Dispatch<React.SetStateAction<CMMSChecklist>> 
}) => {

    const [sections, setSections] = useState<ChecklistSection[]>([]);

    const addSection = () => {
        const newSection = new ChecklistSection();
        setSections(prev => [...prev, newSection]);
    };

    const sectionElements = sections.map(section => {
        return (
            <ChecklistCreatorSection
                key={section.getId()}
                section={section}
                setSections={setSections}
            />
        );
    });
    console.log(sections)
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