/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements'

const geocercas = [
    {
        nombre: 'Zona norte',
        vehiculo: true,
    },
    {
        nombre: 'Centro ciudad',
        vehiculo: false,
    },
    {
        nombre: 'Sur',
        vehiculo: false,
    },
    {
        nombre: 'Zona costera',
        vehiculo: false,
    },
]

export default class RegisteredGeofences extends React.Component {

    static navigationOptions = {
        title: 'Geocercas registradas',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    render() {

        return (

            <View style={{ flex: 1 }}>
                <View style={{ height: 70, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16 }}>
                    <Button
                        type='clear'
                        icon={{
                            name: "help",
                            size: 32,
                            color: '#ff8834'
                        }}
                        containerStyle={{ flex: 1 }}
                        buttonStyle={{
                            position: 'absolute',
                            flexDirection: 'column',
                            right: 0
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            flex: 1,
                            fontFamily: 'aller-lt',
                            fontSize: 12,
                            bottom: 0
                        }}
                        title="Ayuda"
                    />
                </View>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={{ marginBottom: 15 }}>
                        {
                            geocercas.map((g, i) => {
                                return (
                                    <Card key={i} wrapperStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View
                                            style={{
                                                flex: 2,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}>
                                            <Icon type='material-community' name="map" size={42} iconStyle={{ flex: 1, marginHorizontal: 5 }} />
                                            <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, }}>{g.nombre}</Text>
                                        </View>
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                                onPress={ () => this.props.navigation.navigate('AssignVehicle') }
                                            >
                                                <Icon type='font-awesome' name='plus' size={18} iconStyle={{ position: 'absolute', right: -24, top: -5 }} />
                                                <Icon type='font-awesome' name='car' size={24} iconStyle={{ marginHorizontal: 5 }} />
                                                {
                                                    g.vehiculo &&
                                                    <Icon type='font-awesome' name='check-circle' size={14} color='#20d447' iconStyle={{ position: 'absolute', right: -32, top: -15 }} />
                                                }
                                                {
                                                    !g.vehiculo && 
                                                    <Text style={{ fontFamily: 'aller-bd', fontSize: 10, marginBottom: 1, marginTop:9 }}>Asignar vehículo</Text>
                                                }
                                                
                                            </TouchableOpacity>
                                    </Card>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fafafa',
    },
    body: {
        backgroundColor: '#fff',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 76,
    }
});