import React from 'react';
import { ExpoConfigView } from '@expo/samples';

export default function SettingsScreen() {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return <ExpoConfigView />;
}

SettingsScreen.navigationOptions = {
  title: 'Perfil',
  headerStyle: {
    elevation: 4,
    backgroundColor: '#ec6a2c',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontFamily: 'aller-bd',
    fontWeight: '200',
    textAlign: "center",
    flex: 1,
  },
};
