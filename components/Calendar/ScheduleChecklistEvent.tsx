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
import React, { useState } from "react";
import { CMMSSchedule } from "../../types/interfaces";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ModuleCardContainer, ModuleSimpleModal } from "../ModuleLayout";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { shortDate, shortDateWithDay } from "../../helper/";

const ScheduleChecklistEvent = ({ checklistSchedule }: { checklistSchedule: CMMSSchedule }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const renderModal = () => {
        setIsModalOpen(true);
    };

    return (
        <ModuleCardContainer>
            <TouchableOpacity onPress={renderModal}>
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
            <ModuleSimpleModal
                title={checklistSchedule.checklistName}
                isOpen={isModalOpen}
                setOpen={setIsModalOpen}
            >
                <Text>Schedule ID: {checklistSchedule.scheduleId}</Text>
                <Text>Checklist ID: {checklistSchedule.checklistId}</Text>
                <Text>Plant: {checklistSchedule.plantName}</Text>
                <Text>Date: {shortDateWithDay(new Date(checklistSchedule.date))}</Text>
                <Text>Start Date: {shortDateWithDay(new Date(checklistSchedule.startDate))}</Text>
                <Text>End Date: {shortDateWithDay(new Date(checklistSchedule.endDate))}</Text>
                <Text>Recurring Period: {checklistSchedule.recurringPeriod}</Text>
                <Text>Assigned To: {checklistSchedule.assignedUsers}</Text>
                <Text>Remarks: {checklistSchedule.remarks}</Text>
            </ModuleSimpleModal>
        </ModuleCardContainer>
    );
};

export default ScheduleChecklistEvent;
