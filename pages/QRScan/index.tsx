import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ModuleScreen } from "../../components/ModuleLayout";
import instance from "../../axios.config";

const QRScanIndex = ({ route, navigation }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    const plant = parseInt(data.split("/")[3]);
    const asset = parseInt(data.split("/")[4]);

    /*await instance.post(`/api/login`, {username: 'admin', password: '123Az!!!'})
    .catch((err) => {
      console.log(err)
    });*/
    if(plant && asset) {
      navigation.navigate("GuestCreateRequest", {plant, asset});
    } else {
      alert("Invalid QR Code");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

export default QRScanIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});