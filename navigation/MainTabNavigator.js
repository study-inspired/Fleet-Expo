import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Colors from "../constants/Colors";
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Importing screens
 */

// Home
import StartScreen from '../screens/HomeScreen';

// Drivers
import Drivers from '../screens/Drivers';
import AddDriver from '../screens/Drivers/AddDriver'
import LinkVehicle from '../screens/Drivers/LinkVehicle'

// Vehicles
import Vehicles from '../screens/Vehicles'
import AddVehicle from '../screens/Vehicles/AddVehicle'
import AddPolicy from '../screens/Vehicles/AddPolicy'
import AddBill from '../screens/Vehicles/AddBill'
import AddHologram from '../screens/Vehicles/AddHologram'
import AddCard from '../screens/Vehicles/AddCard'
import AddTAG from '../screens/Vehicles/AddTAG'
import AddPhoto from '../screens/Vehicles/AddPhoto'
import DataSent from '../screens/Vehicles/DataSent'
import AttachedPicture from '../screens/Vehicles/AttachedPicture'

// Profile
import SettingsScreen from '../screens/SettingsScreen';

// Management
import Management from '../screens/Management';
import GPRSFunctions from '../screens/Management/GPRSFuncions';
import Reports from '../screens/Management/Reports';
import Geofences from '../screens/Management/Geofences';
import SelectVehicle from '../screens/Management/SelectVehicle';
import RealTimeReports from '../screens/Management/RealTimeReports';
import ReportByDriver from '../screens/Management/RepotByDriver';
import RealTimeReport from '../screens/Management/RealTimeReport';
import ReportDriver from '../screens/Management/ReportDriver';
import ReportVehicle from '../screens/Management/ReportVehicle';
import VehicleMaintenance  from '../screens/Management/VehicleMaintenance';
import LocateVehicle from '../screens/Management/LocateVehicle';
import GeofenceActions from '../screens/Management/GeofenceActions';
import GeofenceAlerts from '../screens/Management/GeofenceAlerts';
import GeofenceAlertsDetails from '../screens/Management/GeofenceAlertsDetails';
import GeofenceAlertsDetailsMap from '../screens/Management/GeofenceAlertsDetailsMap';
import RegisteredGeofences from '../screens/Management/RegisteredGeofences';
import GeofenceVehicles from '../screens/Management/GeofenceVehicles'
import AssignVehicle from '../screens/Management/AssignVehicle';
import Alerts from '../screens/Management/Alerts';
import ServiceConsultation from '../screens/Management/ServiceConsultation';
import RegisterMaintenanceM from '../screens/Management/RegisterMaintenanceM';
import RegisterMaintenanceN from '../screens/Management/RegisterMaintenanceN';
import ServicesConsultation from '../screens/Management/ServicesConsultation';
import TraceGeofence from '../screens/Management/TraceGeofence';
// import TracePoligon from '../screens/Management/TracePoligon';
import RegisterGeofence from '../screens/Management/RegisterGeofence';
import InfoDriver from '../screens/Drivers/InfoDriver';


const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


/**
 * Inicio
 */
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

StartStack.path = '';

/**
 * Conductores
 */

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

DriversStack.path = '';

/**
 * Vehículos
 */
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

/**
 * Perfil
 */
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

ProfileStack.path = '';

/**
 * Management
 */
const ManagementStack = createStackNavigator(
  {
    Management: Management,
    GPRSFunctions: GPRSFunctions,
    SelectVehicle: SelectVehicle,
    VehicleMaintenance: VehicleMaintenance,
    Reports: Reports,
    RealTimeReports: RealTimeReports,
    ReportByDriver: ReportByDriver,
    ReportDriver: ReportDriver,
    RealTimeReport: RealTimeReport,
    ReportVehicle: ReportVehicle,
    Geofences: Geofences,
    LocateVehicle: LocateVehicle,
    GeofenceActions: GeofenceActions,
    RegisteredGeofences: RegisteredGeofences,
    GeofenceVehicles: GeofenceVehicles,
    AssignVehicle: AssignVehicle,
    Alerts: Alerts,
    ServicesConsultation: ServicesConsultation,
    ServiceConsultation: ServiceConsultation,
    RegisterMaintenanceM: RegisterMaintenanceM,
    RegisterMaintenanceN: RegisterMaintenanceN,
    RegisterGeofence: RegisterGeofence,
    TraceGeofence: TraceGeofence,
    // TracePoligon: TracePoligon,
    GeofenceAlerts: GeofenceAlerts,
    GeofenceAlertsDetails:GeofenceAlertsDetails,
    GeofenceAlertsDetailsMap:GeofenceAlertsDetailsMap
  },
  config
);

ManagementStack.navigationOptions = {
  tabBarLabel: 'Gestión',
  tabBarIcon: ({ focused }) => (
    <FontAwesome
      focused={focused}
      name='cubes'
      size={22}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.primaryDark : Colors.primaryLight}
    />
  ),
};

ManagementStack.path = '';

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

tabNavigator.path = '';

export default tabNavigator;
