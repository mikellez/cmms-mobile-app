import { HStack, Heading, Text, Box, Center, IconButton, Icon, Pressable, VStack } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ListBox = ({ key, item, navigation }) => {
  return (
    <Box px="1" py="1" m="2" rounded="md" _text={{ fontSize: 'md', fontWeight: 'medium', textAlign: 'center' }} borderWidth={1} borderColor='#C8102E'>
      <HStack  key={item.request_id} justifyContent="space-between" flex={1}>
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
                <Text><Heading size="xs">Case ID:</Heading> {item.request_id}</Text>
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
  )
}

export default ListBox;