import { Center, Text } from "native-base";
import { ActivityIndicator } from "react-native";

const Loading = () => {
  return (
    <Center>
      <ActivityIndicator size="small" color="#C8102E" />
      <Text mt={3}>Loading... Please wait...</Text>
    </Center>
  );
}

export default Loading;