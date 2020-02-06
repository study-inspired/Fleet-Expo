/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TouchableNativeFeedback,
    TouchableOpacity
} from 'react-native';

import { Icon, Overlay, Divider } from 'react-native-elements'

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Layout from '../../constants/Layout';
import Globals from '../../constants/Globals';

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
            disponible: false,
            selectVehicle: false
        }

        this.socket = this.props.screenProps.socket;

        this.socket.off('consultar_vehiculo');
    }

    async componentDidMount() {
        try {
            this.socket.on('consultar_vehiculo', (res) => {
                // console.log(res);
                if (res.mensaje) {
                    Alert.alert('Información', 'No ha sido posible establecer conexión con el vehículo para rastrearlo.');
                    this.setState({
                        disponible: false
                    });
                } else {
                    this.setState({
                        latitude: res.latitud,
                        longitude: res.longitud,
                        disponible: true,
                        isLoading: false
                    });
                }
            });
            const result = await fetch(`${Globals.server}:3006/webservice/interfaz60/obtener_unidades_propietario`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_propietario: this.props.screenProps.id_propietario,
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
                        color: v.color,
                        imagen: v.foto.replace('/var/www/html', Globals.server),
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
                <Overlay
                    overlayStyle={{ width: Layout.window.width - 30, height: 'auto' }}
                    animationType="fade"
                    isVisible={this.state.selectVehicle}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    onBackdropPress={() => this.setState({ selectVehicle: false })}
                >
                    <View style={{ marginTop: 5 }}>
                        <Text style={[styles.textoRegular16, { textAlign: 'center' }]}>Seleccionar vehículo</Text>
                        <Divider style={{ backgroundColor: 'blue', marginTop: 15, marginBottom: 10 }} />
                        {
                            this.state.hasVehicles && this.state.vehicles.map(v => {
                                return (
                                    <TouchableNativeFeedback
                                        key={v.id}
                                        onPress={() => {
                                            this.setState({ vehiculo: v, selectVehicle: false });
                                            this._localizarUnidad(v.id);
                                        }}
                                    >
                                        <View style={{
                                            height: 30,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            marginVertical: 4,
                                            alignItems: 'center',
                                            backgroundColor: this.state.vehiculo.id == v.id ? '#ff8834' : '#fff',
                                            borderRadius: 5
                                        }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textoRegular16, { color: this.state.vehiculo.id == v.id ? '#fff' : '#000' }]}>{v.nombre} -</Text>
                                                {
                                                    v.color.includes('#') &&
                                                    <View style={{ width: 16, height: 16, marginTop: 3, marginLeft: 5, marginRight: 5, backgroundColor: v.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                }
                                                <Text style={[styles.textoRegular16, { color: this.state.vehiculo.id == v.id ? '#fff' : '#000' }]}>- {v.placas}</Text>
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                )
                            })
                        }
                    </View>
                </Overlay>
                <View elevation={2} style={styles.subHeader}>
                    <Text style={[styles.textoBold, { textAlign: 'center', marginTop: 30 }]}>Seleccione el vehículo a consultar</Text>
                    <TouchableOpacity
                        onPress={() => { this.state.problema ? null : this.setState({ selectVehicle: true }) }}
                        style={{
                            height: 40,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 3,
                            alignItems: 'center',
                            width: 320,
                            borderColor: '#cacaca',
                            borderWidth: 1,
                            borderRadius: 5
                        }}
                    >
                        {/* <Text style={[styles.textoRegular16, { flex: 3, marginLeft: 10 }]}>Vehículo</Text> */}
                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                            <Text style={styles.textoRegular16}>{this.state.vehiculo.nombre} -</Text>
                            <View style={{ width: 16, height: 16, marginTop: 3, marginLeft: 5, marginRight: 5, backgroundColor: this.state.vehiculo.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                            <Text style={styles.textoRegular16}>- {this.state.vehiculo.placas}</Text>
                        </View>
                        <View style={styles.viewTouchable}>
                            {/* <Text style={styles.textoRegular16}>vehículo</Text> */}
                            <View style={styles.touchableRightIcon}>
                                <FontAwesome name="chevron-down" size={18} color='black' />
                            </View>
                        </View>
                    </TouchableOpacity>
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
                                    onPress={() => this.props.navigation.navigate('InfoDriver', { id_usuario: conductor.id_conductor/*, id_propietario: this.props.navigation.getParam('id_propietario', 0) */})}
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
        height: 120,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16
    },
    viewTouchable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 30,
    },
    textoRegular16: {
        fontFamily: 'aller-lt',
        fontSize: 16
    },
    touchableRightIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    viewTouchable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    picker: {

    }
});