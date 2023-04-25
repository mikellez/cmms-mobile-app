import React, { useEffect, useState } from 'react';
import {
    SafeAreaView, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import axios from 'axios';
import { Text, Box, Center, FormControl, Input, NativeBaseProvider, Stack, WarningOutlineIcon, Image, Button, VStack, Heading, Link, HStack } from 'native-base';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState<string>('Username');
  const [password, setPassword] = useState<string>('Password');

  useEffect(() => {

  });

  const handleLogin = async () => {
    await axios.post(`${process.env.API_URL}/api/login`, {username, password})
    .then((res)=> {
        navigation.navigate('Home');
    })
    .catch((err) => {
        console.log(err)
    });
  };

  const handleLoginTest = async () => {
    await axios.post(`${process.env.API_URL}/api/login`, {username, password})
    .then((res)=> {
        alert(res.data);
        console.log(res.data);
    })
    .catch((err) => {
        console.log(err)
    });
  };

  const handleUser = async () => {
    await axios.get(`${process.env.API_URL}/api/user`)
    .then((res)=> {
        alert(JSON.stringify(res.data));
        console.log(res.data);
    })
    .catch((err) => {
        console.log(err)
        alert(err.response.data);
    });
  };

  const handleLogout = async () => {
    await axios.post(`${process.env.API_URL}/api/logout`)
    .then((res)=> {
        alert(res.data);
        console.log(res.data);
    })
    .catch((err) => {
        console.log(err)
    });
  };
  
  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading height={100} fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
            <Image height={100} size={'2xl'} style={{ resizeMode: 'contain' }} alt="fallback text" source={ require('../assets/keppellogo.png')} />
          </Heading>

          <VStack space={3} mt="5">
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