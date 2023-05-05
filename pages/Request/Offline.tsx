import { Alert, Box, Center, CloseIcon, HStack, Heading, IconButton, NativeBaseProvider, VStack, Text } from 'native-base';
import { useEffect } from 'react';

const OfflineRequest = ({ route, navigation }) => {
  useEffect(() => {

  }, []);

  return (
    <NativeBaseProvider>
      <HStack flex={1}>
        <VStack flex={1}>
          <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
              <Heading size="md" color="#C8102E">Create Request</Heading>
            </HStack>
          </HStack>

          <Center>
            <VStack space={5} maxW="400">
              <Alert w="100%" status="danger">
                <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                  <Alert.Icon size="md" />
                  <Text fontSize="md" fontWeight="medium" _dark={{
                  color: "coolGray.800"
                }}>
                    You are now in offline mode
                  </Text>

                  <Box _text={{
                  textAlign: "center"
                }} _dark={{
                  _text: {
                    color: "coolGray.600"
                  }
                }}>
                    Your requests is pending to be submitted. We will submit your requests once you are back online.
                  </Box>
                </VStack>
              </Alert>
            </VStack>
            <Text>
              {}
            </Text>
          </Center>
        </VStack>
      </HStack>

    </NativeBaseProvider>

  )
}

export default OfflineRequest;