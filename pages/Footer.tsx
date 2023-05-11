import { Center, HStack, Icon, Text, Pressable } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Footer = ({ navigation }) => {
    return (
        <HStack bg="#D9D9D9" alignItems="center" safeAreaBottom shadow={6}>
            <Pressable py="3" flex={1} onPress={() => navigation.navigate("Home")}>
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="view-dashboard" />}
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
                    <Text>Requests</Text>
                </Center>
            </Pressable>
            <Pressable
                py="3"
                flex={1}
                onPress={() => {
                    navigation.navigate("Maintenance");
                }}
            >
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="playlist-check" />}
                        color="#C8102E"
                        size="lg"
                    />
                </Center>
                <Center>
                    <Text>Checklist</Text>
                </Center>
            </Pressable>
            <Pressable py="3" flex={1} onPress={() => navigation.navigate("ViewAsset")}>
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="sitemap" />}
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
                    navigation.navigate("Calendar");
                }}
            >
                <Center>
                    <Icon
                        mb="1"
                        as={<MaterialCommunityIcons name="calendar" />}
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
