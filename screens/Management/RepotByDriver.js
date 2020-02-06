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
    ActivityIndicator,
    RefreshControl,
    Alert,
    TouchableNativeFeedback
} from 'react-native';

import { Card, Icon } from 'react-native-elements'
import Globals from '../../constants/Globals';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';


export default class ReportByDriver extends React.Component {
    static navigationOptions = {
        title: 'Reporte por conductor',
        headerStyle: {
            elevation: 4
        },
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
        refreshing: false,
        isLoading: true,
        hasDrivers: false,
        drivers: []
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch(`${Globals.server}:3006/webservice/interfaz/obtener_unidades_conductores_de_propietario`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        in_id_propietario: this.props.screenProps.id_propietario
                    }),
                })

                const { datos, msg } = await result.json();

                if (msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
                    console.error(msg);
                } else if (datos.length != 0) {
                    let drivers = datos.map(async (d) => {
                        let { nombre, fotografia } = await this._datosUsuario(d.id_chofer1);
                        return {
                            id_propietario: d.id_propietario,
                            id_chofer: d.id_chofer1,
                            id_cup: d.id_cup,
                            nombre: nombre,
                            fotografia: fotografia
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
                        isLoading: false
                    });
                }
            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
                console.error(error);
                this.setState({
                    drivers: [],
                    isLoading: false
                });
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async _datosUsuario(id_usuario_chofer) {
        try {
            // console.log(`${Globals.server}:3006/webservice/datos_conductor`);

            const result = await fetch(`${Globals.server}:3006/webservice/datos_conductor`, {
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

            const datos = await result.json();
            // console.log(datos);

            if (datos.datos.length > 0) {
                return {
                    nombre: `${datos.datos[0].nombre.split(' ')[0]} ${datos.datos[0].apellido.split(' ')[0]}`,
                    fotografia: datos.datos[0].fotografia
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

    //Refresh control  
    _refreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this._refreshListView()} />
        )
    }

    _refreshListView() {
        this.setState({ refreshing: true }) //Start Rendering Spinner
        this.componentDidMount()  //<-- Recargo el refresh control
        this.setState({ refreshing: false }) //Stop Rendering Spinner
    }
    //Termina el refresh

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View elevation={2} style={styles.subHeader}>
                    <Text style={[styles.textoBold, { marginVertical: 25, marginLeft: 16 }]}>Seleccione un conductor a consultar</Text>
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
                        <ScrollView
                            style={styles.scrollView}
                            contentInsetAdjustmentBehavior="automatic"
                            refreshControl={this._refreshControl()}
                        >
                            <View style={{ marginBottom: 15 }}>
                                {!this.state.isLoading && this.state.hasDrivers &&
                                    this.state.drivers.map(c => {
                                        return (
                                            <Card key={c.id_chofer}>
                                                <TouchableOpacity
                                                    style={styles.touchableOpacity}
                                                    onPress={() => this.props.navigation.navigate('ReportDriver', { driver: c })}>
                                                    <Icon type='font-awesome' name="bar-chart" size={38} iconStyle={{ position: 'absolute', left: 5 }} />
                                                    <View
                                                        style={styles.imageContainer}>
                                                        <Image
                                                            style={styles.imagenConductor}
                                                            resizeMode="cover"
                                                            source={{ uri: c.fotografia }}
                                                        />
                                                        <Text style={styles.textoBold}>{c.nombre}</Text>
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
        )
    }
}

const styles = StyleSheet.create({
    subHeader: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 16,
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16,
    },
    touchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textoTouchable: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    imagenConductor: {
        borderRadius: 38,
        width: 76,
        height: 76,
    },
    scrollView: {
        backgroundColor: '#fafafa'
    }
})
