import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';

import Drivers from '../screens/Drivers'
import AddDriver from '../screens/Drivers/AddDriver'
import LinkVehicle from '../screens/Drivers/LinkVehicle'
import InfoDriver from '../screens/Drivers/InfoDriver';

import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const config = Platform.select({
    web: { headerMode: 'screen' },
    default: {},
});

const DriversStack = createStackNavigator(
    {
        Drivers: Drivers,
        LinkVehicle: LinkVehicle,
        AddDriver: AddDriver,
        InfoDriver: InfoDriver
    },
    config
);

DriversStack.navigationOptions = {
    tabBarLabel: 'Conductores',
    tabBarIcon: ({ focused }) => (
        <MaterialCommunityIcons
            focused={focused}
            name='steering'
            size={26}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.primaryDark : Colors.primaryLight}
        />
    ),
};

export default DriversStack;