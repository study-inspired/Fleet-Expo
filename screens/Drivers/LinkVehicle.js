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
    ActivityIndicator,
    TouchableNativeFeedback
} from 'react-native';

import { Card } from 'react-native-elements'
import NetInfo from '@react-native-community/netinfo'
import { Ionicons } from '@expo/vector-icons';
import Globals from '../../constants/Globals';

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
                const result = await fetch(`${Globals.server}:3006/webservice/obtener_unidades_propietario1`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_id_propietario: 2
                    }),
                })

                const data = await result.json();
                // console.log(data);

                if (data.datos.length != 0) {
                    let vehicles = data.datos.map((v) => {
                        return {
                            id: v.id_unidad,
                            nombre: `${v.marca} ${v.modelo}`,
                            placas: v.placas,
                            color: v.color.includes('#') ? v.color : '#a8a8a8',
                            imagen: v.foto.replace('/var/www/html', Globals.server)
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
                const result = await fetch(`${Globals.server}:3006/webservice/interfaz57/vincular_vehiculo`, {
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
                });

                const { datos, msg } = await result.json();

                if (msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    console.error(msg);
                } else if (datos) {
                    Alert.alert('Operación exitosa!', 'Se vinculó el vehículo correctamente.');
                    this.props.navigation.state.params.onBack();
                }
                    this.props.navigation.goBack();
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
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                        onPress={() => alert('Ayuda')}
                    >
                        <View style={{ flexDirection: 'column', alignItems: 'center', position: 'absolute', top: 12, right: 15 }}>
                            <Ionicons
                                name={'ios-help-circle'}
                                size={24}
                                color='#ff8834'
                            />
                            <Text style={{ fontFamily: 'aller-bd', fontSize: 12, color: '#ff8834' }}>Ayuda</Text>
                        </View>
                    </TouchableNativeFeedback>
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

