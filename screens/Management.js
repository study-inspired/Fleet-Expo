/**
 * @format
 * @flow
**/

import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback,
    StatusBar
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';

export default class Management extends React.Component {
    static navigationOptions = {
        title: 'Gestión',
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
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#ff8834" barStyle="light-content" />
                <View elevation={2} style={{ height: 70 }}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                        onPress={() => alert('Ayuda')}
                    >
                        <View style={{flexDirection: 'column', alignItems: 'center', position: 'absolute', top: 12, right: 15}}>
                            <Ionicons
                                name={'ios-help-circle'}
                                size={24}
                                color='#ff8834'
                            />
                            <Text style={{ fontFamily: 'aller-bd', fontSize: 12, color: '#ff8834' }}>Ayuda</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{ marginBottom: 15 }}>
                    <Card>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
                            onPress={() => { this.props.navigation.navigate('GPRSFunctions') }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                }}>
                                <Icon type='material-community' name="map-marker-circle" size={50} />
                            </View>
                            <View
                                style={{
                                    flex: 4,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Text style={styles.textoBold}>Funciones GPRS</Text>
                            </View>
                        </TouchableOpacity>
                    </Card>
                    <Card>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
                            onPress={ () => this.props.navigation.navigate('SelectVehicle',{ title:'Mantenimiento de vehículos', nextScreen: 'VehicleMaintenance', text: 'Selecciona el vehiculo a consultar' }) }
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                }}>
                                <Icon type='material-community' name="progress-wrench" size={50} />
                            </View>
                            <View
                                style={{
                                    flex: 4,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Text style={styles.textoBold}>Mantenimiento de vehículos</Text>
                            </View>
                        </TouchableOpacity>
                    </Card>
                    <Card>
                        <TouchableOpacity
                            /*key={i}*/
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
                            onPress={() => { this.props.navigation.navigate('Reports') }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                }}>
                                <Icon type='font-awesome' name="bar-chart" size={38} iconStyle={{ marginHorizontal: 5 }} />
                            </View>
                            <View
                                style={{
                                    flex: 4,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Text style={styles.textoBold}>Reportes</Text>
                            </View>
                        </TouchableOpacity>
                    </Card>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 16, 
        marginBottom: 5,
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16, 
        marginBottom: 5,
    }
})