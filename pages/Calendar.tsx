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
    Card,
} from "native-base";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import App from "./App";
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from "react-native-calendars";
import instance from "../axios.config";
import { TouchableOpacity } from "react-native";

const Calendar = ({ navigation }) => {
    const [items, setItems] = useState({});

    function timeToString(time: number) {
        const date = new Date(time);
        return date.toISOString().split("T")[0];
    }

    const loadItems = (day: DateData) => {
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: "Item for " + strTime + " #" + j,
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            day: strTime,
                        });
                    }
                }
            }
        });
        // console.log(items);
    };

    const renderItem = (item) => {
        console.log(item);
        return (
            <TouchableOpacity style={{ marginRight: 10, marginTop: 30, height: 300 }}>
                <Card>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text> {item.name}</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <App navigation={navigation}>
            {/* <HStack flex={1}>
                <VStack flex={1}>
                    <HStack px="5" py="5" w="100%" justifyContent="space-between">
                        <HStack>
                            <Heading size="md" color="#C8102E">
                                Calendar
                            </Heading>
                        </HStack>
                    </HStack>
                </VStack>
            </HStack> */}
            <View style={{ flex: 1 }}>
                <Agenda
                    items={items}
                    loadItemsForMonth={loadItems}
                    selected={"2023-04-27"}
                    renderItem={renderItem}
                />
            </View>
        </App>
    );
};

export default Calendar;
