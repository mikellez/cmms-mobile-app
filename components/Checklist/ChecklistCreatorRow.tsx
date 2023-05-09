import React, { useCallback, useContext, useState, useEffect } from "react";
import { Box, HStack, IconButton, Input, Actionsheet, useDisclose, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ChecklistRow from "./classes/ChecklistRow";
import { FreeTextType, SignatureType, SingleChoiceType, MultiChoiceType } from "./Checks";
import { ChecklistFormContext } from "../../pages/Checklist/CreateChecklistFormPage";
import CheckType from "./classes/CheckType";
import { ModuleCardContainer } from "../ModuleLayout";
import { View } from "react-native";

const Choices = ["SingleChoice", "MultiChoice", "FreeText", "Signature"];

const ChecklistCreatorRow = ({
    row,
    setRows,
}: {
    row: ChecklistRow;
    setRows: React.Dispatch<React.SetStateAction<ChecklistRow[]>>;
}) => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const [checks, setChecks] = useState<CheckType[]>([]);
    const { level, setLevel } = useContext(ChecklistFormContext);

    const deleteRow = (rowId: string) => {
        setRows((prev) => prev.filter((item) => item.getId() != rowId));
    };

    const handleTextChange = (text: string, rowId: string) => {
        setRows((prevRows) => {
            const newRows = [...prevRows];
            for (let i = 0; i < prevRows.length; i++) {
                if (prevRows[i].getId() === rowId) {
                    newRows[i].description = text;
                }
            }
            return newRows;
        });
    };

    const actionSheetItems = Choices.map((choice, index) => {
        return (
            <Actionsheet.Item key={index} onPress={() => addNewCheck(index)}>
                {choice}
            </Actionsheet.Item>
        );
    });

    const createNewCheck = useCallback((index: number) => {
        switch (index) {
            case 0:
                return new SingleChoiceType("", "", ["Yes", "No"]);
            case 1:
                return new MultiChoiceType("", "", ["Option 1", "Option 2"])
            case 2:
                return new FreeTextType("", "");
            case 3:
                return new SignatureType("", "");
        }
    }, []);

    const addNewCheck = (index: number) => {
        const newCheck = createNewCheck(index);
        setChecks((prev) => [...prev, newCheck]);

        onClose();
    };

    const deleteCheck = useCallback((checkId: string) => {
        setChecks((prevChecks) => prevChecks.filter((check) => check.getId() !== checkId));
    }, []);

    const checkElements = checks.map(check => {
        return (
            <View key={check.getId()}>
                {check.renderCreatorForm(deleteCheck, setChecks)}
            </View>
        );
    });

    if (level === 3) {
        setRows((prevRows) => {
            const newRows = [...prevRows];
            for (let i = 0; i < prevRows.length; i++) {
                if (prevRows[i].getId() === row.getId()) {
                    appendChecks(newRows[i]);
                }
            }
            return newRows;
        });

        setLevel(2);
    }

    const appendChecks = (row: ChecklistRow) => {
        row.removeAllChecks();

        checks.forEach((check) => {
            row.addCheck(check);
        });
    };

    useEffect(() => {
        if (row.checks) {
            setChecks(row.checks);
            // console.log(row.checks)
        } else setChecks([])
    }, [row])

    return (
        <ModuleCardContainer>
            <VStack>
                <HStack space={2}>
                    <Input
                        w="80%"
                        my={2}
                        placeholder="Row Description"
                        onChangeText={text => handleTextChange(text, row.getId())}
                        defaultValue={row.description}
                    />
                    <IconButton
                        marginLeft="auto"
                        _icon={{
                            as: MaterialCommunityIcons,
                            name: "dots-vertical",
                        }}
                        colorScheme="white"
                        onPress={onOpen}
                    />
                    <IconButton
                        marginLeft="auto"
                        _icon={{
                            as: MaterialCommunityIcons,
                            name: "delete-outline",
                        }}
                        colorScheme="white"
                        onPress={() => deleteRow(row.getId())}
                    />
                </HStack>

                {checkElements}
                
            </VStack>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                {actionSheetItems}
            </Actionsheet>
        </ModuleCardContainer>
    );
};

export default ChecklistCreatorRow;
