import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Alert,
    ActivityIndicator,
    Dimensions,
    TouchableNativeFeedback
} from 'react-native';
import { Button, Slider, Overlay, Icon, Input } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Circle, Polygon, Marker } from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import Globals from '../../constants/Globals';

export default class TraceGeofence extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            setNombre: false,
            registrado: false,
            nombre: '',
            location: null,
            LatLng: null,
            radio: 5000,
            markers: [],
            id_tipo_geocerca: this.props.navigation.getParam('id_tipo_geocerca', null)
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `Trazado modo ${navigation.getParam('id_tipo_geocerca', null) == 0 ? 'radio' : 'polígono'}`,
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>
    })

    async componentDidMount() {
        if (await this._verificarConexion()) {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                Alert.alert('Atención', 'Es necesario acceder a la ubicación del dispositivo.')
            }

            let { coords } = await Location.getCurrentPositionAsync({});

            this.setState({
                location: coords,
                LatLng: {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                isLoading: false
            });
        }
    }

    _addMarker(coordinate) {
        let newMarkers = this.state.markers
        newMarkers.push({ LatLng: coordinate })
        this.setState({ markers: newMarkers })
        //console.log(this.state.markers)
    }

    _updateMarker(index, coordinate) {
        let newMarkers = this.state.markers
        newMarkers[index] = { LatLng: coordinate }
        this.setState({ markers: newMarkers })
    }

    async _verificarConexion() {
        const { isConnected } = await NetInfo.fetch();
        if (!isConnected) {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
            return false;
        } else {
            return true;
        }
    }

    async _verificarNombre() {
        if (this.state.nombre.length = !0) {
            try {
                const response = await fetch(`${Globals.server}:3006/webservice/obtener_geocercas1`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        in_propietario: 2
                    })
                });

                const { datos, msg } = await response.json();
                if (msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    console.error(msg);
                } else {
                    return datos.length != 0 ? !datos.some(geocerca => geocerca.nombre == this.state.nombre) : true;
                }
            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
            }
        } else {
            Alert.alert('Campo requerido!', 'Escribe el nombre de la geocerca.');
            return false;
        }
    }

    async _registrarGeocerca() {
        if (await this._verificarNombre()) {
            try {
                let coordenadas;
                if (this.state.id_tipo_geocerca == 0) {
                    coordenadas = JSON.stringify([[this.state.LatLng.latitude, this.state.LatLng.longitude], [this.state.radio / 1000]]);
                    console.log(JSON.stringify([[this.state.LatLng.latitude, this.state.LatLng.longitude], [this.state.radio / 1000]]));
                    
                } else {
                    let markers = this.state.markers.map(m => { return ([m.LatLng.latitude, m.LatLng.longitude]) });
                    coordenadas = JSON.stringify([...markers, markers[0]]);
                }
                console.log(coordenadas);

                const response = await fetch(`${Globals.server}:3006/webservice/interfaz119/registrar_geocerca`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        p_nombre: this.state.nombre,
                        p_coordenadas: coordenadas,
                        p_id_tipo_geocerca: this.state.id_tipo_geocerca,
                        p_id_usuario: 2
                    })
                })

                // console.log({
                //     p_nombre: this.state.nombre,
                //     p_coordenadas: coordenadas,
                //     p_id_tipo_geocerca: this.state.id_tipo_geocerca,
                //     p_id_usuario: 2
                // });

                const result = await response.json();
                // console.log(result);

                if (result.msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    console.error(result.msg);
                } else {
                    if (result.datos[0].sp_registrar_geocerca.includes('1')) {
                        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    } else {
                        this.setState({
                            setNombre: false,
                            registrado: true
                        });
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
            }
        } else {
            Alert.alert('Verifique el nombre', 'Ya existe una geocerca registrada con el nombre proporcionado.');
        }
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <Overlay
                    overlayStyle={{ width: 350 }}
                    isVisible={this.state.setNombre}
                    animationType='fade'
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                    onBackdropPress={() => this.setState({ setNombre: false, nombre: '' })}
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
                        <View>
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
                                    titleStyle={{ fontFamily: 'aller-lt' }}
                                    buttonStyle={{ marginVertical: 10, marginHorizontal: 13, backgroundColor: '#ff8834' }}
                                    onPress={this._registrarGeocerca.bind(this)}
                                />
                            </View>
                        </View>
                    </View>
                </Overlay>
                <Overlay
                    overlayStyle={{ width: 300 }}
                    isVisible={this.state.registrado}
                    animationType='fade'
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
                        <View>
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
                    </View>
                </Overlay>
                <View elevation={2} style={{ backgroundColor: '#fff', height: 110 }}>
                    {
                        this.state.id_tipo_geocerca == 0 ?
                            <Text style={[styles.texto1, { marginHorizontal: 32 }]}>Indica un punto central e incrementa el radio de acuerdo al área a abarcar</Text>
                            :
                            <Text style={[styles.texto1, { marginHorizontal: Dimensions.get('window').width > 360 ? 16 : 2, }]}>Indica diferentes puntos en el mapa hasta completar el polígono y definir el área deseada</Text>
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
                    this.state.isLoading ?
                        <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={styles.mapView} />
                        :
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: this.state.location.latitude,
                                longitude: this.state.location.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            style={styles.mapView}
                            onPress={e => this.state.id_tipo_geocerca == 0 ? this.setState({ LatLng: e.nativeEvent.coordinate }) : this._addMarker(e.nativeEvent.coordinate)}
                        >
                            {
                                this.state.LatLng && this.state.id_tipo_geocerca == 0 &&
                                <Marker
                                    coordinate={this.state.LatLng}
                                    title='Centro'
                                />
                            }

                            {
                                this.state.LatLng && this.state.id_tipo_geocerca == 0 &&
                                <Circle
                                    center={this.state.LatLng}
                                    radius={this.state.radio}
                                    strokeWidth={2}
                                />
                            }

                            {
                                this.state.id_tipo_geocerca == 1 &&
                                this.state.markers.map((m, i) => (
                                    <Marker key={i}
                                        draggable
                                        coordinate={m.LatLng}
                                        title={`Punto: ${i + 1}`}
                                        onDragEnd={e => this._updateMarker(i, e.nativeEvent.coordinate)}
                                    />
                                ))
                            }

                            {
                                this.state.id_tipo_geocerca == 1 && this.state.markers.length > 2 &&
                                <Polygon
                                    coordinates={this.state.markers.map(m => {
                                        return m.LatLng
                                    })}
                                    strokeWidth={2}
                                />
                            }
                        </MapView>
                }

                <View elevation={4} style={{ felx: 1, paddingBottom:10, backgroundColor: '#fff' }}>
                    {
                        this.state.id_tipo_geocerca == 0 &&
                        <Slider
                            value={this.state.radio}
                            onValueChange={radio => this.setState({ radio })}
                            minimumValue={1000}
                            maximumValue={20000}
                            style={styles.slider}
                            thumbStyle={{ backgroundColor: '#ff8834' }}
                        />
                    }
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
                        onPress={() => this.state.id_tipo_geocerca == 0 ? this.setState({ LatLng: null, radio: 5000 }) : this.setState({ markers: [] })}
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
        flex: 1
    },
    texto1: {
        fontSize: 16,
        fontFamily: 'aller-lt',
        textAlign: 'center',
        marginTop: 65
    },
    slider: {
        marginHorizontal: 15
    }
});