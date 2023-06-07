import NetInfo from '@react-native-community/netinfo';

const checkConnection = async (setIsConnected) => {
  const netInfoState = await NetInfo.fetch();
  setIsConnected(netInfoState.isConnected);
};

const subscribeToConnectionChanges = (setIsConnected) => {
  const subscribe = NetInfo.addEventListener((state) => {
    setIsConnected(state.isConnected);
  });

  return subscribe;
};

export {
  checkConnection,
  subscribeToConnectionChanges
}