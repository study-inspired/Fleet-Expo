/**
 * @format
 * @flow
**/

import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements'

export default class GPRSFunctions extends React.Component {
    static navigationOptions = {
        title: 'Funciones GPRS',
        headerTitleStyle: {
            fontFamily: 'aller-bd',
            fontWeight: '200',
            textAlign: "center",
            flex: 1,
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
            <View style={{ marginBottom:15 }}>
                <Card>
                    <TouchableOpacity
                        /*key={i}*/
                        style={styles.touchableOpacity}
                        onPress={() => { this.props.navigation.navigate('Geofences') }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                            <Icon type='material-community' name="map-marker-radius" size={50} />
                        </View>
                        <View
                            style={styles.textoTouchable}>
                            <Text style={styles.textoBold}>Geocercas</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity
                        /*key={i}*/
                        style={styles.touchableOpacity}
                        onPress={ () => this.props.navigation.navigate('LocateVehicle') }
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                            <Icon type='ionicon' name='ios-send' size={50} />
                        </View>
                        <View
                            style={styles.textoTouchable}>
                            <Text style={styles.textoBold}>Localizar vehículo</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
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