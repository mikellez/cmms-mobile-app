import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Login from './pages/Login';
import Home from './pages/Home';
import Report from './pages/Report';
import ViewRequest from './pages/Request/View';
import CreateRequest from './pages/Request/Create';
import Maintenance from './pages/Maintenance';
import CreateChecklist from './pages/Checklist/Create';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
      {/*<View style={styles.container}>
        <Login/>
      </View>*/}
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Report" component={Report} />
        <Stack.Screen name="ViewRequest" component={ViewRequest} />
        <Stack.Screen name="CreateRequest" component={CreateRequest} />
        <Stack.Screen name="Maintenance" component={Maintenance} />
        <Stack.Screen name="CreateChecklist" component={CreateChecklist} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
