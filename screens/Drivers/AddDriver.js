/**
 * @format
 * @flow
 */

import React from 'react';
import {
    Image,
    View,
    Text,
} from 'react-native';

import { Button, Input, Slider, Overlay, Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

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
        value: 0,
        telefono: '',
        conductor: {
            nombre: '',
            num_telefono: ''
        },
        verConductor: false,
        invitacionEnviada: false,
        mensaje: '',
    }
    onPress(nombre) {
        this.setState({ selected: nombre })
        alert(nombre)
    }

    async obtenerConductor() {
        if (this.state.telefono != '') {
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
            this.setState({
                mensaje: 'Escribe el número de teléfono',
                invitacionEnviada: true
            });
        }
    }

    async invitarConductor() {
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
            this.setState({ mensaje: 'Error al enviar la invitación al conductor' });
        }

        this.setState({ verConductor: false, invitacionEnviada: true });
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
                            inputStyle={{ bottom: -2, fontSize: 15 }}
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
                <MapView
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: 19.245455,
                        longitude: -103.722538,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}
                />
                <Text style={{ fontFamily: 'aller-lt', fontSize: 16 }} >Radio de visualización</Text>
                <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
                    <Slider
                        value={this.state.value}
                        onValueChange={value => this.setState({ value })}
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