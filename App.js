import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import Insta360 from './Insta360';

const App = () => {
  const [accelerometerData, setAccelerometerData] = useState([]);

  useEffect(() => {
    Insta360.initSDK()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const connectCamera = () => {
    Insta360.connectCamera()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getAccelerometerData = () => {
    Insta360.getAccelerometerData()
      .then((data) => {
        setAccelerometerData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View>
      <Button title="Connect to Insta360" onPress={connectCamera} />
      <Button title="Get Accelerometer Data" onPress={getAccelerometerData} />
      <Text>Accelerometer Data: {accelerometerData.join(', ')}</Text>
    </View>
  );
};

export default App;