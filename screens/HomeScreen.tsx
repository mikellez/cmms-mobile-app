import axios from 'axios';
import { Text, Box, HStack, IconButton, StatusBar, NativeBaseProvider, Icon, Image, Pressable, Center, VStack, Flex, Container } from 'native-base';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IUser {
  id: number;
  allocated_plants: [];
  name: string;
  role_id: number;
  role_name: string;
}

const HomeScreen = ({navigation}) => {

const [user, setUser] = useState<IUser>();

const fetchUserDetail = async () => {
  await axios.get("http://10.0.2.2:3002/api/user")
  .then((res)=> {
    setUser(res.data);
  })
  .catch((err) => {
      console.log(err)
      alert(err.response.data);
  });
};

useEffect(() => {
  fetchUserDetail();
}, [user]);

  return (
    <NativeBaseProvider>
      <Flex flex={1} justifyContent="space-between" backgroundColor={"white"}>
        <HStack bg="#D9D9D9" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="350" borderBottomColor={'#C8102E'} borderBottomWidth={2}>
          <HStack alignItems="center">
            <IconButton icon={<Icon size="lg" as={MaterialIcons} name="menu" color="#C8102E" />} />
          </HStack>
          <HStack alignItems="center">
            <Image size={'2xl'} style={{ resizeMode: 'contain', width: 150, height: 20 }} alt="fallback text" source={ require('../assets/keppellogo.png')} />
          </HStack>
          <HStack alignItems="center">
            <IconButton icon={<Icon size="lg" as={FontAwesome} name="user-circle-o" color="#C8102E" />} />
          </HStack>
        </HStack>

        <Center>
          <HStack flex={1}>
            <Pressable onPress={()=>navigation.navigate("Report")}>
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
            </Pressable>
          </HStack>
        </Center>

        <HStack bg="#D9D9D9" alignItems="center" safeAreaBottom shadow={6} >
          <Pressable py="3" flex={1} >
            <Center>
              <Icon mb="1" as={<MaterialCommunityIcons name="clipboard-clock-outline" />} color="#C8102E" size="lg" />
            </Center>
          </Pressable>
        </HStack>

      </Flex>
    </NativeBaseProvider>
  );
};

export default HomeScreen;