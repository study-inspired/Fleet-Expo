/**
 * @format
 * @flow
**/

import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableNativeFeedback
} from 'react-native';

import { Card } from 'react-native-elements';
import Globals from '../../constants/Globals';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

export default class RealTimeReports extends React.Component {
    static navigationOptions = {
        title: 'Reportes en tiempo real',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>,
    }

    state = {
        isLoading: true,
        hasDrivers: false,
        drivers: []
    }

    async componentDidMount() {
        const { isConnected } = await NetInfo.fetch();
        if (isConnected) {
            try {
                const response = await fetch(`${Globals.server}:3006/webservice/interfaz/obtener_unidades_conductores_de_propietario`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        in_id_propietario: this.props.screenProps.id_propietario
                    }),
                })
                const { datos, msg } = await response.json();

                if (msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
                    console.error(msg);
                } else if (datos.length != 0) {
                    let drivers = datos.map(async (d) => {
                        let { nombre, fotografia } = await this._datosUsuario(d.id_chofer1);
                        let ganancias = await this._reporteTiempoReal(d.id_chofer1);
                        return {
                            id_propietario: d.id_propietario,
                            id_chofer: d.id_chofer1,
                            id_cup: d.id_cup,
                            nombre: nombre,
                            fotografia: fotografia,
                            ganancias: ganancias
                        }
                    });
                    Promise.all(drivers).then(completed => {
                        // console.log(completed);
                        this.setState({
                            hasDrivers: true,
                            drivers: completed,
                            isLoading: false
                        });
                    });
                } else {
                    Alert.alert('Información', 'No se encontrarón conductores.');
                    this.setState({
                        drivers: [],
                        isLoading: false
                    });
                }
            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
                //this.props.navigation.goBack();
                this.setState({
                    isLoading: false
                });
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    /**
     * Obtiene los datos del usuario conductor (Nombre, Apellidos, Fotografía, etc.)
     * @param {number} id_usuario_chofer Id del usuario conductor.
     * @returns {Promise<{nombre: string, fotografia: string}>} Primer nombre con primer apellido y fotografia del conductor.
     */
    async _datosUsuario(id_usuario_chofer) {
        try {
            // console.log(`${Globals.server}:3006/webservice/datos_conductor`);

            const response = await fetch(`${Globals.server}:3006/webservice/datos_conductor`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: id_usuario_chofer
                }),
            })
            // console.log(result);

            const { datos } = await response.json();
            // console.log(datos);

            if (datos.length > 0) {
                return {
                    nombre: `${datos[0].nombre.split(' ')[0]} ${datos[0].apellido.split(' ')[0]}`,
                    fotografia: datos[0].fotografia
                }
            } else {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                this.props.navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
        }
    }

    /**
     * Obtiene los datos del usuario conductor (Nombre, Apellidos, Fotografía, etc.)
     * @param {number} id_usuario_chofer Id del usuario conductor.
     * @returns {Promise<{out_total: number, out_efectivo: number, out_tarjeta: number, out_comision: number, out_ganancia_final: number }>}
     */
    async _reporteTiempoReal(id_usuario_chofer) {
        try {
            // console.log(`${Globals.server}:3006/webservice/datos_conductor`);

            const response = await fetch(`${Globals.server}:3006/webservice/cinterfaz121_fleettiempo_real`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    in_id_usuario: id_usuario_chofer
                }),
            })
            // console.log(result);

            const { datos } = await response.json();
            // console.log(datos);

            if (datos.length > 0) {
                console.log(id_usuario_chofer, datos[0])
                return datos[0];
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
        }
    }

    /**
     * Convierte un valor numerico a una cadena que representa valores monetarios con 2 decimales.
     * 12 => 12.00
     * 1234567 => 1,234,567.00
     * 1234567.89 => 1,234,567.89
     * @param {number} number 
     */
    _formatCurrency(number) {
        return (+number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View elevation={2} style={styles.subHeader}>
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
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={{ marginBottom: 15 }}>
                        {
                            this.state.isLoading ? 
                            <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} />:
                            this.state.hasDrivers && this.state.drivers.map(c => {
                                return (
                                    <Card key={c.id_chofer} wrapperStyle={{borderRadius:3}}>
                                        <TouchableOpacity
                                            style={styles.touchableOpacity}
                                            onPress={() => this.props.navigation.navigate('RealTimeReport', { driver: c })} 
                                        >
                                            <View
                                                style={styles.imagecontainer}>
                                                {false && <Image
                                                    style={styles.image}
                                                    resizeMode="cover"
                                                    source={{ uri: c.fotografia }}
                                                />}
                                                <Ionicons
                                                    name={'md-contact'}
                                                    size={76}
                                                />
                                                <Text style={styles.textoBold}>{c.nombre}</Text>
                                            </View>
                                            <View
                                                style={styles.textoTouchable}>
                                                <Text style={styles.textoBold}>Ganancia actual</Text>
                                                <Text style={[styles.textoBold, { marginBottom: 10, color: '#0e9bcf' }]}>$ {this._formatCurrency(c.ganancias.out_total)} MXN</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                );
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subHeader: {
        height: 65,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 14,
        marginBottom: 10
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16,
    },
    touchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    textoTouchable: {
        flex: 3,
        flexDirection: 'column',
        alignItems: 'center'
    },
    imagecontainer: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center'
    },
    image: {
        borderRadius: 38,
        width: 76,
        height: 76,
    }
})

