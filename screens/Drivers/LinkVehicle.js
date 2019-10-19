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
    TouchableOpacity
} from 'react-native';

import { Button, Card } from 'react-native-elements'

const vehiculos = [
    {
        nombre: 'Chevrolet Aveo',
        imagen: 'http://www.cosasdeautos.com.ar/wp-content/uploads/2011/06/aveo2012-mexico-3.jpg',
        placa: 'COL-6462J',
        color: '#e0e0e0',
        problema: false
    },
    {
        nombre: 'NISSAN Versa',
        imagen: 'https://dealerimages.dealereprocess.com/image/upload/c_limit,f_auto,fl_lossy/v1/svp/Pix_PNG1280/2017/17nissan/17nissanversasedansv2a/nissan_17versasedansv2a_frontview',
        placa: 'COL-1684D',
        color: '#ffffff',
        problema: false
    },
    {
        nombre: 'Chevrolet Beat',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/812y-rC3v0L._SX425_.jpg',
        placa: 'COL-4518V',
        color: '#4287f5',
        problema: true
    },
    {
        nombre: 'Chevrolet Aveo',
        imagen: 'http://www.cosasdeautos.com.ar/wp-content/uploads/2011/06/aveo2012-mexico-3.jpg',
        placa: 'COL-6472J',
        color: '#948d8d',
        problema: true
    },
    {
        nombre: 'NISSAN Versa',
        imagen: 'https://dealerimages.dealereprocess.com/image/upload/c_limit,f_auto,fl_lossy/v1/svp/Pix_PNG1280/2017/17nissan/17nissanversasedansv2a/nissan_17versasedansv2a_frontview',
        placa: 'COL-1684E',
        color: '#ffffff',
        problema: false
    },
    {
        nombre: 'Chevrolet Beat',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/812y-rC3v0L._SX425_.jpg',
        placa: 'COL-4562R',
        color: '#c72020',
        problema: false
    },
]

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
        selected: null,
        vehiculos: {},
        mensaje: ''
    }

    onPress(nombre) {
        this.setState({ selected: nombre })
        // alert(nombre)
    }

    async componentDidMount() {
        try {
            const result = await fetch('http://34.95.33.177:3006/webservice/interfaz60/obtener_unidades_propietario', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_correo: 'carloslarios.15@gmail.com',
                    p_pass: '123456',
                }),
            })

            const drivers = await result.json();
            console.log(drivers);

            this.setState({ vehiculos: drivers.datos, isLoading: false })

        } catch (error) {
            throw error;
        }
    }

    vincularVehiculo(unidad, propietario, chofer) {
        try {
            const result = await fetch('http://34.95.33.177:3006/webservice/interfaz57/vincular_vehiculo', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_unidad: unidad,
                    p_id_propietario: propietario,
                    p_id_chofer: chofer
                }),
            })

            const datos = await result.json();

            // this.setState({
            //     mensaje: datos.datos.mensaje,
            // });
            alert(datos.datos.mensaje)
            
        } catch (error) {
            throw error;
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
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={{ marginBottom: 15 }}>
                        {
                            vehiculos.map((v) => {
                                return (
                                    <Card key={v.placa}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                            onPress={() => { this.props.navigation.navigate('Drivers') }}
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
                                                    <Text style={styles.texto700}>{v.nombre}</Text>
                                                    <View style={{ width: 16, height: 16, marginTop: 2, marginLeft: 5, backgroundColor: v.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                </View>
                                                <Text style={[styles.texto600, { fontSize: 12, marginBottom: 10 }]}>{v.placa}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                );
                            })
                        }

                    </View>

                </ScrollView>
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