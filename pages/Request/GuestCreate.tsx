import { HStack, Heading, NativeBaseProvider, VStack } from 'native-base';
import RequestContainer from '../../components/Request/RequestContainer';
import { ModuleScreen } from '../../components/ModuleLayout';

const CreateRequest = ({ route, navigation }) => {
  return (
    <ModuleScreen layout="empty" navigation={navigation}>

      <HStack flex={1}>
        <VStack flex={1}>
          <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
              <Heading size="md" color="#C8102E">Create Request</Heading>
            </HStack>
          </HStack>
          <RequestContainer route={route} navigation={navigation} action="create" type="guest"/>
        </VStack>
      </HStack>

    </ModuleScreen>


  )
}

export default CreateRequest;