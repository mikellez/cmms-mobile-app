import React, { useState, useEffect, useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Box, Input, HStack, IconButton, VStack, Row } from "native-base";
import ChecklistSection from "./classes/ChecklistSection";
import ChecklistCreatorRow from "./ChecklistCreatorRow";
import ChecklistRow from "./classes/ChecklistRow";
import { ChecklistFormContext } from "../../pages/Checklist/CreateChecklistFormPage";
import { ModuleCardContainer } from "../ModuleLayout";

const ChecklistCreatorSection = ({section} : {
    section: ChecklistSection,
}) => {

    const [rows, setRows] = useState<ChecklistRow[]>([]);
    const { setSections, level, setLevel } = useContext(ChecklistFormContext);

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
    };

    const handleTextChange = (text: string, sectionId: string) => {
        setSections(prevSections => {
            const newSections = [...prevSections];
            for (let i = 0; i < prevSections.length; i++) {
                if (prevSections[i].getId() === sectionId) {
                    newSections[i].description = text;
                }
            }
            return newSections;
        });
    };

    const appendRows = (section: ChecklistSection) => {
        section.removeAllRows();

        rows.forEach(row => {
            section.addRow(row);
        });
    };

    if (level === 2) {
        setSections(prevSections => {
            const newSections = [...prevSections];
            for (let i = 0; i < prevSections.length; i++) {
                if (prevSections[i].getId() === section.getId()) {
                    appendRows(newSections[i]);
                }
            }
            return newSections;
        });

        setLevel(1);
    }

    return (
        <ModuleCardContainer>
            <HStack space={2}>
                <Input 
                    my={2}
                    w="80%"
                    placeholder="Section Description"
                    onChangeText={text => handleTextChange(text, section.getId())}
                    defaultValue={section.description}
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

            <VStack space={2}>
                {rowElements}
            </VStack>
        </ModuleCardContainer>
    );
};

export default ChecklistCreatorSection;