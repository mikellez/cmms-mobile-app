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
import { CMMSSchedule } from "../../types/interfaces";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ModuleCardContainer } from "../ModuleLayout";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ScheduleChecklistEvent = ({ checklistSchedule }: { checklistSchedule: CMMSSchedule }) => {
    return (
        <ModuleCardContainer>
            <TouchableOpacity>
                <HStack>
                    <VStack>
                        <HStack>
                            <Icon
                                mb="1"
                                as={<MaterialCommunityIcons name="clipboard-clock-outline" />}
                                color="#C8102E"
                                size="8"
                            />
                            <Text fontSize={14} fontWeight={600}>
                                {checklistSchedule.checklistName}
                            </Text>
                        </HStack>

                        <HStack alignItems="center">
                            <Icon as={EntypoIcon} name="location-pin" size="sm"></Icon>

                            <Text fontSize={12} style={{ color: "#454545" }}>
                                {checklistSchedule.plantName}
                            </Text>
                        </HStack>

                        <Text>Remarks: {checklistSchedule.remarks}</Text>
                    </VStack>
                </HStack>
            </TouchableOpacity>
        </ModuleCardContainer>
    );
};

export default ScheduleChecklistEvent;
