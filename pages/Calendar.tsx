import {
    Text,
    Box,
    HStack,
    IconButton,
    StatusBar,
    NativeBaseProvider,
    Icon,
    Image,
    Pressable,
    Center,
    VStack,
    Flex,
    Container,
    Heading,
    Button,
} from "native-base";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import App from "./App";
import instance from "../axios.config";
const Calendar = ({ navigation }) => {
    return (
        <App navigation={navigation}>
            <HStack flex={1}>
                <VStack flex={1}>
                    <HStack px="5" py="5" w="100%" justifyContent="space-between">
                        <HStack>
                            <Heading size="md" color="#C8102E">
                                Calendar
                            </Heading>
                        </HStack>
                    </HStack>
                </VStack>
            </HStack>
            \
        </App>
    );
};

export default Calendar;
