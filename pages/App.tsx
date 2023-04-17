import { Flex, NativeBaseProvider } from "native-base";

const App = ({ children }) => {
  return (
    <NativeBaseProvider>
      <Flex flex={1} justifyContent="space-between" backgroundColor={"white"}>
        {children}
      </Flex> 
    </NativeBaseProvider>
  );
}

export default App;