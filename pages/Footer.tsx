import { Center, HStack, Pressable, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Footer = ({ navigation }) => {
    return (
        <HStack bg="#D9D9D9" alignItems="center" safeAreaBottom shadow={6}>
            <Pressable
                py="3"
                flex={1}
                onPress={() => {
                    console.log("Navigating to overview");
                    navigation.navigate("Home");
                }}
            >
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="clipboard-clock-outline" />}
                        color="#C8102E"
                        size="lg"
                    />
                </Center>
                <Center>
                    <Text>Overview</Text>
                </Center>
            </Pressable>

            <Pressable
                py="3"
                flex={1}
                onPress={() => {
                    console.log("Navigating to work order");
                    navigation.navigate("Report");
                }}
            >
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="clipboard-clock-outline" />}
                        color="#C8102E"
                        size="lg"
                    />
                </Center>
                <Center>
                    <Text>Work Orders</Text>
                </Center>
            </Pressable>

            <Pressable
                py="3"
                flex={1}
                onPress={() => {
                    console.log("Navigating to mainenance");
                    navigation.navigate("Maintenance");
                }}
            >
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="clipboard-clock-outline" />}
                        color="#C8102E"
                        size="lg"
                    />
                </Center>
                <Center>
                    <Text>Maintenance</Text>
                </Center>
            </Pressable>

            <Pressable
                py="3"
                flex={1}
                onPress={() => {
                    console.log("Navigating to assets");
                    // navigation.navigate("Assets");
                }}
            >
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="clipboard-clock-outline" />}
                        color="#C8102E"
                        size="lg"
                    />
                </Center>
                <Center>
                    <Text>Assets</Text>
                </Center>
            </Pressable>

            <Pressable
                py="3"
                flex={1}
                onPress={() => {
                    console.log("Navigating to calendar");
                    navigation.navigate("Calendar");
                }}
            >
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="clipboard-clock-outline" />}
                        color="#C8102E"
                        size="lg"
                    />
                </Center>
                <Center>
                    <Text>Calendar</Text>
                </Center>
            </Pressable>
        </HStack>
    );
};

export default Footer;
