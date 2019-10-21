import React from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Button, Slider, Overlay, Icon, Input } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';

export default class TraceRadius extends React.Component {
    state = {
        setNombre: false,
        registrado: false,
        nombre: '',
        LatLng: null,
        radio: 1000,
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

    async registerRadius() {
        if (this.state.nombre = ! '') {
            try {
                const result = await fetch('http://192.168.1.56:3000/webservice/interfaz119/registrar_geocerca', {
                    method: 'POST',
                    body: {
                        nombre: this.state.nombre,
                        coordenadas: JSON.stringify(this.state.LatLng),
                        radio: this.state.radio
                    }
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
                    <Text style={styles.texto1}>Indica un punto central e incrementa el radio de acuerdoal área a abarcar</Text>
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
                <MapView
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: 19.245455,
                        longitude: -103.722538,
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