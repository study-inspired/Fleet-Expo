/**
 * @format
 * @flow
 */

import React from 'react';
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    TouchableNativeFeedback
} from 'react-native';

import { Button, Input, Slider, Overlay, Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import Globals from '../../constants/Globals';

export default class AddDriver extends React.Component {
    static navigationOptions = {
        title: 'Agregar conductor',
        headerTitleStyle: {
            fontFamily: 'aller-bd',
            textAlign: "center",
            flex: 1
        },
        headerRight: (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                onPress={() => alert('Ayuda')}
            >
                <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 15 }}>
                    <Ionicons
                        name={'ios-help-circle'}
                        size={32}
                        color='#ff8834'
                    />
                    {/* <Text style={{ fontFamily: 'aller-bd', fontSize: 12, color: '#ff8834' }}>Ayuda</Text> */}
                </View>
            </TouchableNativeFeedback>
        )
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            hasDrivers: false,
            telefono: '',
            conductor: {
                nombre: '',
                num_telefono: ''
            },
            verConductor: false,
            invitacionEnviada: false,
            mensaje: '',
            location: null,
            marker: {},
            conductores: [],
            radio: 5000,
            id_propietario: this.props.navigation.getParam('id_propietario', 0)
        }

        this.socket = this.props.screenProps.socket;
        this.socket.off('obtenerCondutoresCercanos');
    }

    onPress(nombre) {
        this.setState({ selected: nombre });
        alert(nombre);
    }

    consultarConductoresCercanos(lat, lon) {
        this.socket.emit('consultarCondutoresCercanos', {
            socket_id: this.socket.id,
            radio: this.state.radio / 1000,
            latitud: lat,
            longitud: lon
        });
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        } else {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                Alert.alert('Atención', 'Es necesario acceder a la ubicación del dispositivo.')
            }

            let location = await Location.getCurrentPositionAsync({});
            // console.log(location);
            this.consultarConductoresCercanos(location.coords.latitude, location.coords.longitude);
            this.setState({
                location: location.coords,
                marker: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                },
                isLoading: false
            });

            this.socket.on('obtenerCondutoresCercanos', (res) => {
                if (res.length != 0) {
                    this.setState({
                        conductores: res.map(info => {
                            return {
                                latitude: info.latitud,
                                longitude: info.longitud,
                                id_conductor: info.datos_chofer.idChofer,
                                nombre_conductor: info.datos_chofer.nombreChofer,
                                id_socket: info.id_socket
                            }
                        }),
                        hasDrivers: true
                    });
                    // console.log(this.state.conductores);
                } else {
                    Alert.alert('Información', 'No se encontrarón conductores disponibles en el radio establecido.')
                }
            });
        }
    }

    async obtenerConductor() {
        if (this.state.telefono != '') {
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                const result = await fetch(`${Globals.server}:3006/webservice/id_usuario_geocerca`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        telefono: this.state.telefono
                    })
                });

                const datos = await result.json();

                if (datos.datos.length == 0) {
                    console.log('No hay conductor asociado al teléfono proporcionado.');
                    this.setState({
                        mensaje: 'No hay conductor asociado al teléfono proporcionado.',
                        verConductor: false,
                        invitacionEnviada: true
                    });
                } else {
                    // console.log(datos.datos);
                    this.props.navigation.navigate('InfoDriver', { id_usuario: datos.datos[0].out_id_usuario, id_propietario: this.state.id_propietario });
                }
            } else {
                Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
            }
        } else {
            this.setState({
                mensaje: 'Escribe el número de teléfono',
                invitacionEnviada: true
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 15 }}>
                <Overlay
                    overlayStyle={{ width: 300 }}
                    isVisible={this.state.invitacionEnviada}
                    animationType='fade'
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                >
                    <View>
                        <Button
                            type='clear'
                            icon={{
                                type: 'material-community',
                                name: 'window-close',
                                size: 24,
                                color: '#000'
                            }}
                            buttonStyle={{
                                position: 'absolute',
                                top: 0,
                                right: 0
                            }}
                            onPress={() => this.setState({ verConductor: false, invitacionEnviada })}
                        />
                        <View style={{ justifyContent: 'center' }}>
                            {
                                this.state.mensaje == 'La invitación ha sido enviada, espera la respuesta del conductor' &&
                                <Icon
                                    type='font-awesome'
                                    name='thumbs-up'
                                    color='#20d447'
                                    size={92}
                                /> ||
                                this.state.mensaje != 'La invitación ha sido enviada, espera la respuesta del conductor' &&
                                <Icon
                                    type='font-awesome'
                                    name='times-circle'
                                    color='#e81a1a'
                                    size={92}
                                />
                            }
                        </View>
                        <View>
                            <View>
                                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'aller-lt', fontSize: 16 }}>{this.state.mensaje}</Text>
                            </View>
                            <Button
                                title='OK'
                                buttonStyle={{ marginVertical: 10, marginHorizontal: 13, backgroundColor: '#ff8834' }}
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                onPress={() => { this.setState({ invitacionEnviada: false }) }}
                            />
                        </View>
                    </View>
                </Overlay>
                <View style={{ flex: 1, flexDirection: 'row', marginVertical: 15 }}>
                    <View style={{ flex: 1 }}>
                        <Input
                            label='Ingresa teléfono'
                            keyboardType='phone-pad'
                            inputContainerStyle={{ height: 32, flex: 1 }}
                            inputStyle={{ bottom: -2, fontFamily: 'aller-lt', fontSize: 15 }}
                            labelStyle={{ fontFamily: 'aller-bd', color: 'black', fontWeight: '200', marginRight: 10 }}
                            containerStyle={{ flexDirection: 'row', alignItems: 'center', width: 260, left: -10 }}
                            onChangeText={(value) => this.setState({ telefono: value })}
                        />
                    </View>
                    <Button
                        title='Ver'
                        buttonStyle={{ height: 32, width: 75, backgroundColor: '#ff8834' }}
                        titleStyle={{ fontFamily: 'aller-lt' }}
                        onPress={() => { this.obtenerConductor(); }}
                    />
                </View>
                <Text style={{ fontFamily: 'aller-lt', fontSize: 16 }}>Selecciona un conductor</Text>
                <View style={{ flex: 10 }}>
                    {
                        this.state.isLoading ? <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} /> :
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                initialRegion={{
                                    latitude: this.state.location.latitude,
                                    longitude: this.state.location.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                onPress={e => {
                                    this.setState({ marker: e.nativeEvent.coordinate });
                                    setTimeout(() => {
                                        this.consultarConductoresCercanos(this.state.marker.latitude, this.state.marker.longitude);
                                    }, 250);
                                }}
                            >
                                <MapView.Marker
                                    coordinate={this.state.marker}
                                />

                                {
                                    this.state.hasDrivers &&
                                    this.state.conductores.map(conductor => {
                                        return (
                                            <MapView.Marker
                                                key={conductor.id_conductor}
                                                coordinate={{
                                                    latitude: conductor.latitude,
                                                    longitude: conductor.longitude
                                                }}
                                                onPress={() => this.props.navigation.navigate('InfoDriver', { socket_id: conductor.id_socket, socket: this.socket, id_usuario: conductor.id_conductor, id_propietario: this.state.id_propietario })}
                                            >
                                                <Icon
                                                    type='font-awesome'
                                                    name='user'
                                                    size={24}
                                                    color='black'
                                                />
                                            </MapView.Marker>
                                        )
                                    })
                                }
                                <Circle
                                    center={this.state.marker}
                                    radius={this.state.radio}
                                    strokeWidth={2}
                                />
                            </MapView>
                    }
                </View>
                <Text style={{ fontFamily: 'aller-lt', fontSize: 16, marginBottom: 5 }} >Radio de visualización</Text>
                <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'aller-lt', fontSize: 14 }} >5 Km</Text>
                        <Text style={{ fontFamily: 'aller-lt', fontSize: 14 }} >10 Km</Text>
                        <Text style={{ fontFamily: 'aller-lt', fontSize: 14 }} >20 Km</Text>
                    </View>
                    <Slider
                        value={this.state.radio}
                        onValueChange={ radio => {
                            this.setState({ radio });
                            // this.consultarConductoresCercanos(this.state.marker.latitude, this.state.marker.longitude);
                        }}
                        minimumValue={5000}
                        maximumValue={20000}
                    />
                </View>
            </View>
        );
    }
}
/*
const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
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
*/