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
import { CMMSChangeOfParts } from "../../types/interfaces";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ModuleCardContainer, ModuleSimpleModal } from "../ModuleLayout";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { shortDateWithDay } from "../../helper";

const ScheduleCOPEvent = ({ COPSchedule }: { COPSchedule: CMMSChangeOfParts }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const renderModal = () => {
        setIsModalOpen(true);
        console.log(COPSchedule);
    };

    return (
        <ModuleCardContainer>
            <TouchableOpacity onPress={renderModal}>
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
            <ModuleSimpleModal
                title={`Change of Parts for ${COPSchedule.asset}`}
                isOpen={isModalOpen}
                setOpen={setIsModalOpen}
            >
                <Text>Change of Parts ID: {COPSchedule.copId}</Text>
                <Text>Plant: {COPSchedule.plant}</Text>
                <Text>Asset Name: {COPSchedule.asset}</Text>
                <Text>Description: {COPSchedule.description}</Text>
                <Text>
                    Date:{" "}
                    {COPSchedule.changedDate
                        ? shortDateWithDay(new Date(COPSchedule.changedDate))
                        : shortDateWithDay(new Date(COPSchedule.scheduledDate))}
                </Text>
                <Text>Assigned To: {COPSchedule.assignedUser}</Text>
                <Text>Status: {COPSchedule.changedDate ? "Completed" : "Scheduled"}</Text>
            </ModuleSimpleModal>
        </ModuleCardContainer>
    );
};

export default ScheduleCOPEvent;
