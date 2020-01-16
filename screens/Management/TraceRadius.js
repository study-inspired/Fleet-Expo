import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Button, Slider, Overlay, Icon, Input } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class TraceRadius extends React.Component {
    state = {
        isLoading: true,
        setNombre: false,
        registrado: false,
        nombre: '',
        location: null,
        LatLng: null,
        radio: 5000,
    }

    static navigationOptions = {
        title: 'Trazar en modo radio',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>
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
                LatLng: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                },
                isLoading: false
            });
        }
    }

    async registerRadius() {
        if (this.state.nombre.length = !0) {
            try {
                let mm = [[this.state.LatLng.latitude, this.state.LatLng.longitude], [this.state.radio/1000]];
                console.log(JSON.stringify(mm));
                
                const result = await fetch('http://35.203.42.33:3006/webservice/interfaz119/registrar_geocerca', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        p_nombre: this.state.nombre,
                        p_coordenadas: mm,
                        p_id_tipo_geocerca: 0,
                        p_id_usuario: 2
                    })
                })

                const data = await result.json();
                console.log(data);

                if (data.msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    console.error(data.msg);
                } else {
                    this.setState({
                        setNombre: false,
                        registrado: true
                    })
                }

            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
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
                                    onPress={this.registerRadius.bind(this)}
                                />
                            </View>
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
                <View style={{ height: 110, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.texto1}>Indica un punto central e incrementa el radio de acuerdo al área a abarcar</Text>
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
                        onPress={e => this.setState({ LatLng: e.nativeEvent.coordinate })}
                    >
                        {
                            this.state.LatLng &&
                            <MapView.Marker
                                coordinate={this.state.LatLng}
                                title='Centro'
                            />

                        }

                        {
                            this.state.LatLng &&
                            <Circle
                                center={this.state.LatLng}
                                radius={this.state.radio}
                                strokeWidth={2}
                            />
                        }
                    </MapView>
                }

                <View style={{ felx: 1, bottom: 10 }}>
                    <Slider
                        value={this.state.radio}
                        onValueChange={radio => this.setState({ radio })}
                        minimumValue={1000}
                        maximumValue={20000}
                        style={styles.slider}
                    />
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
                        onPress={() => this.setState({ LatLng: null, radio: 1000 })}
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
        marginBottom: 15
    },
    texto1: {
        fontSize: 16,
        fontFamily: 'aller-lt',
        textAlign: 'center',
        marginHorizontal: 32,
        marginTop: 65
    },
    slider: {
        marginHorizontal: 15
    }
});