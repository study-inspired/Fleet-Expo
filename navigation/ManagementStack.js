import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';

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
import VehicleMaintenance from '../screens/Management/VehicleMaintenance';
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
import RegisterGeofence from '../screens/Management/RegisterGeofence';

import Colors from "../constants/Colors";
import { FontAwesome } from '@expo/vector-icons';

const config = Platform.select({
    web: { headerMode: 'screen' },
    default: {},
});

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
        GeofenceAlertsDetails: GeofenceAlertsDetails,
        GeofenceAlertsDetailsMap: GeofenceAlertsDetailsMap
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

export default ManagementStack;