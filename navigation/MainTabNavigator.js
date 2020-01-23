// import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';

import StartStack from './StartStack';
import DriversStack from './DriversStack';
import VehiclesStack from './VehiclesStack';
import ProfileStack from './ProfileStack';
import ManagementStack from './ManagementStack';

const tabNavigator = createBottomTabNavigator({
  StartStack,
  DriversStack,
  VehiclesStack,
  ProfileStack,
  ManagementStack,
}, {
  initialRouteName: 'StartStack',
  defaultNavigationOptions: {
    tabBarOptions: {
      activeTintColor: "#ec6a2c",
      labelStyle: {
        fontFamily: 'aller-bd',
      },
    }
  }
});

export default tabNavigator;
