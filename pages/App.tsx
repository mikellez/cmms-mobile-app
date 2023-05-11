import { Flex, NativeBaseProvider } from "native-base";
import Header from "./Header";
import Footer from "./Footer";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const App = ({ children, navigation, layout }) => {
  const insets = useSafeAreaInsets();

  return (
    <NativeBaseProvider>
        <Flex flex={1} justifyContent="space-between" backgroundColor={"white"} paddingTop={insets.top}>
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