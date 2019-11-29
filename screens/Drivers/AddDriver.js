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
} from 'react-native';

import { Button, Input, Slider, Overlay, Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

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
    state = {
        isLoading: true,
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
        radio: 5000
    }

    onPress(nombre) {
        this.setState({ selected: nombre })
        alert(nombre)
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
            console.log(location);

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
                const result = await fetch('http://34.95.33.177:3006/webservice/interfaz54/obtener_conductor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        telefono: `"${this.state.telefono}"`
                    })
                });

                const datos = await result.json();

                if (datos.datos.length == 0) {
                    console.log('no hay datos');
                    this.setState({
                        mensaje: 'No hay conductor asociado al teléfono proporcionado',
                        verConductor: false,
                        invitacionEnviada: true
                    });
                } else {
                    this.setState({
                        conductor: {
                            nombre: datos.datos[0].nombre,
                            num_telefono: datos.datos[0].num_telefono
                        }
                    });

                    console.log(this.state.conductor);

                    this.setState({ verConductor: true })
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

    async invitarConductor() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            const result = await fetch('http://34.95.33.177:3006/webservice/interfaz55/invitar_conductor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_operador: 1
                })
            });

            const datos = await result.json();

            console.log(datos.datos[0]);


            if (datos.datos[0].sp_invitar_conductor == 'operación exitosa!') {
                this.setState({ mensaje: 'La invitación ha sido enviada, espera la respuesta del conductor' });
            } else {
                this.setState({ mensaje: 'Error al enviar la invitación al conductor, intente de nuevo más tarde.' });
            }

            this.setState({ verConductor: false, invitacionEnviada: true });
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 15 }}>
                <Overlay
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
                </Overlay>
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
                        onPress={() => { this.props.navigation.navigate('InfoDriver')/*this.obtenerConductor();*/ }}
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
                                onPress={e => this.setState({ marker: e.nativeEvent.coordinate })}
                            >
                                <MapView.Marker
                                    coordinate={this.state.marker}
                                />

                                <MapView.Marker
                                    coordinate={{
                                        latitude: this.state.marker.latitude + 0.01,
                                        longitude: this.state.marker.longitude + 0.01
                                    }}
                                    onPress={ () => this.props.navigation.navigate('InfoDriver') }
                                >
                                    <Icon
                                        type='font-awesome'
                                        name='user'
                                        size={24}
                                        color='black'
                                    />
                                </MapView.Marker>

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