import { Flex, NativeBaseProvider } from "native-base";
import Header from "./Header";
import Footer from "./Footer";

const App = ({ children, navigation, layout }) => {
  return (
    <NativeBaseProvider>
      <Flex flex={1} justifyContent="space-between" backgroundColor={"white"}>
        {!(layout && layout === 'empty')
        ? ( 
          <>
          <Header/> 
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