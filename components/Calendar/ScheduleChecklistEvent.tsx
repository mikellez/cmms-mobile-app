import { Text, HStack, Icon, VStack } from "native-base";
import React, { useState } from "react";
import { CMMSSchedule } from "../../types/interfaces";
import { TouchableOpacity } from "react-native";
import { ModuleCardContainer, ModuleSimpleModal } from "../ModuleLayout";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { shortDateWithDay } from "../../helper/";
import { Table, Rows } from "react-native-table-component";

const ScheduleChecklistEvent = ({ checklistSchedule }: { checklistSchedule: CMMSSchedule }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const renderModal = () => {
        setIsModalOpen(true);
    };

    function toPeriodString(period: number): string {
        switch (period) {
            case 1:
                return "Daily";
            case 7:
                return "Weekly";
            case 14:
                return "Fortnightly";
            case 30:
                return "Monthly";
            case 90:
                return "Quarterly";
            case 180:
                return "Semi-Annually";
            case 365:
                return "Yearly";
            default:
                return "NA";
        }
    }

    const assignedUsersView = checklistSchedule.assignedUsers.map((user, index) => {
        return (
            <Text>
                {index + 1}.{user}
            </Text>
        );
    });

    const tableData = [
        ["Schedule ID:", checklistSchedule.scheduleId],
        ["Checklist ID:", checklistSchedule.checklistId],
        ["Plant:", checklistSchedule.plantName],
        ["Date:", shortDateWithDay(new Date(checklistSchedule.date))],
        ["Start Date:", shortDateWithDay(new Date(checklistSchedule.startDate))],
        ["End Date:", shortDateWithDay(new Date(checklistSchedule.endDate))],
        ["Recurring Period:", toPeriodString(checklistSchedule.recurringPeriod)],
        ["Assigned To:", <VStack>{assignedUsersView}</VStack>],
        ["Remarks:", checklistSchedule.remarks],
    ];
    const widthArr = [120, 150];

    return (
        <ModuleCardContainer>
            <TouchableOpacity onPress={renderModal}>
                <VStack>
                    <HStack space={1}>
                        <Icon
                            mb="1"
                            as={<MaterialCommunityIcons name="clipboard-clock-outline" />}
                            color="#C8102E"
                            size="6"
                        />
                        <Text fontSize={14} fontWeight={600} maxWidth={200}>
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
            </TouchableOpacity>
            <ModuleSimpleModal
                title={checklistSchedule.checklistName}
                isOpen={isModalOpen}
                setOpen={setIsModalOpen}
            >
                <Table >
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

export default ScheduleChecklistEvent;
