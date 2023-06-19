import { HStack, Icon, IconButton, Image, Button } from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { _clear } from "../helper/AsyncStorage";
//import DeviceInfo from 'react-native-device-info';
import { ModuleSimpleModal } from "../components/ModuleLayout";

import instance from "../axios.config";
import { navigationRef } from "../RootNavigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import { CMMSOffline } from "../types/interfaces";

const Header = ({ navigation }) => {
  //console.log(DeviceInfo.getDeviceId())
  //console.log(DeviceInfo.getDeviceId())
  const [modalVisible, setModalVisible] = useState(false);
  const isOffline = useSelector<CMMSOffline, boolean>((state) => state.offline);

  const onPress = async () => {
    await instance.post(`/api/logout`)
    .then((res)=> {
      _clear();
      //alert('logout');
      navigation.navigate('Login');
    })
  }

  const confirmLogout = async () => {
    await instance.post(`/api/logout`).then((res) => {
      _clear();
      //alert("logout");
      navigation.navigate("Login");
    });
  };

  return (
    <>
      <HStack
        bg="#D9D9D9"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        borderBottomColor={"#C8102E"}
        borderBottomWidth={2}
      >
        <HStack alignItems="center">
          {/*<IconButton
            icon={
              <Icon size="lg" as={MaterialIcons} name="menu" color="#C8102E" />
            }
          />*/}
        </HStack>
        <HStack alignItems="center">
          <Image
            size={"2xl"}
            style={{ resizeMode: "contain", width: 150, height: 20 }}
            alt=""
            source={require("../assets/keppellogo.png")}
          />
        </HStack>
        <HStack alignItems="center">
          <IconButton
            icon={
              <Icon
                size="lg"
                as={FontAwesome}
                name="user-circle-o"
                color={isOffline ? "gray.600" : "#C8102E"}
              />
            }
            onPress={() => setModalVisible(!modalVisible)}
            disabled={isOffline ? true : false}
          />
        </HStack>
      </HStack>
      <ModuleSimpleModal
        isOpen={modalVisible}
        setOpen={setModalVisible}
        title="Logout"
        text="Do you want to Logout now?"
        icon={"Exit"}
        hideCloseButton={true}
      >
        <HStack flexDirection="row" marginTop={8}>
          <Button backgroundColor="#C70F2B" onPress={confirmLogout}>
            Confirm
          </Button>
          <Button
            backgroundColor="#C70F2B"
            marginLeft={5}
            onPress={() => setModalVisible(false)}
          >
            Cancel
          </Button>
        </HStack>
      </ModuleSimpleModal>
    </>
  );
};

export default Header;
