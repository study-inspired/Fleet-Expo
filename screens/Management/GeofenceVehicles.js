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
    Image,
    TouchableOpacity,
    Alert,
    RefreshControl
} from 'react-native';

import { Button, Card, Overlay, CheckBox, Icon } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';

export default class GeofenceVehicles extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: `Geocerca: ${navigation.getParam('nombre_geocerca', '')}`,
            headerTitleStyle: {
                flex: 1,
                textAlign: "center",
                fontFamily: 'aller-bd',
                fontWeight: '200',
                fontSize: 18,
            },
            headerRight: <View></View>
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true,
            hasVehicles: false,
            vehicles: [],
            vehiculo: {},
            seleccionado: false,
            asignacionRealizada: false,
            entrada: false,
            salida: false,
            id_geocerca: this.props.navigation.getParam('id_geocerca', 0),
            id_propietario: this.props.navigation.getParam('id_propietario', 0),
        }
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/obtener_unidades_geocercas', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_id_geocercas: this.state.id_geocerca,
                        p_id_propietario: this.state.id_propietario,
                    }),
                })

                const data = await result.json();
                console.log(data);

                if (data.datos.length != 0) {
                    let vehicles = data.datos.map(async v => {
                        let unidad = await this._datosUnidad(v.id_unidad);
                        return unidad;
                    });
                    Promise.all(vehicles).then(completed => {
                        this.setState({
                            hasVehicles: true,
                            vehicles: completed,
                            isLoading: false
                        });
                    });
                } else {
                    Alert.alert('Información', 'No hay vehiculos asignados a esta geocerca.');
                    this.props.navigation.goBack();
                }
            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
                this.props.navigation.goBack();
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async _datosUnidad(id_unidad) {
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/datos_unidad', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    in_id_unidad: id_unidad,
                }),
            });
            const data = await result.json();
            return {
                id: id_unidad,
                nombre: `${data.datos[0].marca} ${data.datos[0].modelo}`,
                placas: data.datos[0].placas,
                color: data.datos[0].color.includes('#') ? data.datos[0].color : '#a8a8a8',
                imagen: data.datos[0].foto.replace('/var/www/html', 'http://35.203.42.33')
            };
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
        }
    }

    async assign() {
        if (!this.state.entrada && !this.state.salida) {
            Alert.alert('Campos requeridos!', 'Selecciona al menos un tipo de alerta.');
        } else {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/interfaz126/asignar_unidad_geocerca', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_id_unidad: this.state.vehiculo.id,
                        p_id_geocercas: this.state.id_geocerca
                    }),
                });

                console.log(result);

                const datos = await result.json();
                if (datos) {
                    if (datos.msg) {
                        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                        console.error(datos.msg);
                        this.props.navigation.goBack();
                    } else if (datos.datos) {
                        this.setState({
                            seleccionado: false,
                            asignacionRealizada: true
                        });
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
                this.props.navigation.goBack();
            }
        }
    }

    //Refresh control  
    _refreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this._refreshListView()}
            />
        )
    }

    _refreshListView() {
        this.setState({ refreshing: true }) //Start Rendering Spinner
        this.componentDidMount()  //<-- Recargo el refresh control
        this.setState({ refreshing: false }) //Stop Rendering Spinner
    }
    //Termina el refresh  

    _eliminarVehiculo() {
        Alert.alert('Atención', 'Esta seguro que desea eliminar el vehículo de ésta geocerca', [
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancelar eliminar vehículo'),
                style: 'cancel',
            },
            {
                text: 'Aceptar',
                onPress: () => this._eliminarVehiculoWS()
            },
        ], { cancelable: false });
    }

    _eliminarVehiculoWS() {
        console.log('Aceptar eliminar vehículo.');
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Overlay
                    overlayStyle={{ width: 350 }}
                    isVisible={this.state.seleccionado}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                    onBackdropPress={() => this.setState({ vehiculo: {}, seleccionado: false, entrada: false, salida: false })}
                >
                    <View>
                        {/* <Button
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
                            onPress={() => this.setState({ vehiculo: {}, seleccionado: false, entrada: false, salida: false })}
                        /> */}
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'aller-lt', fontSize: 16 }}>Has seleccionado el vehículo:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.texto700}>{this.state.vehiculo.nombre}</Text>
                                <View style={{ width: 16, height: 16, marginTop: 14, marginLeft: 5, marginRight: 5, backgroundColor: this.state.vehiculo.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                <Text style={styles.texto600}>- {this.state.vehiculo.placas}</Text>
                            </View>
                            <Image
                                style={{
                                    width: 92,
                                    height: 92,
                                    marginLeft: 5
                                }}
                                resizeMode="cover"
                                source={{ uri: this.state.vehiculo.imagen }}
                            />
                        </View>
                        <View>
                            <View style={{ flexDirection: "row" }}>
                                <CheckBox
                                    containerStyle={{ flex: 1 }}
                                    textStyle={{ fontSize: 12 }}
                                    title='Enviar alerta entrada'
                                    checked={this.state.entrada}
                                    onPress={() => this.setState({ entrada: !this.state.entrada })}
                                />
                                <CheckBox
                                    containerStyle={{ flex: 1 }}
                                    textStyle={{ fontSize: 12 }}
                                    title='Enviar alerta salida'
                                    checked={this.state.salida}
                                    onPress={() => this.setState({ salida: !this.state.salida })}
                                />
                            </View>
                            <Button
                                title='Realizar asignación'
                                buttonStyle={{ marginVertical: 10, marginHorizontal: 13, backgroundColor: '#ff8834' }}
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                onPress={this.assign.bind(this)}
                            />
                        </View>
                    </View>
                </Overlay>
                <Overlay
                    overlayStyle={{ width: 300 }}
                    isVisible={this.state.asignacionRealizada}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                    onBackdropPress={() => this.setState({ vehiculo: {}, seleccionado: false, asignacionRealizada: false, entrada: false, salida: false })}
                >
                    <View>
                        {/* <Button
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
                            onPress={() => this.setState({ vehiculo: {}, seleccionado: false, asignacionRealizada: false, entrada: false, salida: false })}
                        /> */}
                        <View style={{ justifyContent: 'center' }}>
                            <Icon
                                name='check-circle'
                                color='#20d447'
                                size={92}
                            />
                        </View>
                        <View>
                            <View>
                                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'aller-lt', fontSize: 16 }}>Vehículo asignado a geocerca exitosamente!</Text>
                            </View>
                            <Button
                                title='Siguiente'
                                buttonStyle={{ marginVertical: 10, marginHorizontal: 13, backgroundColor: '#ff8834' }}
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                onPress={() => { this.setState({ asignacionRealizada: false }); this.props.navigation.goBack() }}
                            />
                        </View>
                    </View>
                </Overlay>
                <View elevation={2} style={{ height: 70, flexDirection: 'row', justifyContent: 'space-between' }}>
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
                {
                    this.state.isLoading ?
                        <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} />
                        :
                        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView} refreshControl={this._refreshControl()}>
                            <View style={{ marginBottom: 15 }}>
                                {!this.state.isLoading && this.state.hasVehicles &&
                                    this.state.vehicles.map(v => {
                                        return (
                                            <Card key={v.id}>
                                                <View
                                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Image
                                                            style={{ width: 50, height: 50, alignSelf: 'flex-start' }}
                                                            resizeMode="cover"
                                                            source={{ uri: v.imagen }}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 4,
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={styles.texto700}>{v.nombre}</Text>
                                                            <View style={{ width: 16, height: 16, marginTop: 14, marginLeft: 5, backgroundColor: v.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                        </View>
                                                        <Text style={{ fontFamily: 'aller-lt', fontSize: 12, marginBottom: 10 }}>{v.placas}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'column' }}>
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({ vehiculo: v, seleccionado: true })}
                                                            style={{ position: 'absolute', bottom: 3, right: 0 }}
                                                        >
                                                            <Icon
                                                                type='font-awesome'
                                                                name='edit'
                                                                size={30}
                                                            />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this._eliminarVehiculo(v.id)}
                                                            style={{ position: 'absolute', top: 5, right: 2 }}
                                                        >
                                                            <Icon
                                                                type='material'
                                                                name='delete'
                                                                size={32}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </Card>
                                        );
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
    },
    texto700: {
        marginTop: 10,
        fontFamily: 'aller-bd',
        fontSize: 16,
        marginBottom: 5
    },
    texto600: {
        marginTop: 10,
        fontFamily: 'aller-lt',
        fontSize: 16,
        marginBottom: 5
    },
});
