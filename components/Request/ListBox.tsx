import { HStack, Heading, Text, Box, Center, IconButton, Icon, Pressable, VStack } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { View } from 'react-native';
import {Collapse, CollapseHeader, CollapseBody} from "accordion-collapse-react-native";

const ListBox = ({ item, navigation }) => {
  return (
    <>
    <Box key={item.request_id} px="1" mx="2" rounded="md" _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} borderWidth={1} borderColor='#C8102E'>
      <HStack justifyContent="space-between" flex={1}>
        <Pressable onPress={()=>navigation.navigate("ViewRequest", { id: item.request_id })}>
          <HStack justifyContent="space-between" w="100%">
            <HStack alignItems="center" px={3}>
              <VStack>
                <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="clipboard-clock-outline" color="#C8102E" />} />
                <Text fontSize="10">{item.priority}</Text>
              </VStack>
            </HStack>
            <HStack alignItems="center" flex={2}>
              <VStack>
                <HStack w="100%" justifyContent="space-between">
                  <Text><Heading size="xs">Case ID:</Heading> {item.request_id}</Text>
                  <Text><Heading size="xs">{item.status}</Heading></Text>
                </HStack>
                <Text flexShrink={1}><Heading size="xs">Fault Type:</Heading> {item.asset_name}</Text>
              </VStack>
            </HStack>
            <HStack alignItems="center" flex={1}>
              <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="chevron-down" color="#C8102E" />} />
            </HStack>
          </HStack>
        </Pressable>
      </HStack>
    </Box>
    <Box key={`${item.request_id}_2`} py="2" px="2" mx="2" rounded="md" _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} borderWidth={1} borderColor='#C8102E'>
      <VStack>
        <Text>Location: {item.plant_name}</Text>
        <Text>Asset Name: {item.asset_name}</Text>
        <Text>Requested By: {item?.request_name ?? '-'}</Text>
        <HStack>
            {
              ['PENDING', 'ASSIGNED'].includes(item.status)
              && <IconButton icon={<Icon size="lg" as={AntDesign} name="adduser" color="#C8102E" />} onPress={()=>navigation.navigate("AssignRequest", { id: item.request_id })}/>
            }
            <Pressable onPress={()=>navigation.navigate("CompleteRequest", { id: item.request_id })}>
              <HStack>
                <Text>Complete</Text>
              </HStack>
            </Pressable>
        </HStack>

      </VStack>
    </Box>
    </>
  )
}

export default ListBox;