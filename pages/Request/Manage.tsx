
import { Button, HStack, Heading, Icon, VStack } from "native-base";
import { ModuleHeader, ModuleScreen } from "../../components/ModuleLayout";
import RequestContainer from "../../components/Request/RequestContainer";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const CompleteRequest = ({ route, navigation }) => {
  return (
    <ModuleScreen navigation={navigation}>
      <ModuleHeader header="Manage Request">
        <HStack >
          <Button padding={2} bg="#C8102E" leftIcon={<Icon as={MaterialCommunityIcons} name="arrow-left" size="sm"/>} size="xs" onPress={()=>navigation.goBack()}/>
        </HStack>
      </ModuleHeader>

      <HStack flex={1}>
        <VStack flex={1}>

          <RequestContainer route={route} navigation={navigation} action="manage"/>

        </VStack>
      </HStack>


    </ModuleScreen>
  )
}

export default CompleteRequest;