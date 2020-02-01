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
    Alert,
    RefreshControl,
    Picker,
    TouchableNativeFeedback,
    TouchableOpacity
} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import Globals from '../../constants/Globals';

export default class GeofenceActions extends React.Component {

    static navigationOptions = {
        title: 'Acciones en geocerca',
        headerTitleStyle: {
            elevation: 4,
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    state = {
        refreshing: false,
        isLoading: true,
        hasRecords: false,
        geofences: [],
        mes: new Date().getMonth() + 1,
        id_propietario: 2
    }


    async componentDidMount() {
        this.setState({
            hasRecords: false,
            isLoading: true
        });
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const response = await fetch(`${Globals.server}:3006/webservice/obtener_geocercas1`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        in_propietario: this.state.id_propietario,
                    }),
                })

                const { datos, msg } = await response.json();

                if (msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    this.setState({ isLoading: false });
                    console.error(msg);
                } else if (datos.length != 0) {
                    let ES = datos.map( async g => {
                        let { entradas, salidas } = await this._obtenerEntradasSalidas(g.id_geocercas)
                        return {
                            id_geocerca: g.id_geocercas, 
                            nombre: g.nombre, 
                            entradas: entradas, 
                            salidas: salidas
                        }
                    });

                    Promise.all(ES).then(completed => {
                        this.setState({
                            geofences: completed,
                            hasRecords: true,
                            isLoading: false
                        });
                    })

                    //console.log(this.state.geofences);
                } else {
                    Alert.alert('Info', 'No hay alertas registradas en éste mes.');
                    this.setState({
                        geofences: [],
                        hasRecords: false,
                        isLoading: false
                    });
                }

            } catch (error) {
                Alert.alert('Error', 'Hubo un error.');
                console.error(error);
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async _obtenerEntradasSalidas(id_geocerca) {
        const response = await fetch(`${Globals.server}:3006/webservice/obtener_geocercas`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                in_id_geocerca: id_geocerca,
                in_mes: this.state.mes,
            }),
        });

        // console.log(response);

        const { datos } = await response.json();

        return datos[0];
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
                <View elevation={2} style={{ backgroundColor: '#fff', height: 95 }}>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'aller-lt', fontSize: 15, marginBottom: 5, marginTop: 15 }}>Selecciona el mes a consultar</Text>
                        <View style={{ borderColor: '#cacaca', borderWidth: 1, borderRadius: 5, width: 160 }}>
                            <Picker
                                mode='dropdown'
                                selectedValue={this.state.mes}
                                style={{ height: 40, width: 160 }}
                                onValueChange={async (value) => {
                                    this.setState({ mes: value });
                                    await this.componentDidMount()
                                }}
                            >
                                <Picker.Item label="Enero" value={1} />
                                <Picker.Item label="Febrero" value={2} />
                                <Picker.Item label="Marzo" value={3} />
                                <Picker.Item label="Abril" value={4} />
                                <Picker.Item label="Mayo" value={5} />
                                <Picker.Item label="Junio" value={6} />
                                <Picker.Item label="Julio" value={7} />
                                <Picker.Item label="Agosto" value={8} />
                                <Picker.Item label="Septiembre" value={9} />
                                <Picker.Item label="Octubre" value={10} />
                                <Picker.Item label="Noviembre" value={11} />
                                <Picker.Item label="Diciembre" value={12} />
                            </Picker>
                        </View>
                    </View>

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
                <View style={{ flex: 1 }}>
                    {
                        this.state.isLoading ?
                            <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} />
                            :
                            <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}
                                refreshControl={this._refreshControl()}
                            >
                                <View style={{ marginBottom: 15 }}>

                                    {!this.state.isLoading && this.state.hasRecords &&
                                        this.state.geofences.map((a, i) => {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    onPress={() => this.props.navigation.navigate('GeofenceAlerts', { id_geocerca: a.id_geocerca, nombre: a.nombre, id_propietario: this.state.id_propietario, mes: this.state.mes })}
                                                >
                                                    <Card wrapperStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View
                                                            style={{
                                                                flex: 3,
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                            }}>
                                                            <Icon type='material-community' name="map" size={38} iconStyle={{ flex: 1, marginHorizontal: 5 }} />
                                                            <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, }}>{a.nombre}</Text>
                                                        </View>
                                                        <View
                                                            style={{
                                                                flex: 2,
                                                                flexDirection: 'column',
                                                                justifyContent: 'center',
                                                                alignItems: 'flex-start'
                                                            }}
                                                        >
                                                            <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 15, marginLeft: 5 }}>Salidas: {a.salidas}</Text>
                                                            <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 15, marginLeft: 5 }}>Entradas: {a.entradas}</Text>
                                                            {/* <Icon name='check-circle' size={14} color='#20d447' iconStyle={{ position: 'absolute', right: -24, top: 0 }} />
                                                        <Icon type='font-awesome' name='car' size={18} iconStyle={{ marginHorizontal: 5 }} />
                                                        <Text style={{ fontFamily: 'aller-bd', fontSize: 10, marginBottom: 1 }}>{a.vehiculo.nombre}</Text>
                                                        <Text style={{ fontFamily: 'aller-lt', fontSize: 9, }}>{a.vehiculo.placas}</Text> */}
                                                        </View>
                                                    </Card>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </View>
                            </ScrollView>
                    }
                </View>
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
