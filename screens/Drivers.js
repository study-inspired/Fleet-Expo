/**
 * @format
 * @flow
**/

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    StatusBar,
    Alert,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { Button, colors, Card, Icon, Overlay } from 'react-native-elements'
import NetInfo from '@react-native-community/netinfo'

export default class Drivers extends React.Component {
    static navigationOptions = {
        title: 'Conductores',
        headerStyle: {
            elevation: 4,
            backgroundColor: '#ec6a2c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontFamily: 'aller-bd',
            fontWeight: '200',
            textAlign: "center",
            flex: 1,
        },
    }

    state = {
        refreshing: false,
        isLoading: true,
        hasDrivers: false,
        drivers: {},
        comenting: false,
        comentario: '',
        id_chofer: 0
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/interfaz/obtener_unidades_conductores_de_propietario', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        in_id_propietario: 2
                    }),
                })

                const data = await result.json();

                if (data.datos.length != 0) {
                    let drivers = data.datos.map(async (d) => {
                        let unidad = (d.id_unidad != null) ? await this._datosUnidad(d.id_unidad) : null;
                        let { nombre, fotografia } = await this._datosUsuario(d.id_chofer1);
                        return {
                            id_propietario: d.id_propietario,
                            id_chofer: d.id_chofer1,
                            nombre: nombre,
                            unidad: unidad,
                            fotografia: fotografia
                        }
                    })
                    Promise.all(drivers).then( completed => {
                        this.setState({
                            hasDrivers: true,
                            drivers: completed,
                            isLoading: false
                        });
                    });
                } else {
                    Alert.alert('Info', 'No hay conductores!');
                    this.setState({
                        isLoading: false
                    });
                }

            } catch (error) {
                Alert.alert('Error', 'Hubo un error.')
                console.error(error);
                this.setState({
                    isLoading: false
                });
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async _datosUsuario(id_usuario_chofer) {
        try {
            const result = await fetch(`http://35.203.42.33:3006/webservice/datos_conductor`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: id_usuario_chofer
                }),
            })

            const datos = await result.json();

            if (datos.datos.length > 0) {
                return {
                    nombre: `${datos.datos[0].nombre.split(' ')[0]} ${datos.datos[0].apellido.split(' ')[0]}`,
                    fotografia: datos.datos[0].fotografia
                }
            } else {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                this.props.navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
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
                id_unidad: id_unidad,
                marca: data.datos[0].marca,
                modelo: data.datos[0].modelo,
                placas: data.datos[0].placas,
                color: data.datos[0].color
            };
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
        }
    }

    async desvincularVehiculo(unidad, chofer) {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/interfaz69/desvincular_vehiculo', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_id_unidad: unidad,
                        p_id_propietario: 2,
                        p_id_chofer1: chofer
                    }),
                })

                const datos = await result.json();
                if (datos) {
                    if (datos.msg) {
                        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                        console.error(datos.msg);
                    } else if (datos.datos) {
                        console.log(datos);

                        Alert.alert('Operación exitosa!', 'Se desvinculó el vehículo correctamente.')
                    }
                    this.props.navigation.goBack();
                }

            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async _agregarComentario() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/registrar_comentario_jefe_chofer', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        in_id_jefe: 2,
                        in_id_usuario: this.state.id_chofer,
                        in_comentario: this.state.comentario
                    }),
                })

                const datos = await result.json();
                if (datos) {
                    if (datos.msg) {
                        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                        console.error(datos.msg);
                    } else if (datos.datos) {
                        Alert.alert('Operación exitosa!', 'Se agregó el comentario correctamente.')
                    }
                    this.setState({ comenting: false });
                }

            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
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
        return (!this.state.loading &&
            <SafeAreaView style={{ flex: 1 }}>
                <Overlay
                    overlayStyle={{ width: 330 }}
                    isVisible={this.state.comenting}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                    onBackdropPress={() => { this.setState({ comenting: false, comentario: '' }); }}
                >
                    <View>
                        <Text style={{ fontFamily: 'aller-lt', textAlign: 'center', fontSize: 16, marginTop: 5 }}>Agrega un comentario sobre el conductor</Text>
                        <View
                            style={{
                                borderColor: '#cacaca',
                                borderWidth: 2,
                                borderRadius: 3,
                                marginVertical: 10
                            }}
                        >
                            <TextInput
                                multiline
                                autoFocus={true}
                                numberOfLines={10}
                                onChangeText={text => this.setState({ comentario: text })}
                                style={{
                                    textAlignVertical: 'top',
                                    marginHorizontal: 10,
                                    marginVertical: 5,
                                    fontFamily: 'aller-lt'
                                }}
                            />
                        </View>
                        <Button
                            title='Enviar'
                            buttonStyle={{ backgroundColor: '#ff8834' }}
                            titleStyle={{ fontFamily: 'aller-lt' }}
                            onPress={() => this._agregarComentario()}
                        />
                    </View>
                </Overlay>
                <StatusBar backgroundColor="#ff8834" barStyle="light-content" />
                <View elevation={2} style={styles.sectionContainer}>
                    <Button
                        type='clear'
                        icon={{
                            name: "add-circle",
                            size: 32,
                            color: colors.primary
                        }}
                        buttonStyle={{
                            position: 'absolute',
                            flexDirection: 'column',
                            alignSelf: 'center',
                            top: -10
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            fontFamily: 'aller-lt',
                            flex: 1,
                            fontSize: 16
                        }}
                        title="Agregar conductor"
                        onPress={() => { this.props.navigation.navigate('AddDriver', { id_propietario: 2 }) }}
                    />

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
                            justifyContent: 'center',
                            right: 0,
                            top: -10
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            fontFamily: 'aller-lt',
                            flex: 1,
                            fontSize: 12
                        }}
                        title="Ayuda"
                    />
                </View>
                {
                    this.state.isLoading ?
                        <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} />
                        :
                        <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                            style={styles.scrollView}
                            refreshControl={this._refreshControl()}
                        >
                            <View style={{ marginBottom: 15 }}>
                                {!this.state.isLoading && this.state.hasDrivers &&
                                    this.state.drivers.map(d => {
                                        return (
                                            <Card key={d.id_chofer}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                        }}>
                                                        <Image
                                                            style={{
                                                                borderRadius: 38,
                                                                width: 76,
                                                                height: 76,
                                                                marginLeft: 5
                                                            }}
                                                            resizeMode="cover"
                                                            source={{ uri: d.fotografia }}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 5,
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>
                                                        <Text style={{ fontFamily: 'aller-bd', fontSize: 16, marginBottom: 5 }}>{d.nombre}</Text>
                                                        {
                                                            (d.unidad != null) &&
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={{ fontFamily: 'aller-lt', fontSize: 12 }}>{`${d.unidad.marca} ${d.unidad.modelo}`}</Text>
                                                                <View style={{ width: 16, height: 16, marginHorizontal: 5, backgroundColor: d.unidad.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                                <Text style={{ fontSize: 12, marginBottom: 10, fontFamily: 'aller-lt' }}>{d.unidad.placas}</Text>
                                                            </View>
                                                        }
                                                        <Button
                                                            title={(d.unidad != null) ? 'Desvincular auto' : 'Vincular auto'}
                                                            buttonStyle={{
                                                                width: 140,
                                                                marginLeft: 5,
                                                                backgroundColor: '#ff8834'
                                                            }}
                                                            titleStyle={{ fontFamily: 'aller-lt' }}
                                                            onPress={() => { (d.unidad != null) ? this.desvincularVehiculo(d.unidad.id_unidad, d.id_chofer) : this.props.navigation.navigate('LinkVehicle', { id_propietario: d.id_propietario, id_chofer: d.id_chofer }) }}
                                                        />
                                                    </View>

                                                    <Icon
                                                        type='font-awesome'
                                                        name='car'
                                                        color={(d.unidad != null) ? 'black' : 'white'}
                                                        size={18}
                                                    />

                                                    <TouchableOpacity style={{ position: 'absolute', top: -7, right: -3 }}
                                                        onPress={() => { this.setState({ comenting: true, id_chofer: d.id_chofer }); }}
                                                    >
                                                        <Icon
                                                            type='font-awesome'
                                                            name='commenting'
                                                            size={24}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </Card>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                }
            </SafeAreaView>
        )
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
    }
});
