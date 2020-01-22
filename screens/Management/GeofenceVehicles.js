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
    TouchableNativeFeedback,
    Alert,
    RefreshControl
} from 'react-native';

import { Button, Card, Overlay, CheckBox, Icon } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

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
            const { datos } = await result.json();

            return {
                id: id_unidad,
                nombre: `${datos[0].marca} ${datos[0].modelo}`,
                placas: datos[0].placas,
                color: datos[0].color.includes('#') ? datos[0].color : '#a8a8a8',
                imagen: datos[0].foto.replace('/var/www/html', 'http://35.203.42.33')
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
                const result = await fetch('http://35.203.42.33:3006/webservice/actualizar_entrada_salida_unidad', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_id_unidad: this.state.vehiculo.id,
                        p_id_geocercas: this.state.id_geocerca,
                        p_id_propietario: this.state.id_propietario,
                        p_alertaentrada: this.state.entrada ? 1 : 0,
                        p_alertasalida: this.state.salida ? 1 : 0
                    }),
                });

                const { datos, msg } = await result.json();

                if (msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    console.error(msg);
                    this.props.navigation.goBack();
                } else if (datos) {
                    this.setState({
                        seleccionado: false,
                        asignacionRealizada: true
                    });
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

    _eliminarVehiculo(id) {
        Alert.alert('Atención', 'Esta seguro que desea eliminar el vehículo de ésta geocerca', [
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancelar eliminar vehículo.'),
                style: 'cancel',
            },
            {
                text: 'Aceptar',
                onPress: () => this._eliminarVehiculoWS(id)
            },
        ], { cancelable: false });
    }

    async _eliminarVehiculoWS(id) {
        try {
            const response = await fetch('http://35.203.42.33:3006/webservice/desvincular_unidad_geocerca', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_id_unidad: id,
                    p_id_geocercas: this.state.id_geocerca,
                    p_id_propietario: this.state.id_propietario
                })
            })
            const { datos, msg } = await response.json();

            const { sp_desvincular_unidad_geocerca } = datos[0];

            if (msg) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
                console.log(msg);
            } else if (sp_desvincular_unidad_geocerca) {
                Alert.alert('Información', 'Se desvinculó el vehículo de la geocerca exitosamente.');
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
            console.log(error);
        }
    }

    async _obteberTiposAlerta(vehiculo) {
        try {
            const response = await fetch('http://35.203.42.33:3006/webservice/valida_entrada_salida_unidad', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_id_unidad: vehiculo.id,
                    p_id_geocercas: this.state.id_geocerca,
                    p_id_propietario: this.state.id_propietario
                })
            });

            const { datos, msg } = await response.json();

            const { alertaentrada, alertasalida } = datos[0];

            if (msg) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
                console.log(msg);
            } else if (datos) {
                this.setState({
                    entrada: alertaentrada == 1,
                    salida: alertasalida == 1,
                    vehiculo: vehiculo,
                    seleccionado: true
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.')
            console.log(error);
        }
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
                                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'aller-lt', fontSize: 16 }}>Las alertas se actualizarón exitosamente.</Text>
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
                <View elevation={2} style={{ backgroundColor: '#fff', height: 70 }}>
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
                                                    {/* <View style={{ flexDirection: 'column', backgroundColor: '#cacaca'}}>
                                                        
                                                        
                                                    </View> */}
                                                    <TouchableNativeFeedback
                                                        background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                                                        onPress={async () => await this._obteberTiposAlerta(v)}
                                                    >
                                                        <View style={{ position: 'absolute', top: -5, right: -5 }}>
                                                            <MaterialCommunityIcons
                                                                name='square-edit-outline'
                                                                size={32}
                                                            />
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                    <TouchableNativeFeedback
                                                        background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                                                        onPress={() => this._eliminarVehiculo(v.id)}
                                                    >
                                                        <View style={{ position: 'absolute', bottom: -5, right: -5 }}>
                                                            <MaterialIcons
                                                                name='delete'
                                                                size={32}
                                                            />
                                                        </View>
                                                    </TouchableNativeFeedback>
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
