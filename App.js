import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Alert, YellowBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { FontAwesome } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

import io from 'socket.io-client';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const socket = io.connect('http://35.203.42.33:3001/');

socket.on('connect', () => {
  console.log('Conectado: ', socket.id);
});

Notifications.createCategoryAsync('aprove', [
  {
    actionId: 'aprove',
    buttonTitle: 'Aceptar',
  },
  {
    actionId: 'cancel',
    buttonTitle: 'Cancelar',
  },
]);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  NetInfo.addEventListener(state => {
    if (!state.isConnected) {
      Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.')
    }
  });

  registerForPushNotificationsAsync();
  
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    // enviarNotificacionLocal('Listo', 'Se inicio la aplicación');
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#ff8834" barStyle="dark-content-content" />
        <AppNavigator screenProps={{ socket: socket, enviarNotificacionLocal: enviarNotificacionLocal }}/>
      </View>
    );
  }
}

const registerForPushNotificationsAsync = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS
      );
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('No se pudo obtener el permmiso para las notificaciónes!');
      return;
    }
    // token = await Notifications.getExpoPushTokenAsync();
    // console.log('token:', token);
  } else {
    alert('Debes usar un dispositivo real para usar las notificaciones.');
  }
};

const enviarNotificacionLocal = async (title, body) => {
  // let notificationId = 
  await Notifications.presentLocalNotificationAsync({
    title: title,
    body: body,
    data: {
      id: '1',
    },
    android: {
      sound: true,
    },
    ios: {
      sound: true,
    },
    // categoryId: 'aprove',
  });
  // console.log(notificationId); // can be saved in AsyncStorage or send to server
};

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'), 
    ]),
    Font.loadAsync({
      ...FontAwesome.font,
      'aller-lt': require('./assets/fonts/Aller_Lt.ttf'),
      'aller-rg': require('./assets/fonts/Aller_Rg.ttf'),
      'aller-bd': require('./assets/fonts/Aller_Bd.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
