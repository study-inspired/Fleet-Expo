import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Button, Input, Overlay, Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class TracePoligon extends React.Component {

    static navigationOptions = {
        title: 'Trazar en modo polígono',
        headerTitleStyle: {
            textAlign: "center",
            flex: 1,
            fontFamily: 'aller-bd',
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    state = {
        isLoading: true,
        location: null,
        setNombre: false,
        registrado: false,
        nombre: '',
        markers: []
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        } else {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                Alert.alert('Atención', 'Es necesario acceder a la ubicación del dispositivo.')
            }

            let location = await Location.getCurrentPositionAsync({});

            this.setState({
                location: location.coords,
                isLoading: false
            });
        }
    }

    addMarker(coordinate) {
        let newMarkers = this.state.markers
        newMarkers.push({ LatLng: coordinate })
        this.setState({ markers: newMarkers })
        //console.log(this.state.markers)
    }

    updateMarker(index, coordinate) {
        let newMarkers = this.state.markers
        newMarkers[index] = { LatLng: coordinate }
        this.setState({ markers: newMarkers })
    }

    async registerPolygon() {
        if (this.state.nombre.length != 0) {
            try {
                const result = await fetch('http://34.95.33.177:3006/webservice/interfaz119/registrar_geocerca', {
                    method: 'POST',
                    body: JSON.stringify({
                        nombre: this.state.nombre,
                        coordenadas: this.state.markers
                    })
                })

                const data = await result.json();
                if (data) {
                    if (datos.msg) {
                        Alert.alert('Hubo un error', datos.msg);
                    } else if (datos.datos) {
                        this.setState({
                            setNombre: false,
                            registrado: true
                        })
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un error.');
            }
        } else {
            Alert.alert('Campo requerido!', 'Escribe el nombre de la geocerca.');
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Overlay
                    overlayStyle={{ width: 350 }}
                    isVisible={this.state.setNombre}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                >
                    <View>
                        <Button
                            type='clear'
                            icon={{
                                type: 'material-community',
                                name: 'window-close',
                                size: 24,
                                color: '#000'
                            }}
                            buttonStyle={{
                                position: 'absolute',
                                top: 0,
                                right: 0
                            }}
                            onPress={() => this.setState({ setNombre: false, nombre: '' })}
                        />
                        <View style={{ alignItems: 'center', marginVertical: 25 }}>
                            <Icon
                                type='material-community'
                                name='vector-polygon'
                                size={92}
                            />
                        </View>
                        <View>
                            <Input
                                label='Nombre de la geocerca trazada:'
                                labelStyle={{ fontFamily: 'aller-lt' }}
                                onChangeText={text => this.setState({ nombre: text })}
                            />
                            <Button
                                title='Siguiente'
                                buttonStyle={{ marginVertical: 10, marginHorizontal: 13, backgroundColor: '#ff8834' }}
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                onPress={this.registerPolygon.bind(this)}
                            />
                        </View>
                    </View>
                </Overlay>
                <Overlay
                    overlayStyle={{ width: 300 }}
                    isVisible={this.state.registrado}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                >
                    <View>
                        <Button
                            type='clear'
                            icon={{
                                type: 'material-community',
                                name: 'window-close',
                                size: 24,
                                color: '#000'
                            }}
                            buttonStyle={{
                                position: 'absolute',
                                top: 0,
                                right: 0
                            }}
                            onPress={() => this.setState({ setNombre: false, registrado: false, nombre: '' })}
                        />
                        <View style={{ justifyContent: 'center' }}>
                            <Icon
                                name='check-circle'
                                color='#20d447'
                                size={92}
                            />
                        </View>
                        <View>
                            <View>
                                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'aller-lt', fontSize: 16 }}>Geocerca registrada exitosamente!</Text>
                            </View>
                            <Button
                                title='Siguiente'
                                buttonStyle={{ marginVertical: 10, marginHorizontal: 13, backgroundColor: '#ff8834' }}
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                onPress={() => { this.setState({ registrado: false }); this.props.navigation.pop(2) }}
                            />
                        </View>
                    </View>
                </Overlay>
                <View style={{ height: 110, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.texto1}>Indica diferentes puntos en el mapa hasta completar el polígono y definir el área deseada</Text>
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
                {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                {
                    !this.state.isLoading &&
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: this.state.location.latitude,
                            longitude: this.state.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        style={styles.mapView}
                        onPress={(e) => this.addMarker(e.nativeEvent.coordinate)}>
                        {
                            this.state.markers.map((m, i) => (
                                <Marker key={i}
                                    draggable
                                    coordinate={m.LatLng}
                                    title={`Punto: ${i + 1}`}
                                    onDragEnd={e => this.updateMarker(i, e.nativeEvent.coordinate)}
                                />
                            ))
                        }
                        {
                            this.state.markers.length > 2 &&
                            <Polygon
                                coordinates={this.state.markers.map(m => {
                                    return m.LatLng
                                })}
                                strokeWidth={2}
                            />
                        }
                    </MapView>
                }

                <View style={{ felx: 1, bottom: 10 }}>
                    <Button
                        title='Registrar geocerca'
                        icon={{ name: 'check-circle', color: 'white' }}
                        buttonStyle={{ marginHorizontal: 15, marginVertical: 5, backgroundColor: '#ff8834' }}
                        titleStyle={{ fontFamily: 'aller-lt' }}
                        onPress={() => this.setState({ setNombre: true })}
                    />
                    <Button
                        title='Volver a trazar'
                        icon={{ name: 'replay', color: 'white' }}
                        buttonStyle={{ marginHorizontal: 15, marginVertical: 5, backgroundColor: '#ff8834' }}
                        titleStyle={{ fontFamily: 'aller-lt' }}
                        onPress={() => this.setState({ markers: [] })}
                    />
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
    },
    mapView: {
        flex: 1,
        marginBottom: 20
    },
    texto1: {
        fontSize: 16,
        fontFamily: 'aller-lt',
        textAlign: 'center',
        marginHorizontal: 16,
        marginTop: 65
    }
});