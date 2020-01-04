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
    TouchableOpacity,
    StatusBar,
    Alert,
    RefreshControl
} from 'react-native';

import { Button, colors, Card } from 'react-native-elements'
import { FontAwesome } from "@expo/vector-icons";
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
                console.log(data);

                if (data.datos.length != 0) {
                    let vehicles = data.datos.map((v) => {
                        return {
                            id: v.id_unidad,
                            nombre: `${v.marca} ${v.modelo}`,
                            placas: v.placas,
                            color: v.color.includes('#') ? v.color : '#a8a8a8',
                            imagen: 'https://allauthor.com/images/poster/large/1501476185342-the-nights-come-alive.jpg',//v.foto
                            vigencia: new Date(v.vigencia_operacion).toLocaleDateString(),
                            problema: v.estado != 0
                        }
                    })
                    this.setState({
                        hasVehicles: true,
                        vehicles: vehicles,
                        isLoading: false
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

    _eliminarVehiculo() {
        Alert.alert('Atención', 'Esta seguro que desea eliminar el vehículo', [
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancelar eliminar vehículo'),
                style: 'cancel',
            },
            {
                text: 'Aceptar', 
                onPress: () => console.log('Aceptar eliminar vehículo.')
            },
        ], {cancelable: false})
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#ff8834" barStyle="light-content" />
                <View elevation={2} style={styles.sectionContainer}>
                    <Button
                        type='clear'
                        icon={{
                            name: "add-circle",
                            size: 32,
                            color: colors.primary
                        }}
                        buttonStyle={{
                            position: 'absolute',
                            flexDirection: 'column',
                            alignSelf: 'center',
                            top: -10
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            fontFamily: 'aller-lt',
                            flex: 1
                        }}
                        title="Agregar vehículo"
                        onPress={() => this.addVehicle()}
                    />

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
                            top: -10
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            fontFamily: 'aller-lt',
                            flex: 1,
                            fontSize: 12
                        }}
                        title="Ayuda"
                    />
                </View>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}
                    refreshControl={this._refreshControl()}
                >
                    <View style={{ marginBottom: 15 }}>
                        {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                        {!this.state.isLoading && this.state.hasVehicles &&
                            this.state.vehicles.map((v, i) => {
                                return (
                                    <Card key={i}>
                                        <TouchableOpacity
                                            /*key={i}*/
                                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                            onPress={() => { v.problema ? this.props.navigation.navigate('AddVehicle') : null }}
                                        >
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
                                            <Button
                                                type='clear'
                                                icon={{
                                                    name: "delete",
                                                    size: 24,
                                                    color: '#ff8834'
                                                }}
                                                buttonStyle={{
                                                    position: 'absolute',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    right: -15,
                                                }}
                                                iconContainerStyle={{
                                                    flex: 1,
                                                }}
                                                titleStyle={{
                                                    fontFamily: 'aller-lt',
                                                    flex: 1,
                                                    fontSize: 12
                                                }}
                                                title="Eliminar"
                                                onPress={() => this._eliminarVehiculo(v.id)}
                                            />
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
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fafafa',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 76
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
        width: 50,
        height: 50,
    }
});
