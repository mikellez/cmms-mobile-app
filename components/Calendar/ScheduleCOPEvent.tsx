import { Text, HStack, Icon, VStack } from "native-base";
import React, { useState } from "react";
import { CMMSChangeOfParts } from "../../types/interfaces";
import { View, TouchableOpacity } from "react-native";
import { ModuleCardContainer, ModuleSimpleModal } from "../ModuleLayout";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getChecklistStatusColor, shortDateWithDay } from "../../helper";
import { Table, Rows } from "react-native-table-component";

const ScheduleCOPEvent = ({ COPSchedule }: { COPSchedule: CMMSChangeOfParts }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const renderModal = () => {
        setIsModalOpen(true);
    };

    const renderedDate = COPSchedule.changedDate
        ? shortDateWithDay(new Date(COPSchedule.changedDate))
        : shortDateWithDay(new Date(COPSchedule.scheduledDate));

    const status = COPSchedule.changedDate ? "Completed" : "Scheduled";
    const statusId = COPSchedule.changedDate ? 4 : 1;
    const tableData = [
        ["COP ID:", COPSchedule.copId],
        ["Plant:", COPSchedule.plant],
        ["Asset Name:", COPSchedule.asset],
        ["Description:", COPSchedule.description],
        ["Date:", renderedDate],
        ["Assigned To:", COPSchedule.assignedUser],
        ["Status:", status],
    ];
    const widthArr = [100, 170];

    return (
        <ModuleCardContainer>
            <TouchableOpacity onPress={renderModal}>
                <VStack>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <HStack space={1}>
                            <Icon
                                mb="1"
                                as={<MaterialCommunityIcons name="cog-sync-outline" />}
                                color="#C8102E"
                                size="6"
                            />
                            <Text fontSize={14} fontWeight={600} maxWidth={200}>
                                Change of Parts: {COPSchedule.asset}
                            </Text>
                        </HStack>
                        <Text
                            textTransform="uppercase"
                            fontWeight={500}
                            color={getChecklistStatusColor(statusId)}
                        >
                            {status}
                        </Text>
                    </View>

                    <HStack alignItems="center">
                        <Icon as={EntypoIcon} name="location-pin" size="sm"></Icon>

                        <Text fontSize={12} style={{ color: "#454545" }}>
                            {COPSchedule.plant}
                        </Text>
                    </HStack>

                    <Text>Description: {COPSchedule.description}</Text>
                </VStack>
            </TouchableOpacity>
            <ModuleSimpleModal
                title={`Change of Parts for ${COPSchedule.asset}`}
                isOpen={isModalOpen}
                setOpen={setIsModalOpen}
            >
                <Table>
                    <Rows
                        data={tableData}
                        widthArr={widthArr}
                        style={{ paddingTop: 5, paddingBottom: 5, borderTopColor: "#ffff", borderTopWidth: 1,  }}
                    ></Rows>
                </Table>
            </ModuleSimpleModal>
        </ModuleCardContainer>
    );
};

export default ScheduleCOPEvent;
