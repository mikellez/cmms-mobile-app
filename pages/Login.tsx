import React, { useEffect, useState } from 'react';
import {
    SafeAreaView, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Text, Box, Center, FormControl, Input, NativeBaseProvider, Stack, WarningOutlineIcon, Image, Button, VStack, Heading, Link, HStack, Pressable, Icon, Alert, IconButton, CloseIcon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';

import { _storeData, _retrieveData } from '../helper/AsyncStorage';
import instance from '../axios.config';
import { API_URL } from '@env';

const Login = ({ navigation }) => {
  const [errorSubmitting, setErrorSubmitting] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('Username');
  const [password, setPassword] = useState<string>('Password');

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [requestTypes, setRequestTypes] = useState([]);
  const [faultTypes, setFaultTypes] = useState([]);
  const [plants, setPlants] = useState([]);
  const [assets, setAssets] = useState([]);

  const fetchFaultTypes = async () => {
    if(isConnected) {

      await instance.get(`/api/fault/types`)
        .then(async (res)=> {
          _storeData('faultTypes', res.data);
          setFaultTypes(res.data);
        })
        .catch((err) => {
            console.log(err)
          console.log('Unable to fetch fault types')
        });

    } else {
      const value = await _retrieveData('faultTypes');
      if(value) setFaultTypes(JSON.parse(value));

    }
  };

  const fetchRequestTypes = async () => {
    if(isConnected) {
      await instance.get(`/api/request/types`)
      .then((res)=> {
        _storeData('requestTypes', res.data);
        setRequestTypes(res.data);
      })
      .catch((err) => {
        console.log(err)
          console.log('Unable to fetch request types')
      });

    } else {
      const value = await _retrieveData('requestTypes');
      if(value) setRequestTypes(JSON.parse(value));
    }
  }

  const fetchPlants = async () => {
    if(isConnected) {
      await instance.get(`/api/plants`)
      .then((res)=> {
        _storeData('plants', res.data);
        setPlants(res.data);
      })
      .catch((err) => {
          console.log(err)
          console.log('Unable to fetch plants')
      });
    } else {
      const value = await _retrieveData('plants');
      if(value) setPlants(JSON.parse(value));
    }
  }

  const fetchAssets = async () => {
    if(isConnected) {
      await instance.get(`/api/assets`)
      .then((res)=> {
        _storeData('assetTags', res.data);
        setAssets(res.data);
      })
      .catch((err) => {
          console.log(err)
          console.log('Unable to fetch assets')
      });

    } else {
      const value = await _retrieveData('assetTags');
      if(value) setAssets(JSON.parse(value));
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      const netInfoState = await NetInfo.fetch();
      setIsConnected(netInfoState.isConnected);
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    const fetchData = async () => {
      try {
        await checkConnection();
        // Do something else that depends on the network status
        fetchFaultTypes();
        fetchRequestTypes();
        fetchPlants();
        fetchAssets();

        const result = await _retrieveData('assetTags');

      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };

    fetchData();

    return () => {
      unsubscribe();
    };

  }, [isConnected])

  const setData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err)
    }
  };

  const handleLogin = async () => {
    await instance.post(`/api/login`, {username, password})
    .then(async (res)=> {
      await instance.get(`/api/user`)
      .then(async (res)=>{
        setIsError(false);
        await setData('@user', JSON.stringify(res.data));
        navigation.navigate('Home');
      })
    })
    .catch((error) => {
			console.log("Error login", error);
			let reason:string = ""
      if(error?.response?.status) {

        if(error.response.status === 429)
          reason = "Too many Login attempts. Try again later."
        if(error.response.status === 401)
          reason = "Username and password combination does not match."
        
        setIsError(true);
        setErrorSubmitting(reason);

      }
		});


  };

  const handleLogout = async () => {
    await instance.post(`/api/logout`)
    .then((res)=> {
      alert('logout');
    })

  };

  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading height={100} fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
            <Image height={100} size={'2xl'} style={{ resizeMode: 'contain' }} alt="fallback text" source={ require('../assets/keppellogo.png')} />
          </Heading>

          <VStack space={3} mt="20">
            <FormControl>
              <FormControl.Label>Username</FormControl.Label>
              <Input onChangeText={setUsername} _focus={{
                bg: 'white',
                borderColor: 'white'

              }}/>
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" onChangeText={setPassword} _focus={{
                bg: 'white',
                borderColor: 'white'
              }}/>
            </FormControl>
            <Button mt="2" backgroundColor="#C8102E" onPress={handleLogin}>
              Log in
            </Button>
            {/*<Button mt="2" bg="danger.700" onPress={handleLoginTest}>
              Test log in
            </Button>
            <Button mt="2" bg="danger.700" onPress={handleUser}>
              Test get user
            </Button>
            <Button mt="2" bg="danger.700" onPress={handleLogout}>
              Test logout
            </Button>*/}
          {isError && <Center >
            <Alert maxW="400" status="danger" colorScheme="danger">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                  <HStack flexShrink={1} space={2} alignItems="center">
                    <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                      {errorSubmitting}
                    </Text>
                  </HStack>
                  <IconButton variant="unstyled" _focus={{ borderWidth: 0 }} icon={<CloseIcon size="3" />} _icon={{ color: "coolGray.600" }} />
                </HStack>
              </VStack>
            </Alert>
          </Center>
        }
          <Pressable py="20" flex={1} onPress={()=>navigation.navigate("QRScan")}>
            <Center>
              <Icon mb="1" as={<MaterialCommunityIcons name="qrcode-scan" />} color="#C8102E" size="2xl" />
            </Center>
            <Center>
              <Text>QR Scan</Text>
            </Center>
          </Pressable>
          </VStack>
        </Box>
      </Center>

    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Login;