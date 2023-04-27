import React from "react";
import { HStack, Heading } from "native-base";
import App from "../App";

const CreateChecklist = ({ navigation }) => {
    return (
        <App navigation={navigation}>
            <HStack px="5" py="5" w="100%" justifyContent="space-between">
                <Heading size="md" color="#C8102E">Create Checklist</Heading>
            </HStack>
            <HStack>
                
            </HStack>
        </App>
    );
};

export default CreateChecklist;