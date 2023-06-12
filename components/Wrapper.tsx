import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOfflineMode } from "../redux/features/offlineSlice";
import { subscribeToConnectionChanges } from "../helper/NetInfo";
import { Text } from "react-native";
import { Center, Icon, VStack } from "native-base";
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootState } from "../redux/store";


/*const dispatch = useDispatch();

useEffect(() => {
  const subscribe = subscribeToConnectionChanges(setIsConnected);

  dispatch(setOfflineMode(!isConnected));

}, [isConnected]);*/

const Wrapper = ({ children, layout }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const isOffline = useSelector<RootState, boolean>((state) => state.offline);
  const route = useRoute();
  const offlineLayout = ['Home', 'Asset', 'Calendar'].includes(route.name);

  return (
    <>
      { isOffline && offlineLayout
      ?
        <Center flex={1}>
          <Icon as={MaterialCommunityIcons} name="wifi-off" size="lg" />
          <Text style={{ marginTop: 10 }}> You are currently offline... </Text>
        </Center>
      : children
     }
    </>
  );
};

export default Wrapper;