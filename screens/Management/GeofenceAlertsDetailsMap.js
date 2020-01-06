import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Alert, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const datos = [
    { tipo: "Entrada", hora: "12:24:05", fecha: "20/09/2019" },
    { tipo: "Salida", hora: "10:24:05", fecha: "25/09/2019" },
    { tipo: "Salida", hora: "12:24:05", fecha: "30/09/2019" }
];

export default class GeofenceAlertsDetailsMap extends Component {

    /**
     * Checar las variables ya que estas son las que insertaran datos ya que no se escriben bien
     */

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true,
            hasAlerts: false,
            tableHead: ['Tipo', 'Hora', 'Fecha', 'Ubicación'],
            widthArr: [70, 90, 105, 100],
            data: datos.map(val => {
                return [
                    val.tipo,
                    val.hora,
                    val.fecha,
                    <Icon onPress={() => this.props.navigation.navigate('Interfaz', { vehicle: this.state.vehicle })} type='material' name='remove-red-eye' size={18} />
                ];
            })
        }
    }

    static navigationOptions = {
        title: 'Entradas y salidas de geocerca',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
            marginLeft: -10
        }
    }

    async componentDidMount() {

        this.setState({
            hasAlerts: true,
            isLoading: false
        });
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
                <View style={{ height: 120, flexDirection: 'row', alignContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: "center", alignSelf: 'center' }}>
                    <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 18, marginVertical: 5, textAlign: "center" }}>Acción en Geocerca </Text>
                        <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 16, marginVertical: 5, textAlign: "center" }}>Tipo:  </Text>
                        <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 14, marginVertical: 5, textAlign: "center" }}>Hora: - Fecha: </Text>
                    </View>
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
                            right: 0
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
                <MapView
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: 19.245455,
                        longitude: -103.722538,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    style={styles.mapView}
                />
            </View>
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
    },
    mapView: {
        flex: 1,
        height: 350
    }
});
