import { Flex, NativeBaseProvider, Text } from "native-base";
import Header from "./Header";
import Footer from "./Footer";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { subscribeToConnectionChanges } from "../helper/NetInfo";
import OfflineHandling from "../components/OfflineHandling";
import { setOfflineMode } from "../redux/features/offlineSlice";
import { useDispatch } from "react-redux";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const App = ({ children, navigation, layout }) => {
  const insets = useSafeAreaInsets();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderWithoutHeaderAndFooter = () => (
    children 
  )

  const renderWithHeaderAndFooter = () => (
    <>
      <Header navigation={navigation}/> 
      { children } 
      <Footer navigation={navigation}/>
    </>
  );

  const renderWithHeaderFooterAwareScrollView = () => (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Header navigation={navigation}/> 
          { children }
        <Footer navigation={navigation}/>
      </KeyboardAwareScrollView>
    </>
  );

  console.log(layout)

  return (
    <NativeBaseProvider>
       <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled
        >
          <Flex 
            flex={1} 
            justifyContent="space-between" 
            backgroundColor={"white"} 
            //paddingTop={insets.top}
            >
            <OfflineHandling navigation={navigation}/>
            {
              (layout && layout === 'empty') ? ( 
                renderWithoutHeaderAndFooter() 
              )
              : layout && layout === 'form' ? (
                renderWithHeaderFooterAwareScrollView()
              )
              : renderWithHeaderAndFooter() 
            }
          </Flex> 
        </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}

export default App;