import { HStack, Heading, NativeBaseProvider, VStack } from 'native-base';
import RequestContainer from '../../components/Request/RequestContainer';

const CreateRequest = ({ route, navigation }) => {
  return (
    <NativeBaseProvider>
      <HStack flex={1}>
        <VStack flex={1}>
          <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
              <Heading size="md" color="#C8102E">Create Request</Heading>
            </HStack>
          </HStack>
          <RequestContainer route={route} navigation={navigation} action="create"/>
        </VStack>
      </HStack>

    </NativeBaseProvider>

  )
}

export default CreateRequest;