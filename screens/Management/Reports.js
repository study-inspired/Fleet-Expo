/**
 * @format
 * @flow
**/

import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements'

export default class Reports extends React.Component {
    static navigationOptions = {
        title: 'Reportes',
        headerTitleStyle: {
            fontFamily: 'aller-bd',
            fontWeight: '200',
            textAlign: "center",
            flex: 1
        },
        headerRight: <Button
            type='clear'
            icon={{
                name: "help",
                size: 32,
                color: '#ff8834'
            }}
        />,
    }
    render() {
        return (
            <View style={{ marginBottom: 15 }}>
                <Card>
                    <TouchableOpacity
                        /*key={i}*/
                        style={styles.touchableOpacity}
                        onPress={() => this.props.navigation.navigate('RealTimeReports')}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                            <Icon type='material-community' name="calendar-clock" size={50} />
                        </View>
                        <View
                            style={styles.textoTouchable}>
                            <Text style={styles.textoBold}>Reporte en tiempo real</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity
                        /*key={i}*/
                        style={styles.touchableOpacity}
                        onPress={() => this.props.navigation.navigate('ReportByDriver')}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                            <Icon type='material-community' name="calendar-clock" size={50} />
                        </View>
                        <View
                            style={styles.textoTouchable}>
                            <Text style={styles.textoBold}>Reporte por conductor</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity
                        /*key={i}*/
                        style={styles.touchableOpacity}
                        onPress={() => this.props.navigation.navigate('SelectVehicle', { title: 'Reportes vehículos', nextScreen: 'ReportVehicle', text: 'Selecciona un vehículo a consultar' })}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                            <Icon type='material-community' name="calendar-clock" size={50} />
                        </View>
                        <View
                            style={styles.textoTouchable}>
                            <Text style={styles.textoBold}>Repote GPRS</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16,
        marginBottom: 5
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 16,
    },
    touchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }, 
    textoTouchable: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})