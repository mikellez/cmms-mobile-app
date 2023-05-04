import React from "react";
import App from "../../pages/App";
import { HStack, VStack } from "native-base";

interface ModuleScreenProps extends React.PropsWithChildren {
    navigation: string
};

const ModuleScreen = (props: ModuleScreenProps) => {
    return (
        <App navigation={props.navigation}>
            <HStack flex={1} px="5" py="5">
                <VStack flex={1} alignItems="center">{props.children}</VStack>
            </HStack>
        </App>
    );
};

export { ModuleScreen }