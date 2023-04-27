import React from "react";
import { HStack, Heading } from "native-base";

interface ModuleHeaderProps extends React.PropsWithChildren {
    header: string
};

const ModuleHeader = (props: ModuleHeaderProps) => {
    return (
        <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
                <Heading size="md" color="#C8102E">{props.header}</Heading>
            </HStack>
            {props.children}
        </HStack>
    );
};

export { ModuleHeader }