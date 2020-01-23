import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import SettingsScreen from '../screens/SettingsScreen';

import Colors from "../constants/Colors";
import { FontAwesome } from '@expo/vector-icons';

const config = Platform.select({
    web: { headerMode: 'screen' },
    default: {},
});

const ProfileStack = createStackNavigator(
    {
        Profile: SettingsScreen,
    },
    config
);

ProfileStack.navigationOptions = {
    tabBarLabel: 'Perfil',
    tabBarIcon: ({ focused }) => (
        <FontAwesome
            focused={focused}
            name='user-circle'
            size={21}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.primaryDark : Colors.primaryLight}
        />
    ),
};

export default ProfileStack;