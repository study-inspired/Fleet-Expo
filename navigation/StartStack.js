import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import StartScreen from '../screens/HomeScreen';

import Colors from "../constants/Colors";
import { FontAwesome } from '@expo/vector-icons';

const config = Platform.select({
    web: { headerMode: 'screen' },
    default: {},
});

const StartStack = createStackNavigator(
    {
        Start: StartScreen,
    },
    config
);

StartStack.navigationOptions = {
    tabBarLabel: 'Inicio',
    tabBarIcon: ({ focused }) => (
        <FontAwesome
            focused={focused}
            name='home'
            size={26}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.primaryDark : Colors.primaryLight}
        />
    ),
};

export default StartStack;