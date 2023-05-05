import { HStack, Heading, VStack } from 'native-base';
import { ModuleScreen } from '../../components/ModuleLayout';
import RequestContainer from '../../components/Request/RequestContainer';

const AssignRequest = ({ route, navigation }) => {
  return (
    <ModuleScreen navigation={navigation}>

      <HStack flex={1}>
        <VStack flex={1}>
          <HStack px="5" py="5" w="100%" justifyContent="space-between">
            <HStack>
              <Heading size="md" color="#C8102E">Assign Request</Heading>
            </HStack>
          </HStack>

          <RequestContainer route={route} navigation={navigation} action="assign"/>

        </VStack>
      </HStack>

    </ModuleScreen>
  )
}

export default AssignRequest;