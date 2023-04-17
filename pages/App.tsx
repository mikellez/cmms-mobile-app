import { Flex, NativeBaseProvider } from "native-base";
import Header from "./Header";
import Footer from "./Footer";

const App = ({ children, navigation }) => {
  return (
    <NativeBaseProvider>
      <Flex flex={1} justifyContent="space-between" backgroundColor={"white"}>
        <Header/>
          {children}
        <Footer navigation={navigation}/>
      </Flex> 
    </NativeBaseProvider>
  );
}

export default App;