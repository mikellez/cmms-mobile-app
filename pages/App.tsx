import { Flex, NativeBaseProvider, Text } from "native-base";
import Header from "./Header";
import Footer from "./Footer";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { subscribeToConnectionChanges } from "../helper/NetInfo";
import OfflineHandling from "../components/OfflineHandling";
import { setOfflineMode } from "../redux/features/offlineSlice";
import { useDispatch } from "react-redux";


const App = ({ children, navigation, layout }) => {
  const insets = useSafeAreaInsets();

  return (
    <NativeBaseProvider>
      <Flex flex={1} justifyContent="space-between" backgroundColor={"white"} paddingTop={insets.top}>
        <OfflineHandling navigation={navigation}/>
        {!(layout && layout === 'empty')
        ? ( 
          <>
            <Header navigation={navigation}/> 
            {children} 
            <Footer navigation={navigation}/>
          </>
        )
        : 
        ( children )
        }
      </Flex> 
    </NativeBaseProvider>
  );
}

export default App;