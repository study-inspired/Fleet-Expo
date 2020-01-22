import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Alert, ActivityIndicator, RefreshControl, Text, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { Table, Row, Rows, } from 'react-native-table-component';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

export default class GeofenceAlertsDetails extends Component {

    /**
     * Checar las variables ya que estas son las que insertaran datos ya que no se escriben bien
     */
    static navigationOptions = {
        title: 'Entradas y salidas de geocerca',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
            marginLeft: -30
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true,
            hasAlerts: false,
            tableHead: ['Tipo', 'Hora', 'Fecha', 'Ubicación'],
            widthArr: [70, 90, 105, 100],
            vehicle: this.props.navigation.getParam('vehicle', {}),
            data: [],
            id_geocerca: this.props.navigation.getParam('id_geocerca', 0),
            mes: this.props.navigation.getParam('mes', 0)
        }
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const response = await fetch('http://35.203.42.33:3006/webservice/entradas_salidas_detalle', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        in_id_unidad: this.state.vehicle.id,
                        in_id_geocerca: this.state.id_geocerca,
                        in_mes: this.state.mes 
                    }),
                })

                const { datos, msg } = await response.json();

                if (msg) {
                    Alert.alert('Error', 'Servicio no disponible, intenete de nuevo más tarde.');
                    console.error(msg);
                } else if (datos.length != 0) {
                    let alerts = datos.map((d) => {
                        let tipo = d.descripcion_alerta.charAt(0).toUpperCase()+d.descripcion_alerta.slice(1, d.descripcion_alerta.length);
                        let hora = d.fecha_hora.slice(11, 19);
                        let fecha = d.fecha_hora.slice(0, 10).split('-').reverse().join('/');
                        let coordenadas = d.coordenadas.split(',');
                        return [
                            tipo,
                            hora,
                            fecha,
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('GeofenceAlertsDetailsMap', { 
                                        tipo: tipo,
                                        hora: hora,
                                        fecha: fecha,
                                        coordenadas: {latitude: +coordenadas[0], longitude: +coordenadas[1]} 
                                    })
                                }}
                            >
                                <Icon
                                    type='material-community'
                                    name='map-marker'
                                    size={24}
                                    color='#ffbb00'
                                />
                            </TouchableOpacity>
                        ]
                    });
                    this.setState({
                        hasAlerts: true,
                        data: alerts,
                        isLoading: false
                    });
                } else {
                    Alert.alert('Info', 'No hay datos.!');
                    this.setState({
                        isLoading: false
                    });
                }

            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intenete de nuevo más tarde.');
                console.error(error);
                this.setState({
                    isLoading: false
                });
            }
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

    render() {
        const state = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ height: 130, flexDirection: 'row', alignContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: "center", alignSelf: 'center' }}>
                        <Icon type='font-awesome' name="map-signs" size={52} containerStyle={{ flex: 1, marginTop: 20 }} />
                        <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 16, marginTop: 20, textAlign: "center" }}>Nombre de geocerca: {this.props.navigation.getParam('nombre', 'Geocerca')}</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', height: 30 }}>
                            <Text style={[{ fontFamily: 'aller-lt', fontSize: 16 }]}>{state.vehicle.nombre}</Text>
                            <View style={{ width: 16, height: 16, marginTop: 2, marginLeft: 5, marginRight: 5, backgroundColor: state.vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                            <Text style={[{ fontFamily: 'aller-lt', fontSize: 16 }]}>- {state.vehicle.placas}</Text>
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
                <ScrollView
                    refreshControl={this._refreshControl()}
                >
                    <View style={{ margin: 4 }} style={{ alignSelf: 'center' }} >
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Row data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={[styles.text, { fontFamily: 'aller-bd' }]} />
                        </Table>
                        {state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={state.isLoading} />}
                        {!state.isLoading && state.hasAlerts &&
                            <View style={{ flex: 1 }}>
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                        <Rows data={state.data} widthArr={state.widthArr} textStyle={[styles.text, { fontFamily: 'aller-lt' }]} />
                                    </Table>
                                </ScrollView>
                            </View>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 35, backgroundColor: '#f1f8ff' },
    text: { margin: 6, fontSize: 14 },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
    view1: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center"
    }
});
