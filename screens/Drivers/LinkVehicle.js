/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';

import { Button, Card } from 'react-native-elements'
import NetInfo from '@react-native-community/netinfo'

export default class LinkVehicle extends React.Component {
    static navigationOptions = {
        title: 'Vincular un vehículo',
        headerTitleStyle: {
            fontFamily: 'aller-bd',
            textAlign: "center",
            flex: 1
        },
        headerRight: <View></View>,
    }
    state = {
        isLoading: true,
        hasVehicles: false,
        vehicles: {},
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/interfaz60/obtener_unidades_propietario', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_correo: 'carlos@gmail.com',
                        p_pass: '123456',
                    }),
                })

                const data = await result.json();
                console.log(data);

                if (data.datos.length != 0) {
                    let vehicles = data.datos.map((v) => {
                        return {
                            id: v.id_unidad,
                            nombre: `${v.marca} ${v.modelo}`,
                            placas: v.placas,
                            color: v.color.includes('#') ? v.color : '#a8a8a8',
                            imagen: v.foto == 'link' ? 'https://allauthor.com/images/poster/large/1501476185342-the-nights-come-alive.jpg' : v.foto
                        }
                    })
                    this.setState({
                        hasVehicles: true,
                        vehicles: vehicles,
                        isLoading: false
                    });
                } else {
                    alert('Info', 'No hay vehiculos!');
                    this.props.navigation.goBack();
                }

            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async vincularVehiculo(unidad) {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/interfaz57/vincular_vehiculo', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_id_unidad: unidad,
                        p_id_propietario: this.props.navigation.getParam('id_propietario', 0),
                        p_id_chofer1: this.props.navigation.getParam('id_chofer', 0)
                    }),
                })

                const datos = await result.json();
                if (datos) {
                    if (datos.msg) {
                        Alert.alert('Hubo un error', datos.msg);
                    } else if (datos.datos) {
                        Alert.alert('Operación exitosa!', 'Se vinculó el vehículo correctamente.');
                    }
                    this.props.navigation.goBack();
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un error.')
                console.error(error);
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Button
                        type='clear'
                        icon={{
                            name: "help",
                            size: 32,
                            color: '#ff8834'
                        }}
                        buttonStyle={{
                            position: 'absolute',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            right: 0,
                            top: -45
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            ...styles.texto600,
                            flex: 1,
                            fontSize: 12,
                            bottom: 0
                        }}
                        title="Ayuda"
                    />
                </View>
                {
                    this.state.isLoading ?
                        <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} />
                        :
                        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                            <View style={{ marginBottom: 15 }}>
                                {!this.state.isLoading && this.state.hasVehicles &&
                                    this.state.vehicles.map((v) => {
                                        return (
                                            <Card key={v.id}>
                                                <TouchableOpacity
                                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                                    onPress={this.vincularVehiculo.bind(this, v.id)}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Image
                                                            style={{ width: 50, height: 50, alignSelf: 'flex-start' }}
                                                            resizeMode="cover"
                                                            source={{ uri: v.imagen }}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 4,
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.texto700, { marginTop: 6 }]}>{v.nombre}</Text>
                                                            <View style={{ width: 16, height: 16, marginTop: 6, marginLeft: 5, backgroundColor: v.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                        </View>
                                                        <Text style={[styles.texto600, { fontSize: 12 }]}>{v.placas}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </Card>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                }
            </SafeAreaView>
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
    },
    texto700: {
        fontFamily: 'aller-bd'
    },
    texto600: {
        fontFamily: 'aller-lt'
    }
});

