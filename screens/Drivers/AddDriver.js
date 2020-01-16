/**
 * @format
 * @flow
 */

import React from 'react';
import {
    Image,
    View,
    Text,
    Alert,
    ActivityIndicator,
    YellowBox
} from 'react-native';

import { Button, Input, Slider, Overlay, Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import io from 'socket.io-client/dist/socket.io';

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

export default class AddDriver extends React.Component {
    static navigationOptions = {
        title: 'Agregar conductor',
        headerTitleStyle: {
            fontFamily: 'aller-bd',
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
            radio: 5000
        }

        this.socket = io.connect('http://35.203.42.33:3001/');

        this.socket.on('connect', () => {
            console.log(this.socket.id);
        });

        this.socket.on('obtenerCondutoresCercanos', (res) => {
            // console.log('Conductores cercanos: ', res.length);

            this.setState({
                conductores: res.map(info => {
                    return {
                        latitude: info.latitud,
                        longitude: info.longitud,
                        id_conductor: info.datos_chofer.idChofer,
                        nombre_conductor: info.datos_chofer.nombreChofer
                    }
                }),
                hasDrivers: true
            });
            // console.log(this.state.conductores);
        });
    }

    onPress(nombre) {
        this.setState({ selected: nombre })
        alert(nombre)
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
        }
    }

    async obtenerConductor() {
        if (this.state.telefono != '') {
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                const result = await fetch('http://35.203.42.33:3006/webservice/id_usuario_geocerca', {
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

                    this.props.navigation.navigate('InfoDriver', { id_usuario: datos.datos[0].out_id_usuario, id_propietario: this.props.navigation.getParam('id_propietario', 0), socket: this.socket });
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

    // async invitarConductor() {
    //     const state = await NetInfo.fetch();
    //     if (state.isConnected) {
    //         const result = await fetch('http://34.95.33.177:3006/webservice/interfaz55/invitar_conductor', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 id_operador: 1
    //             })
    //         });

    //         const datos = await result.json();

    //         // console.log(datos.datos[0]);


    //         if (datos.datos[0].sp_invitar_conductor == 'operación exitosa!') {
    //             this.setState({ mensaje: 'La invitación ha sido enviada, espera la respuesta del conductor' });
    //         } else {
    //             this.setState({ mensaje: 'Error al enviar la invitación al conductor, intente de nuevo más tarde.' });
    //         }

    //         this.setState({ verConductor: false, invitacionEnviada: true });
    //     } else {
    //         Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
    //     }
    // }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 15 }}>
                {/* <Overlay
                    overlayStyle={{ width: 300 }}
                    isVisible={this.state.verConductor}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            <Image
                                style={{
                                    borderRadius: 46,
                                    width: 92,
                                    height: 92,
                                    marginLeft: 5
                                }}
                                resizeMode="cover"
                                source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg' }}
                            />
                        </View>
                        <View style={{ flex: 2 }}>
                            <View>
                                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'aller-lt', fontSize: 16 }}>{this.state.conductor.nombre}</Text>
                                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'aller-lt' }}>32 Años</Text>
                                <Text style={{ textAlign: 'center', fontFamily: 'aller-lt' }}>{this.state.conductor.num_telefono}</Text>
                            </View>
                            <Button
                                title='Invitar'
                                buttonStyle={{ marginVertical: 10, marginHorizontal: 13, backgroundColor: '#ff8834' }}
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                onPress={() => { this.invitarConductor() }}
                            />
                        </View>
                    </View>
                </Overlay> */}
                <Overlay
                    overlayStyle={{ width: 300 }}
                    isVisible={this.state.invitacionEnviada}
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
                                                onPress={() => this.props.navigation.navigate('InfoDriver', { id_usuario: conductor.id_conductor, id_propietario: this.props.navigation.getParam('id_propietario', 0) })}
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
                        onValueChange={radio => this.setState({ radio })}
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