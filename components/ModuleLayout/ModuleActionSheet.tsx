import React, { useState } from "react";
import { Actionsheet, HStack, Button, Text, ChevronDownIcon, useDisclose, ChevronUpIcon } from "native-base";
import { GestureResponderEvent } from "react-native";

interface ModuleActionSheetProps {
    items: ModuleActionSheetItem[],
    onSelect?: (event: GestureResponderEvent, item: any) => void,
    value: string | number;
    setValue: React.Dispatch<React.SetStateAction<string | number>>
};

interface ModuleActionSheetItem {
    label: string,
    value: string | number,
};

const ModuleActionSheet = (props: ModuleActionSheetProps) => {
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const actionSheetState = useDisclose();

    const actionSheetElements = props.items.map(item => {
        return (
            <Actionsheet.Item 
                key={item.value}
                onPress={(e) => props.onSelect ? onSelect(e, item.value) : handleSelect(item)}
                style={{
                    backgroundColor: item.value === props.value ? "#F0EEED" : "white",
                }}
                disabled={item.value === props.value}
            >
                {item.label}
            </Actionsheet.Item> 
        );
    });

    const onSelect = (event: GestureResponderEvent, item: any) => {
        props.onSelect(event, item);
        closeActionSheet();
    }

    const handleSelect = (item: ModuleActionSheetItem) => {
        props.setValue(item.value);
        closeActionSheet();
    };

    const handleButtonClick = () => {
        actionSheetState.onOpen();
        setIsClicked(true);
    };

    const closeActionSheet = () => {
        actionSheetState.onClose();
        setIsClicked(false);
    };

    const label = props.items.find(item => item.value === props.value).label;

    return (
        <>
        <HStack>
            <Button 
                onPress={handleButtonClick}
                backgroundColor="white"
                borderColor="#C8102E"
                variant="outline"
                px={1}
                py={0}
                marginY={3}
            >
                <HStack alignItems="center" style={{gap: 2}}>
                    <Text>{label}</Text>
                    {isClicked ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </HStack>
            </Button>
        </HStack>

        <Actionsheet isOpen={actionSheetState.isOpen} onClose={closeActionSheet}>
            <Actionsheet.Content>
                {actionSheetElements}
            </Actionsheet.Content>
        </Actionsheet>
        </>
    );
};

export { ModuleActionSheet, ModuleActionSheetItem };