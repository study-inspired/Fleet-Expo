import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';

import Vehicles from '../screens/Vehicles';
import AddVehicle from '../screens/Vehicles/AddVehicle';
import AddPolicy from '../screens/Vehicles/AddPolicy';
import AddBill from '../screens/Vehicles/AddBill';
import AddHologram from '../screens/Vehicles/AddHologram';
import AddCard from '../screens/Vehicles/AddCard';
import AddTAG from '../screens/Vehicles/AddTAG';
import AddPhoto from '../screens/Vehicles/AddPhoto';
import DataSent from '../screens/Vehicles/DataSent';
import AttachedPicture from '../screens/Vehicles/AttachedPicture';

import Colors from "../constants/Colors";
import { FontAwesome } from '@expo/vector-icons';

const config = Platform.select({
    web: { headerMode: 'screen' },
    default: {},
});

const VehiclesStack = createStackNavigator(
    {
        Vehicles: Vehicles,
        AddVehicle: AddVehicle,
        AddPolicy: AddPolicy,
        AddBill: AddBill,
        AddHologram: AddHologram,
        AddCard: AddCard,
        AddTAG: AddTAG,
        AddPhoto: AddPhoto,
        DataSent: DataSent,
        AttachedPicture: AttachedPicture
    },
    config
);

VehiclesStack.navigationOptions = {
    tabBarLabel: 'Vehículos',
    tabBarIcon: ({ focused }) => (
        <FontAwesome
            focused={focused}
            name='car'
            size={22}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.primaryDark : Colors.primaryLight}
        />
    ),
};

export default VehiclesStack;