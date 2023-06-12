import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { linking } from "./linking";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './RootNavigation';
import CreateChecklistFormPage from './pages/Checklist/CreateChecklistFormPage';
import ChecklistTemplatesPage from './pages/Checklist/ChecklistTemplatesPage';
import ManageChecklistPage from './pages/Checklist/ManageChecklistPage';
import CompleteChecklistPage from './pages/Checklist/CompleteChecklistPage';
import ViewChecklistPage from './pages/Checklist/ViewChecklistPage';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Report from "./pages/Report";
import ViewRequest from "./pages/Request/View";
import CreateRequest from "./pages/Request/Create";
import GuestCreateRequest from "./pages/Request/GuestCreate";
import Calendar from "./pages/Calendar";
import AssignRequest from "./pages/Request/Assign";
import ManageRequest from "./pages/Request/Manage";
import OfflineRequest from "./pages/Request/Offline";
import CorrectiveRequest from "./pages/Request/Corrective";
import QRScan from "./pages/QRScan/index";
import Maintenance from "./pages/Maintenance";
import CompleteRequest from "./pages/Request/Complete";
import Assets from "./pages/Assets/index";
import Details from "./pages/Assets/Details";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {/*<View style={styles.container}>
        <Login/>
      </View>*/}
      <Provider store={store}>
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Report" component={Report} />
          <Stack.Screen name="ViewRequest" component={ViewRequest} />
          <Stack.Screen name="CreateRequest" component={CreateRequest} />
          <Stack.Screen name="CorrectiveRequest" component={CorrectiveRequest} />
          <Stack.Screen name="Calendar" component={Calendar} />
          
          <Stack.Screen name="AssignRequest" component={AssignRequest} />
          <Stack.Screen name="CompleteRequest" component={CompleteRequest} />
          <Stack.Screen name="ManageRequest" component={ManageRequest} />
          <Stack.Screen name="QRScan" component={QRScan} />
          <Stack.Screen name="GuestCreateRequest" component={GuestCreateRequest} />
          <Stack.Screen name="OfflineRequest" component={OfflineRequest} />
          <Stack.Screen name="Maintenance" component={Maintenance} />
          <Stack.Screen name="CreateChecklistFormPage" component={CreateChecklistFormPage} />
          <Stack.Screen name="ChecklistTemplatesPage" component={ChecklistTemplatesPage} />
          <Stack.Screen name="ManageChecklistPage" component={ManageChecklistPage} />
          <Stack.Screen name="CompleteChecklistPage" component={CompleteChecklistPage} />
          <Stack.Screen name="ViewChecklistPage" component={ViewChecklistPage} />
          <Stack.Screen name="ViewAsset" component={Assets} />
          <Stack.Screen name="AssetDetails" component={Details} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
