import React from "react";
import { Box, HStack, IconButton, Input } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ChecklistRow from "./classes/ChecklistRow";

const ChecklistCreatorRow = ({row, setRows} : {
    row: ChecklistRow,
    setRows: React.Dispatch<React.SetStateAction<ChecklistRow[]>>
}) => {

    const deleteRow = (rowId: string) => {
        setRows(prev => prev.filter(item => item.getId() != rowId));
    };
    
    return (
        <Box>
            <HStack space={2}>
                <Input 
                    w="80%"
                    placeholder="Row Description"
                />
                <IconButton
                    marginLeft="auto"
                    _icon={{
                        as: MaterialCommunityIcons,
                        name: "dots-vertical"
                    }}
                    colorScheme="white"
                />
                <IconButton
                    marginLeft="auto"
                    _icon={{
                        as: MaterialCommunityIcons,
                        name: "delete-outline"
                    }}
                    colorScheme="white"
                    onPress={() => deleteRow(row.getId())}
                />
            </HStack>
        </Box>
    );
};

export default ChecklistCreatorRow;