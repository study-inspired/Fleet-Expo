/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
    YellowBox,
    Alert
} from 'react-native';

import { Button, Icon } from 'react-native-elements'

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator } from 'react-native';

import io from 'socket.io-client/dist/socket.io';

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

export default class LocateVehicle extends React.Component {

    static navigationOptions = {
        title: 'Localizar vehículo',
        headerTitleStyle: {
            flex: 1,
            fontFamily: 'aller-bd',
            textAlign: "center",
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            vehiculo: 0,
            hasVehicles: false,
            vehicles: [],
            latitude: 0,
            longitude: 0,
            disponible: false
        }

        this.socket = io.connect('http://35.203.42.33:3001/');

        this.socket.on('connect', () => {
            console.log(this.socket.id);
        });

        this.socket.on('consultar_vehiculo', (res) => {
            // console.log(res);
            if (res.mensaje) {
                Alert.alert('Información', 'El vehículo seleccionado no está disponible.');
                this.setState({
                    disponible: false
                });
            } else {
                this.setState({
                    latitud: res.latitud,
                    longitud: res.longitud,
                    disponible: true,
                    isLoading: false
                });
            }
        });
    }

    async componentDidMount() {
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
            // console.log(data);

            if (data.datos.length != 0) {
                let vehicles = data.datos.map((v) => {
                    return {
                        id: v.id_unidad,
                        nombre: `${v.marca} ${v.modelo}`,
                        placas: v.placas,
                        color: v.color.includes('#') ? v.color : '#a8a8a8',
                        imagen: v.foto.replace('/var/www/html', 'http://35.203.42.33'),
                    }
                })
                this.setState({
                    hasVehicles: true,
                    vehicles: vehicles,
                    isLoading: false
                });
            } else {
                Alert.alert('Info', 'No hay vehiculos!');
                this.props.navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
            this.props.navigation.goBack();
        }
    }

    _localizarUnidad(id_unidad) {
        this.socket.emit('consultar_vehiculo', {
            socket_id: this.socket.id,
            id_unidad: id_unidad
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.subHeader}>
                    <Text style={[styles.textoBold, { marginVertical: 25, flex: 5 }]}>Seleccione el vehículo a consultar</Text>
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
                <Picker
                    style={{
                        height: 40,
                        marginVertical: 5,
                        marginLeft: 7
                    }}
                    selectedValue={this.state.vehiculo}
                    onValueChange={(vehiculo) => {
                        if (vehiculo != 0) {
                            this.setState({ vehiculo: vehiculo });
                            this._localizarUnidad(vehiculo);
                        }
                    }}
                >
                    <Picker.Item label="Vehículo..." value={0} />
                    {
                        this.state.vehicles.map(v => {
                            return (
                                <Picker.Item label={`${v.nombre} - ${v.placas}`} value={v.id} key={v.id} />
                            )
                        })
                    }
                </Picker>
                {
                    (this.state.isLoading || this.state.vehiculo == 0 || !this.state.disponible) ?
                        <ActivityIndicator size="large" color="#ff8834" animating={(this.state.isLoading || this.state.vehiculo == 0 || !this.state.disponible)} style={{ flex: 1 }} />
                        :
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            region={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            style={styles.mapView}
                        >
                            {
                                this.state.disponible &&
                                <MapView.Marker
                                    coordinate={{
                                        latitude: this.state.latitude,
                                        longitude: this.state.longitude
                                    }}
                                    onPress={() => this.props.navigation.navigate('InfoDriver', { id_usuario: conductor.id_conductor, id_propietario: this.props.navigation.getParam('id_propietario', 0) })}
                                >
                                    <Icon
                                        type='material-community'
                                        name='car-side'
                                        size={24}
                                        color='black'
                                    />
                                </MapView.Marker>
                            }
                        </MapView>
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#fff',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 76,
    },
    mapView: {
        flex: 1,
    },
    subHeader: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16
    },
});