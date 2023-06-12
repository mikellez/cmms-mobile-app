import React from "react";
import App from "../../pages/App";
import { Center, HStack, Icon, VStack } from "native-base";
import { Provider, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { store } from "../../redux/store";
import Wrapper from "../Wrapper";

interface ModuleScreenProps extends React.PropsWithChildren {
    navigation: string;
    layout?: string;
};

const ModuleScreen = (props: ModuleScreenProps) => {

    return (
        <App layout={props.layout} navigation={props.navigation}>
            <Wrapper layout={props.layout}>
                <HStack flex={1} px="5" py="5">
                    <VStack flex={1}>
                        {props.children}
                    </VStack>
                </HStack>
            </Wrapper>
        </App>
    );
};

export { ModuleScreen }