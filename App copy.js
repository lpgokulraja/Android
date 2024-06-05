import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';
import WifiManager from "react-native-wifi-reborn";
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid } from 'react-native';

// const granted = await PermissionsAndroid.request(
//   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//   {
//     title: 'Location permission is required for WiFi connections',
//     message:
//       'This app needs location permission as this is required  ' +
//       'to scan for wifi networks.',
//     buttonNegative: 'DENY',
//     buttonPositive: 'ALLOW',
//   },
// );
// if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//  Alert.alert("Granded");
// } else {
//   Alert.alert(" Not Granded");
// }

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const manager = new BleManager();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [wifiStatus, setWifiStatus] = useState('Not connected');
  const [bluetoothStatus, setBluetoothStatus] = useState('Not connected');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => manager.destroy();
  }, []);

  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        Alert.alert('Bluetooth Error', error.message);
        return;
      }

      if (device.name === 'Insta360 X3') {
        manager.stopDeviceScan();
        device.connect()
          .then((device) => device.discoverAllServicesAndCharacteristics())
          .then((device) => {
            setBluetoothStatus('Connected');
            console.log('Connected to Insta360 X3 via Bluetooth');
          })
          .catch((error) => {
            console.log(error);
            Alert.alert('Connection Error', error.message);
          });
      }
    });
  };

  const connectToWiFi = async () => {
    try {
      const ssid = 'X3 3MDPUG.OSC';
      const password = '88888888';
      await WifiManager.connectToProtectedSSID(ssid, password, false, false, true, 5000);
      setWifiStatus('Connected');
      console.log('Connected to Insta360 X3 via WiFi');


      WifiManager.connectToProtectedWifiSSID(ssid, password, isWep).then(
        () => {
          console.log("Connected successfully!");
        },
        () => {
          console.log("Connection failed!");
        }
      );
      
      WifiManager.getCurrentWifiSSID().then(
        ssid => {
          console.log("Your current connected wifi SSID is " + ssid);
          setWifiStatus(`Connected to ${ssid}`);
        },
        () => {
          console.log("Cannot get current SSID!");
        }
      );

    } catch (error) {
      console.log(error);
      Alert.alert('WiFi Error', error.message);
    }
  };

 

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>
          <Text style={styles.title}>Insta360 X3 Connection</Text>
          <Button title="Connect to WiFi" onPress={connectToWiFi} />
          <Text style={styles.status}>WiFi Status: {wifiStatus}</Text>
          <Button title="Connect to Bluetooth" onPress={scanAndConnect} />
          <Text style={styles.status}>Bluetooth Status: {bluetoothStatus}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  status: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default App;