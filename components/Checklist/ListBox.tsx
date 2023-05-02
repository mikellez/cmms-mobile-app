import React from "react";
import { HStack, Heading, Text, Box, Center, IconButton, Icon, Pressable, VStack } from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { CMMSChecklist } from "../../types/interfaces";
import { shortDate, getChecklistStatusColor } from "../../helper";
import { ModuleCardContainer } from "../ModuleLayout";

const ListBox = ({ checklist }: { checklist: CMMSChecklist }) => {

    return (
        <ModuleCardContainer>
            <HStack>
                <VStack>
                    <Text 
                        fontSize={14}
                        fontWeight={600}
                    >
                        {checklist.chl_name}
                    </Text>

                    <HStack alignItems="center">
                        <Icon as={EntypoIcon} name="location-pin" size="sm"></Icon>
                        <Text
                            fontSize={12}
                            style={{color: '#454545'}}
                        >
                            {checklist.plant_name}
                        </Text>
                    </HStack>

                    <Text
                        fontSize={12}
                        fontWeight={600}
                        style={{color: getChecklistStatusColor(checklist.status_id)}}
                    >
                        {checklist.status}
                    </Text>

                    <Text>
                        Created By: {checklist.createdbyuser}
                    </Text>

                    <Text>
                        Assigned To: {checklist.assigneduser}
                    </Text>
                </VStack>

                <Text marginLeft="auto">
                    {shortDate(new Date(checklist.created_date))}
                </Text>
            </HStack>
        </ModuleCardContainer>
    );
};

export default ListBox;