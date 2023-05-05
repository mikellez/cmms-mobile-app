import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Box, Input, HStack, IconButton, VStack, Row } from "native-base";
import ChecklistSection from "./classes/ChecklistSection";
import ChecklistCreatorRow from "./ChecklistCreatorRow";
import ChecklistRow from "./classes/ChecklistRow";

const ChecklistCreatorSection = ({section, setSections} : {
    section: ChecklistSection,
    setSections: React.Dispatch<React.SetStateAction<ChecklistSection[]>>,
}) => {

    const [rows, setRows] = useState<ChecklistRow[]>([]);

    useEffect(() => {
        if (section.rows) {
            setRows(section.rows);
        } else setRows([]);
    }, [section.rows]);

    const rowElements = rows.map(row => {
        return (
            <ChecklistCreatorRow 
                key={row.getId()}
                row={row}
                setRows={setRows}
            />
        );
    });

    const deleteSection = (sectionId: string) => {
        setSections(prev => prev.filter(item => item.getId() != sectionId));
    };

    const addRow = (sectionId: string) => {
        const newRow = new ChecklistRow();

        setRows(prev => [...prev, newRow]);

        setSections(prev => {
            const newSections = [...prev];
            for (let i = 0; i < prev.length; i++) {
                if (prev[i].getId() === sectionId) {
                    newSections[i].rows.push(newRow);
                }
            }
            return newSections;
        });
    };

        const handleTextChange = (text: string, sectionId: string) => {
        setSections(prev => {
            const newSections = [...prev];
            for (let i = 0; i < prev.length; i++) {
                if (prev[i].getId() === sectionId) {
                    newSections[i].description = text;
                }
            }
            return newSections;
        });
    };
    
    return (
        <Box
            py={1}
            my={2}
        >
            <HStack space={2}>
                <Input 
                    w="80%"
                    placeholder="Section Description"
                    onChangeText={text => handleTextChange(text, section.getId())}
                    // value={section.description}
                />
                <IconButton
                    marginLeft="auto"
                    _icon={{
                        as: MaterialIcons,
                        name: "add"
                    }}
                    colorScheme="white"
                    onPress={() => addRow(section.getId())}
                />
                <IconButton
                    marginLeft="auto"
                    _icon={{
                        as: MaterialCommunityIcons,
                        name: "delete-outline"
                    }}
                    colorScheme="white"
                    onPress={() => deleteSection(section.getId())}
                />
            </HStack>

            <VStack>
                {rowElements}
            </VStack>
        </Box>
    );
};

export default ChecklistCreatorSection;