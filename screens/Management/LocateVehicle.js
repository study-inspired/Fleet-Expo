/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
} from 'react-native';

import { Button } from 'react-native-elements'

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const vehiculos = [
    {
        nombre: 'Chevrolet Aveo',
        imagen: 'http://www.cosasdeautos.com.ar/wp-content/uploads/2011/06/aveo2012-mexico-3.jpg',
        placa: 'COL-6462J',
        color: '#948d8d'
    },
    {
        nombre: 'NISSAN Versa',
        imagen: 'https://dealerimages.dealereprocess.com/image/upload/c_limit,f_auto,fl_lossy/v1/svp/Pix_PNG1280/2017/17nissan/17nissanversasedansv2a/nissan_17versasedansv2a_frontview',
        placa: 'COL-1684D',
        color: '#ffffff'
    },
    {
        nombre: 'Chevrolet Beat',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/812y-rC3v0L._SX425_.jpg',
        placa: 'COL-4568R',
        color: '#c72020'
    },
]

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

    state = {
        vehiculo: '',
        nextScreen: this.props.navigation.getParam('nextScreen', '')
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.subHeader}>
                    <Text style={[styles.textoBold, { marginVertical: 25, flex: 5 }]}>Seleccione el vehículo a consultar</Text>
                    <Button
                        type='clear'
                        icon={{
                            name: "help",
                            size: 32,
                            color: '#ff8834'
                        }}
                        containerStyle={{ flex: 1 }}
                        buttonStyle={{
                            position: 'absolute',
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
                <Picker
                    style={{
                        height: 40,
                        marginVertical: 5,
                        marginLeft: 7
                    }}
                    selectedValue={this.state.vehiculo}
                    onValueChange={vehiculo => this.setState({ vehiculo: vehiculo })}>
                    <Picker.Item label="Vehículo..." />
                    {
                        vehiculos.map(v => {
                            return (
                                <Picker.Item label={`${v.nombre} - ${v.placa}`} value={v.placa} key={v.placa} />
                            )
                        })
                    }
                </Picker>
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
        height: 70, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginLeft: 16 
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16
    },
});