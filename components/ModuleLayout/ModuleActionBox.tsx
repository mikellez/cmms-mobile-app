import React from "react";
import { Pressable, Text } from "react-native";

interface ModuleActionBoxProps {
    value: string | number,
    label: string
    setValue: React.Dispatch<React.SetStateAction<string | number>>
};

const ModuleActionBox = (props: ModuleActionBoxProps) => {
    return (
        <Pressable 
            onPress={() => props.setValue(props.value)}
            style={{
                backgroundColor: "#C8102E",
                borderRadius: 5,
            }}
        >
            <Text
                style={{
                    color: "white"
                }}
            >{props.label}</Text>
        </Pressable>
    );
};

export { ModuleActionBox }