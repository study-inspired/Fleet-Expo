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
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
    TouchableNativeFeedback
} from 'react-native';

import { Card, Icon } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';


export default class RegisteredGeofences extends React.Component {

    static navigationOptions = {
        title: 'Geocercas registradas',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    state = {
        isLoading: true,
        geocercas: []
    }

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

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const response = await fetch('http://35.203.42.33:3006/webservice/obtener_geocercas1', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        in_propietario: 2,
                    }),
                })

                const { datos, msg } = await response.json();

                if (msg) {
                    Alert.alert('Hubo un error', msg);
                    this.setState({ isLoading: false });
                } else {
                    if (datos.length != 0) {
                        let geofences = datos.map( async g => { return {
                            ...g,
                            tiene_vehiculos: await this._tieneVehiculos(g.id_geocercas)
                        }});
    
                        Promise.all(geofences).then( completed => {
                            // console.log(geofences);
                            
                            this.setState({ 
                                geocercas: completed, 
                                isLoading: false 
                            });
                        });
                    } else {
                        Alert.alert('Info', 'No hay geocercas registradas.');
                        this.setState({ geocercas: [], isLoading: false });
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un error.');
                console.error(error);
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async _tieneVehiculos(id) {
        try {
            const response = await fetch('http://35.203.42.33:3006/webservice/obtener_unidades_geocercas', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_geocercas: id,
                    p_id_propietario: 2,
                }),
            });

            const { datos, msg } = await response.json();
            // console.log(datos);

            if (msg) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
                console.error(msg);
            } else {
                return datos.length != 0;
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
            console.log(error);
        }
    }

    async _eliminarGeocerca(id) {
        console.log('Geoocerca', id);
        
        Alert.alert('Atención', 'Esta seguro que desea eliminar el vehículo', [
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancelar eliminar geocerca.'),
                style: 'cancel',
            },
            {
                text: 'Aceptar',
                onPress: async () => {
                    const state = await NetInfo.fetch();
                    if (state.isConnected) {
                        try {
                            const response = await fetch('http://35.203.42.33:3006/webservice/elimimar_geocercas', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    p_id_geocercas: id,
                                })
                            })

                            const { datos, msg} = await response.json();
                
                            if (msg) {
                                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
                                console.error(msg);
                            } else if (datos[0].sp_elimimar_geocercas) {
                                Alert.alert('Información', 'Se eliminó la geocerca exitosamente.');
                                await this.componentDidMount();
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
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
                <View elevation={2} style={{ backgroundColor: '#fff', height: 70 }}>
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
                        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView} refreshControl={this._refreshControl()} >
                            <View style={{ marginBottom: 15 }}>
                                {
                                    this.state.geocercas.map((g, i) => {
                                        return (
                                            <Card key={i} wrapperStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <TouchableOpacity
                                                    style={{
                                                        flex: 2,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={() => this.props.navigation.navigate('GeofenceVehicles', { id_propietario: 2, id_geocerca: g.id_geocercas, nombre_geocerca: g.nombre })}
                                                >
                                                    <Icon type='material-community' name="map" size={42} iconStyle={{ flex: 1, marginHorizontal: 5 }} />
                                                    <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, }}>{g.nombre}</Text>
                                                </TouchableOpacity>
                                                <TouchableNativeFeedback
                                                    background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                                                    onPress={() => this._eliminarGeocerca(g.id_geocercas)}
                                                >
                                                    <View style={styles.deleteButton}>
                                                        <MaterialIcons
                                                            name='delete'
                                                            size={24}
                                                        />
                                                        <Text style={{ fontSize: 12, marginLeft: 2, fontFamily: 'aller-bd' }} >Eliminar</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                                <TouchableNativeFeedback
                                                    background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                                                    onPress={() => this.props.navigation.navigate('AssignVehicle', { id_geocerca: g.id_geocercas, id_propietario: 2 })}
                                                >
                                                    <View style={{
                                                        flex: 1,
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: 0
                                                    }}>
                                                        <Icon type='font-awesome' name='plus' size={16} iconStyle={{ position: 'absolute', right: -22, top: -1 }} />
                                                        <Icon type='font-awesome' name='car' size={20} iconStyle={{ marginHorizontal: 5, position: 'absolute', right: -16, top: 4 }} />
                                                        {
                                                            g.tiene_vehiculos &&
                                                            <Icon type='font-awesome' name='check-circle' size={12} color='#20d447' iconStyle={{ position: 'absolute', right: -29, top: 8 }} />
                                                        }
                                                        {
                                                            true && //!g.vehiculo &&
                                                            <Text style={{ fontFamily: 'aller-bd', fontSize: 12, marginBottom: 1, marginTop: 26 }}>Asignar{/* vehículo*/}</Text>
                                                        }
                                                    </View>

                                                </TouchableNativeFeedback>
                                            </Card>
                                        )
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
    deleteButton: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 65
    }
});