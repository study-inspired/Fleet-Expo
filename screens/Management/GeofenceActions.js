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
    Alert,
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements'

const alertas = [
    {
        nombre: 'Zona norte',
        vehiculo: {
            nombre: 'Chevrolet Aveo(Gris)',
            placa: 'COL-6462J'
        },
        salidas: 3
    },
    {
        nombre: 'Zona norte',
        vehiculo: {
            nombre: 'NISSAN Versa(Blanco)', placa: 'COL-1684D'
        },
        salidas: 7
    },
    {
        nombre: 'Zona norte',
        vehiculo: {
            nombre: 'Chevrolet Beat(Azul)', placa: 'COL-4568R'
        },
        salidas: 1
    },
]

export default class GeofenceActions extends React.Component {

    static navigationOptions = {
        title: 'Acciones en geocerca',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    state = {
        isLoading: true,
        hasAlerts: false,
        alerts: [],
        nextScreen: this.props.navigation.getParam('nextScreen', '')
    }

    async componentDidMount() {
        try {
            const result = await fetch('http://192.168.1.67:3000/webservice/interfaz130/obtener_alertas_accion_geocerca', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_propietario: 1
                }),
            })

            const data = await result.json();

            if (data.datos != 0) {
                this.setState({
                    hasRecords: true,
                    alerts: data.datos.map((r) => {
                        return {
                            id: r.id_alerta,
                            tipo: r.tipo_alerta,
                            mensaje: r.desp_alerta,
                            categoria: r.categoria,
                            geocerca: {
                                id: r.id_geocercas,
                                nombre: r.nombre,
                            },
                            vehiculo: {
                                id: r.id_unidad,
                                nombre: `${r.marca} ${r.modelo}`,
                                color: r.color.includes('#')?r.color:'#a8a8a8',
                                placas: r.placas,
                            }
                        }
                    }),
                    isLoading: false
                })
            } else {
                Alert.alert('Info', 'No hay registros de alertas.');
                this.setState({
                    isLoading: false
                })
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un error.');
            this.setState({
                isLoading: false
            })
            console.error(error);
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 70, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16 }}>
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
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={{ marginBottom: 15 }}>
                        {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                        {   !this.state.isLoading && this.state.hasAlerts && 
                            this.state.alerts.map((a, i) => {
                                return (
                                    <Card key={i} wrapperStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flex: 2, flexDirection: 'column', }}>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                <Icon type='material-community' name="map" size={38} iconStyle={{ flex: 1, marginHorizontal: 5 }} />
                                                <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, }}>{a.geocerca.nombre}</Text>
                                            </View>
                                            <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, marginLeft:5 }}>Salidas: {a.mensaje}</Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                            <Icon name='check-circle' size={14} color='#20d447' iconStyle={{ position: 'absolute', right: -24, top: 0 }} />
                                            <Icon type='font-awesome' name='car' size={18} iconStyle={{ marginHorizontal: 5 }} />
                                            <Text style={{ fontFamily: 'aller-bd', fontSize: 10, marginBottom: 1 }}>{a.vehiculo.nombre}</Text>
                                            <Text style={{ fontFamily: 'aller-lt', fontSize: 9, }}>{a.vehiculo.placas}</Text>
                                        </View>
                                    </Card>
                                );
                            })
                        }
                    </View>
                </ScrollView>
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
    }
});