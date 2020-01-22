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
    TouchableNativeFeedback,
    ActivityIndicator,
    Alert
} from 'react-native';

import { Card } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';

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
            // console.log(data);

            if (data.datos.length != 0) {
                let vehicles = data.datos.map((v) => {
                    return {
                        id: v.id_unidad,
                        nombre: `${v.marca} ${v.modelo}`,
                        placas: v.placas,
                        color: v.color.includes('#') ? v.color : '#a8a8a8',
                        imagen: v.foto.replace('/var/www/html', 'http://35.203.42.33')
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
                    <Text style={[styles.textoBold, { marginVertical: 25 }]}>{this.state.text}</Text>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                        onPress={() => alert('Ayuda')}
                    >
                        <View style={{flexDirection: 'column', alignItems: 'center', position: 'absolute', top: 12, right: 15}}>
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
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 16
    }
});