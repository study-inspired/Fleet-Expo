import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, Alert, YellowBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { FontAwesome } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

import io from 'socket.io-client';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import Globals from './constants/Globals';

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const socket = io.connect(`${Globals.server}:3001/`);

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
      alert('No se pudo obtener el permiso para mostrar notificaciónes!');
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('token:', token);
  } else {
    alert('Debes usar un dispositivo real para usar las notificaciones.');
  }
};

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
    // enviarNotificacionLocalAprobar('Listo', 'Se inicio la aplicación');
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#ff8834" barStyle="dark-content-content" />
        <AppNavigator screenProps={{ socket: socket, enviarNotificacionLocal: enviarNotificacionLocal }}/>
      </View>
    );
  }
}

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

const enviarNotificacionLocalAprobar = async (title, body) => {
  await Notifications.presentLocalNotificationAsync({
    title: title,
    body: body,
    data: {
      id_propietario: 2,
      id_chofer: 3,
      respuesta: true
    },
    android: {
      sound: true,
    },
    ios: {
      sound: true,
    },
    categoryId: 'aprove',
  });
  // console.log(notificacion); // can be saved in AsyncStorage or send to server
};

Notifications.addListener( notification => {
  // console.log(notification);
  const { actionId } = notification;
  if (actionId != null) {
    if (actionId == 'aprove') {
      console.log('Notificación aprobada.')
    }
  }
});

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
