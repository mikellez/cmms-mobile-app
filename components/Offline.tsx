import React, { useEffect, useState } from 'react';
import { Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToConnectionChanges } from '../helper/NetInfo';
import { setOfflineMode } from '../redux/features/offlineSlice';

function Offline() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const subscribe = subscribeToConnectionChanges(setIsConnected);

    dispatch(setOfflineMode(!isConnected));

  }, [isConnected]);

  return (
    <></>
  );
}

export default Offline;