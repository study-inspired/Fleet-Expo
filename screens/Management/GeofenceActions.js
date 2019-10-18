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
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements'

const alertas = [
    {
        nombre: 'Zona norte',
        vehiculo: {
            nombre: 'Chevrolet Aveo(Gris)',
            placa: 'COL-6462J'
        },
        salidas: 3
    },
    {
        nombre: 'Zona norte',
        vehiculo: {
            nombre: 'NISSAN Versa(Blanco)', placa: 'COL-1684D'
        },
        salidas: 7
    },
    {
        nombre: 'Zona norte',
        vehiculo: {
            nombre: 'Chevrolet Beat(Azul)', placa: 'COL-4568R'
        },
        salidas: 1
    },
]

export default class GeofenceActions extends React.Component {

    static navigationOptions = {
        title: 'Acciones en geocerca',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    state = {
        nextScreen: this.props.navigation.getParam('nextScreen', '')
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
                            alertas.map((a, i) => {
                                return (
                                    <Card key={i} wrapperStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flex: 2, flexDirection: 'column', }}>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                <Icon type='material-community' name="map" size={38} iconStyle={{ flex: 1, marginHorizontal: 5 }} />
                                                <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, }}>{a.nombre}</Text>
                                            </View>
                                            <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, marginLeft:5 }}>Salidas: {a.salidas}</Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                            <Icon name='check-circle' size={14} color='#20d447' iconStyle={{ position: 'absolute', right: -24, top: 0 }} />
                                            <Icon type='font-awesome' name='car' size={18} iconStyle={{ marginHorizontal: 5 }} />
                                            <Text style={{ fontFamily: 'aller-bd', fontSize: 10, marginBottom: 1 }}>{a.vehiculo.nombre}</Text>
                                            <Text style={{ fontFamily: 'aller-lt', fontSize: 9, }}>{a.vehiculo.placa}</Text>
                                        </View>
                                    </Card>
                                );
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