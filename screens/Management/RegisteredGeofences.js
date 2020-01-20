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
    RefreshControl
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';


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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View elevation={2} style={{ backgroundColor: '#fff', height: 70}}>
                    <Button
                        type='clear'
                        icon={{
                            name: "help",
                            size: 32,
                            color: '#ff8834'
                        }}
                        containerStyle={{ 
                            flex: 1,
                            position: 'absolute',
                            right: 0,
                        }}
                        buttonStyle={{
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