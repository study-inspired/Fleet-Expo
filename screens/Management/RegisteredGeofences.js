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
import { Ionicons } from '@expo/vector-icons';


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
                const result = await fetch('http://35.203.42.33:3006/webservice/obtener_geocercas', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_id_usuario: 2,
                    }),
                })

                const datos = await result.json();

                if (datos.msg) {
                    Alert.alert('Hubo un error', datos.msg);
                    this.setState({ isLoading: false });
                } else {
                    if (datos.datos.length != 0) {
                        this.setState({ geocercas: datos.datos, isLoading: false });
                    } else {
                        Alert.alert('Info', 'No hay geocercas registradas.');
                        this.setState({ isLoading: false });
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

    async _eliminarGeocerca(id) {
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
            const { datos } = await response.json();

            const { sp_elimimar_geocercas, msg } = datos[0];

            if (msg) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
                console.log(msg);
            } else if (sp_elimimar_geocercas) {
                Alert.alert('Información', 'Se eliminó la geocerca exitosamente.');
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
            console.log(error);
        }
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
                                                <TouchableOpacity
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                    onPress={() => this.props.navigation.navigate('AssignVehicle', { id_geocerca: g.id_geocercas, id_propietario: 2 })}
                                                >
                                                    <Icon type='font-awesome' name='plus' size={18} iconStyle={{ position: 'absolute', right: -24, top: -5 }} />
                                                    <Icon type='font-awesome' name='car' size={24} iconStyle={{ marginHorizontal: 5 }} />
                                                    {
                                                        g.vehiculo &&
                                                        <Icon type='font-awesome' name='check-circle' size={14} color='#20d447' iconStyle={{ position: 'absolute', right: -32, top: -15 }} />
                                                    }
                                                    {
                                                        !g.vehiculo &&
                                                        <Text style={{ fontFamily: 'aller-bd', fontSize: 10, marginBottom: 1, marginTop: 9 }}>Asignar vehículo</Text>
                                                    }

                                                </TouchableOpacity>
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
    }
});