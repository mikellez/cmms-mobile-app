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
    Card,
} from "native-base";
import React from "react";
import { CMMSChangeOfParts } from "../../types/interfaces";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ModuleCardContainer } from "../ModuleLayout";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ScheduleCOPEvent = ({ COPSchedule }: { COPSchedule: CMMSChangeOfParts }) => {
    return (
        <ModuleCardContainer>
            <TouchableOpacity>
                <HStack>
                    <VStack>
                        <HStack>
                            <Icon
                                mb="1"
                                as={<MaterialCommunityIcons name="cog-sync-outline" />}
                                color="#C8102E"
                                size="8"
                            />
                            <Text fontSize={14} fontWeight={600}>
                                {COPSchedule.asset}
                            </Text>
                        </HStack>

                        <HStack alignItems="center">
                            <Icon as={EntypoIcon} name="location-pin" size="sm"></Icon>

                            <Text fontSize={12} style={{ color: "#454545" }}>
                                {COPSchedule.plant}
                            </Text>
                        </HStack>

                        <Text>Description: {COPSchedule.description}</Text>
                    </VStack>
                </HStack>
            </TouchableOpacity>
        </ModuleCardContainer>
    );
};

export default ScheduleCOPEvent;
