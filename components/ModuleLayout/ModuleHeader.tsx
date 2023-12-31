import React from "react";
import { HStack, Heading } from "native-base";

interface ModuleHeaderProps extends React.PropsWithChildren {
    header: string
};

const ModuleHeader = (props: ModuleHeaderProps) => {
    return (
        <HStack w="100%" justifyContent="space-between" marginBottom={3}>
            <HStack>
                <Heading size="md" color="#C8102E">{props.header}</Heading>
            </HStack>
            {props.children}
        </HStack>
    );
};

export { ModuleHeader }