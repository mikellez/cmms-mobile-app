import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Login from './pages/Login';
import Home from './pages/Home';
import Report from './pages/Report';
import ViewRequest from './pages/Request/View';
import CreateRequest from './pages/Request/Create';
import GuestCreateRequest from './pages/Request/GuestCreate';
import Maintenance from './pages/Maintenance';
import CreateChecklistFormPage from './pages/Checklist/CreateChecklistFormPage';
import ChecklistTemplatesPage from './pages/Checklist/ChecklistTemplatesPage';
import AssignRequest from './pages/Request/Assign';
import CompleteRequest from './pages/Request/Complete';
import ManageRequest from './pages/Request/Manage';
import OfflineRequest from './pages/Request/Offline';
import QRScan from './pages/QRScan/index';
import TestChecklistComponent from './pages/Checklist/TestChecklistComponent';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './RootNavigation';
import { linking } from './linking';
import ManageChecklistPage from './pages/Checklist/ManageChecklistPage';
import CompleteChecklistPage from './pages/Checklist/CompleteChecklistPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
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
        <Stack.Screen name="CreateChecklistFormPage" component={CreateChecklistFormPage} />
        <Stack.Screen name="ChecklistTemplatesPage" component={ChecklistTemplatesPage} />
        <Stack.Screen name="AssignRequest" component={AssignRequest} />
        <Stack.Screen name="CompleteRequest" component={CompleteRequest} />
        <Stack.Screen name="ManageRequest" component={ManageRequest} />
        <Stack.Screen name="QRScan" component={QRScan} />
        <Stack.Screen name="GuestCreateRequest" component={GuestCreateRequest} />
        <Stack.Screen name="OfflineRequest" component={OfflineRequest} />
        {/* <Stack.Screen name="ApprovedChecklist" component={ApprovedChecklist} /> */}
        <Stack.Screen name="TestChecklistComponent" component={TestChecklistComponent} />
        <Stack.Screen name="ManageChecklistPage" component={ManageChecklistPage} />
        <Stack.Screen name="CompleteChecklistPage" component={CompleteChecklistPage} />
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
