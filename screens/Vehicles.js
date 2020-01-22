/**
 * @format
 * @flow
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    StatusBar,
    Alert,
    RefreshControl
} from 'react-native';

import { Button, colors, Card } from 'react-native-elements'
import { FontAwesome, MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import NetInfo from '@react-native-community/netinfo'

export default class VehiclesView extends React.Component {
    static navigationOptions = {
        title: 'Vehículos',
        headerStyle: {
            elevation: 4,
            backgroundColor: '#ec6a2c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
        },
    }

    state = {
        refreshing: false,
        isLoading: true,
        hasVehicles: false,
        vehicles: {}
    }

    async _getEstadoDocumentosVehiculoGeneral(niv_unidad) {
        try {
            const result = await fetch('http://35.203.42.33:3000/EstadoDocumentosVehiculoxUsuarioGeneral', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    in_niv: niv_unidad,
                }),
            });

            const data = await result.json();

            // console.log(niv_unidad, data.data[0].sp_estado_all_documentos_vehiculos_general);

            return (data.data[0].sp_estado_all_documentos_vehiculos_general != 0) ? true : false;

        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
        }
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
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
                    let vehicles = data.datos.map(async (v) => {
                        let problema = await this._getEstadoDocumentosVehiculoGeneral(`${v.niv}`)
                        return {
                            id: v.id_unidad,
                            nombre: `${v.marca} ${v.modelo}`,
                            placas: v.placas,
                            color: v.color.includes('#') ? v.color : '#a8a8a8',
                            imagen: v.foto.replace('/var/www/html', 'http://35.203.42.33'),
                            vigencia: new Date(v.vigencia_operacion).toLocaleDateString(),
                            problema: problema,
                            niv: v.niv
                        }
                    });

                    Promise.all(vehicles).then((completed) => {
                        // console.log(completed); 
                        this.setState({
                            hasVehicles: true,
                            vehicles: completed,
                            isLoading: false
                        });
                    });
                } else {
                    Alert.alert('Info', 'No hay vehiculos!');
                    this.setState({
                        isLoading: false
                    });
                }

            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                this.setState({
                    isLoading: false
                });
                console.error(error);
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async addVehicle() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            this.props.navigation.navigate('AddVehicle');
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
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

    _eliminarVehiculo(id_unidad) {
        Alert.alert('Atención', 'Esta seguro que desea eliminar el vehículo', [
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancelar eliminar vehículo'),
                style: 'cancel',
            },
            {
                text: 'Aceptar',
                onPress: async () => {
                    const state = await NetInfo.fetch();
                    if (state.isConnected) {
                        try {
                            const result = await fetch('http://35.203.42.33:3006/webservice/delete_vehiculo', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    p_id_unidad: id_unidad
                                }),
                            })

                            const { datos, msg} = await result.json();
                            // console.log(data);
                            if (msg) {
                                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                                console.error(msg);
                            } else if (datos.length != 0) {
                                Alert.alert('Operación exitosa', 'Se ha eliminado el vehículo correctamente.');
                                this._refreshListView();
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                            console.error(error);
                        }
                    }
                }
            },
        ], { cancelable: false })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#ff8834" barStyle="light-content" />
                <View elevation={2} style={styles.sectionContainer}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#cacaca', true)}
                        onPress={() => this.addVehicle()}
                    >
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <AntDesign
                                name={'pluscircle'}
                                size={32}
                                color={colors.primary}
                            />
                            <Text style={{ fontFamily: 'aller-bd', fontSize: 16, color: colors.primary }}>Agregar vehículo</Text>
                        </View>
                    </TouchableNativeFeedback>

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
                        <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} />
                        :
                        <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                            style={styles.scrollView}
                            refreshControl={this._refreshControl()}
                        >
                            <View style={{ marginBottom: 15 }}>
                                {!this.state.isLoading && this.state.hasVehicles &&
                                    this.state.vehicles.map((v, i) => {
                                        return (
                                            <TouchableNativeFeedback
                                                key={i}
                                                onPress={() => { v.problema ? this.props.navigation.navigate('AddVehicle', { problema: true, niv: v.niv, id_unidad: v.id }) : null }}
                                            >
                                                <Card wrapperStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Image
                                                            style={styles.imagen}
                                                            resizeMode="cover"
                                                            source={{ uri: v.imagen }}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 5,
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={styles.texto700}>{v.nombre}</Text>
                                                            <View style={{ width: 16, height: 16, marginTop: 4, marginLeft: 5, backgroundColor: v.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                        </View>

                                                        <Text style={styles.texto600}>{v.placas}</Text>
                                                        <Text style={styles.texto70012}>Vigencia de operación:</Text>
                                                        <Text style={styles.texto600, { fontSize: 12 }}>{v.vigencia}</Text>
                                                    </View>
                                                    <FontAwesome name={v.problema ? 'warning' : 'check-circle'} size={18} color={v.problema ? '#ebcc1c' : '#20d447'} style={styles.listo} />
                                                    <TouchableNativeFeedback
                                                        background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                                                        onPress={() => this._eliminarVehiculo(v.id)}
                                                    >
                                                        <View style={styles.deleteButton}>
                                                            <MaterialIcons
                                                                name='delete'
                                                                size={24}
                                                            />
                                                            <Text style={{ fontSize: 12, marginLeft: 2, fontFamily: 'aller-bd' }} >Eliminar</Text>
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                </Card>
                                            </TouchableNativeFeedback>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                }
            </View>
        )
    }
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fafafa',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingVertical: 24,
    },
    button: {
        backgroundColor: '#ff8834',
    },
    texto600: {
        fontFamily: 'aller-lt',
        fontSize: 16,
        marginBottom: 5
    },
    texto700: {
        fontFamily: 'aller-bd',
        fontSize: 16,
        marginBottom: 5
    },
    texto70012: {
        fontFamily: 'aller-bd',
        fontSize: 12,
        marginBottom: 5
    },
    listo: {
        marginTop: 2,
        marginBottom: 5,
        position: 'absolute',
        top: 0,
        right: 6
    },
    imagen: {
        width: 70,
        height: 70,
    },
    deleteButton: {
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        bottom: -5,
        right: -8
    }
});
