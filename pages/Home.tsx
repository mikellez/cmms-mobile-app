import {
    Text,
    Box,
    HStack,
    IconButton,
    StatusBar,
    NativeBaseProvider,
    Icon,
    Image,
    Pressable,
    Center,
    VStack,
    Flex,
    Container,
    Heading,
    Button,
} from "native-base";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import App from "./App";
import instance from "../axios.config";

interface IUser {
    id: number;
    allocated_plants: [];
    name: string;
    role_id: number;
    role_name: string;
}

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState<IUser>();

    const fetchUserDetail = async () => {
        await instance
            .get(`/api/user`)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchUserDetail();
    }, []);

    return (
        <App navigation={navigation}>
            <HStack flex={1}>
                <VStack flex={1}>
                    <HStack px="5" py="5" w="100%" justifyContent="space-between">
                        <HStack>
                            <Heading size="md" color="#C8102E">
                                Overview
                            </Heading>
                        </HStack>
                    </HStack>
                </VStack>
            </HStack>

            <Center>
                <HStack flex={1}>
                    {/*<Pressable onPress={()=>navigation.navigate("Report")}>
            <Center w="64" h="10" backgroundColor={"#F2F2F2"} rounded="md" shadow={3} >
              <HStack justifyContent="space-between" w="100%">
                <HStack alignItems="center">
                  <IconButton icon={<Icon size="lg" as={MaterialCommunityIcons} name="clipboard-clock-outline" color="#C8102E" />} />
                  <Text>Report</Text>
                </HStack>
                <HStack alignItems="center">
                  <IconButton icon={<Icon size="lg" as={MaterialIcons} name="chevron-right" color="#C8102E" />} />
                </HStack>
              </HStack>
            </Center>
          </Pressable>*/}
                </HStack>
            </Center>
        </App>
    );
};

export default HomeScreen;
