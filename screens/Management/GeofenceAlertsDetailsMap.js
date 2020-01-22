import React, { Component } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, RefreshControl, Text, TouchableNativeFeedback } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default class GeofenceAlertsDetailsMap extends Component {

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
            coordenadas: {},
            tipo: '',
            hora: '',
            fecha: '',
            concepto: ''
        }
    }

    componentDidMount() {
        this.setState({
            coordenadas: this.props.navigation.getParam('coordenadas', {}),
            tipo: this.props.navigation.getParam('tipo', 'E/S'),
            hora: this.props.navigation.getParam('hora', '00:00:00'),
            fecha: this.props.navigation.getParam('fecha', '00/00/0000'),
            concepto: this.props.navigation.getParam('concepto', ''),
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
                <View elevation={2} style={{ height: 125, flexDirection: 'row', alignContent: 'center', backgroundColor: '#fff' }}>
                    {
                        this.state.concepto == '' ?
                            <View style={{ flex: 1, marginTop: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: "center", alignSelf: 'center' }}>
                                    <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 18, marginVertical: 5, textAlign: "center" }}>Acción en Geocerca </Text>
                                    <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 16, marginVertical: 5, textAlign: "center" }}>Tipo: {this.state.tipo} </Text>
                                    <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 14, marginVertical: 5, textAlign: "center" }}>Hora: {this.state.hora}   -   Fecha: {this.state.fecha} </Text>
                                </View>
                            </View>
                            :
                            <View style={{ flex: 1, marginTop: 25, marginHorizontal: 50 }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: "center", alignSelf: 'center' }}>
                                    <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 16, marginTop: 5, textAlign: "center" }}>Alerta presentada en la siguiente ubicación:</Text>
                                    <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, marginBottom: 5, textAlign: "center" }}>{this.state.concepto}</Text>
                                </View>
                            </View>
                    }

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
                    !this.state.isLoading &&
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: this.state.coordenadas.latitude,
                            longitude: this.state.coordenadas.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        style={styles.mapView}

                    >
                        <MapView.Marker
                            coordinate={this.state.coordenadas}
                            title='Ubicación'
                        />
                    </MapView>
                }
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
