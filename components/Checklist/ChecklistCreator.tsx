import React, { useState, useEffect, useContext } from "react";
import { FlatList } from "react-native";
import { VStack, FormControl } from "native-base";
import ChecklistSection from "./classes/ChecklistSection";
import ChecklistCreatorSection from "./ChecklistCreatorSection";
import { ChecklistCreateFormContext } from "../../context/checklistContext";

const ChecklistCreator = ({header, footer}) => {
    const { sections, setSections, level, setLevel } = useContext(ChecklistCreateFormContext)

    const addSection = () => {
        const newSection = new ChecklistSection();
        setSections(prev => [...prev, newSection]);
    };


    if (level === 1) {
        setLevel(0);
    }
    
    const sectionElements = <FlatList ListHeaderComponent={header}
                                    ListFooterComponent={footer}
                                    data={sections}
                                    keyExtractor={section => section.getId()}
                                    renderItem={({item}) => <ChecklistCreatorSection section={item}/>}/>
    
    return (
        <VStack style={{marginBottom: 56}}>
            <FormControl.Label>Checklist Content</FormControl.Label>
            {/* <IconButton 
                _icon={{
                    as: Ionicons,
                    name: "add"
                }}
                variant="solid"
                colorScheme="white"
                backgroundColor="#C8102E"
                size={7}
                onPress={addSection}
            /> */}
            <>
                {sectionElements}
            </>
        </VStack>
    );
};

export default ChecklistCreator;