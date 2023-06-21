import { ModuleHeader } from "../ModuleLayout";
import { Icon, HStack, Button} from "native-base"
import AntDesign from "react-native-vector-icons/AntDesign";

const ChecklistHeader = ({navigation, header}) => {
    return <ModuleHeader header={header}>
                <HStack space={3}>
                    <Button 
                        w="30" 
                        padding={2} 
                        bg="#CCCCCC"
                        leftIcon={
                            <Icon as={AntDesign} name="arrowleft" size="sm"/>
                        } 
                        size="xs"
                        onPress={() => navigation.goBack()}
                    ></Button>
                </HStack>
            </ModuleHeader>
}

export default ChecklistHeader;