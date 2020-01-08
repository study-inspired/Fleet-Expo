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
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';

import { Button, Card } from 'react-native-elements'

const vehiculos = [
    {
        nombre: 'Chevrolet Aveo',
        imagen: 'http://www.cosasdeautos.com.ar/wp-content/uploads/2011/06/aveo2012-mexico-3.jpg',
        placa: 'COL-6462J',
        color: '#948d8d'
    },
    {
        nombre: 'NISSAN Versa',
        imagen: 'https://dealerimages.dealereprocess.com/image/upload/c_limit,f_auto,fl_lossy/v1/svp/Pix_PNG1280/2017/17nissan/17nissanversasedansv2a/nissan_17versasedansv2a_frontview',
        placa: 'COL-1684D',
        color: '#ffffff'
    },
    {
        nombre: 'Chevrolet Beat',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/812y-rC3v0L._SX425_.jpg',
        placa: 'COL-4568R',
        color: '#c72020'
    },
]

export default class SelectVehicle extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'Seleccionar vehículo'),
            headerStyle: {
                elevation: 4
            },
            headerTitleStyle: {
                textAlign: "center",
                fontFamily: 'aller-bd',
                fontWeight: '200',
                fontSize: 18,
                flex: 1,
            },
            headerRight: <View></View>
        }
    }

    state = {
        isLoading: true,
        hasVehicles: false,
        vehicles: [],
        nextScreen: this.props.navigation.getParam('nextScreen', ''),
        text: this.props.navigation.getParam('text', 'Seleccione el vehículo'),
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
                Alert.alert('Info', 'No hay vehiculos!');
                this.props.navigation.goBack();
            }

        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
            this.props.navigation.goBack();
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View elevation={2} style={styles.subHeader}>
                    <Text style={[styles.textoBold, { marginVertical: 25, flex: 5 }]}>{this.state.text}</Text>
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
                {
                    this.state.isLoading ?
                        <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{flex: 1}} />
                        :
                        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                            <View style={{ marginBottom: 15 }}>
                                {!this.state.isLoading && this.state.hasVehicles &&
                                    this.state.vehicles.map((v, i) => {
                                        return (
                                            <Card key={i}>
                                                <TouchableOpacity
                                                    style={styles.touchableOpacity}
                                                    onPress={() => { this.props.navigation.navigate(this.state.nextScreen, { vehicle: v }) }}
                                                >
                                                    <View
                                                        style={styles.imagenContainer}>
                                                        <Image
                                                            style={styles.imagenVehiculo}
                                                            resizeMode="cover"
                                                            source={{ uri: v.imagen }}
                                                        />
                                                    </View>
                                                    <View
                                                        style={styles.vehiculoContainer}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textoBold, { marginBottom: 5 }]}>{v.nombre}</Text>
                                                            <View style={[styles.colorVehiculo, { backgroundColor: v.color }]}></View>
                                                        </View>
                                                        <Text style={[styles.textoNormal, { fontSize: 12, marginBottom: 10 }]}>{v.placas}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </Card>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                }


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
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16,
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 16,
    },
    colorVehiculo: {
        width: 16,
        height: 16,
        marginTop: 4,
        marginLeft: 5,
        borderRadius: 8,
        borderColor: '#000',
        borderWidth: 1
    },
    vehiculoContainer: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imagenVehiculo: {
        width: 50,
        height: 50,
        alignSelf: 'flex-start'
    },
    imagenContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    touchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subHeader: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16
    }
});