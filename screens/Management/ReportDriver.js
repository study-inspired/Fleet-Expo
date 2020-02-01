/**
 * @format
 * @flow
**/

import React from 'react';

import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableNativeFeedback,
    Alert
} from 'react-native';

import { Button, Card, ButtonGroup } from 'react-native-elements'
import { Table, Row, Rows } from 'react-native-table-component';
import Globals from '../../constants/Globals';
import { Ionicons, FontAwesome } from '@expo/vector-icons';



export default class ReportDriver extends React.Component {
    static navigationOptions = {
        title: 'Reporte conductor, socio conductor',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>,
    }

    state = {
        isLoading: true,
        hasInfo: false,
        selectedIndex: 0,
        info: {},
        driver: this.props.navigation.getParam('driver', {})
    }

    // componentDidMount() {
    //     this.reporteActual();
    // }

    async reporteActual() {
        try {
            const response = await fetch(`${Globals.server}:3006/webservice/interfaz134/reporte_conductor_actual`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_propietario: this.state.driver.id_chofer1
                }),
            })

            const { datos, msg } = await response.json();
            // console.log(datos);
            if (msg) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
            } else if (datos.length != 0) {
                this.setState({
                    info: datos[0],
                    isLoading: false,
                    hasInfo: true,
                });

            } else {
                Alert.alert('Información', 'No se encontró información.');
                this.setState({
                    isLoading: false
                });
            }

        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
            this.setState({
                isLoading: false
            });
        }
    }

    async reporteSemanal() {
        try {
            const response = await fetch(`${Globals.server}:3006/webservice/interfaz134/reporte_conductor_semanal`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_propietario: this.state.driver.id_chofer
                }),
            })

            const { datos, msg } = await response.json();
            // console.log(datos);

            if (msg) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
            } else if (datos.length != 0) {
                this.setState({
                    info: datos[0],
                    isLoading: false,
                    hasInfo: true,
                });

            } else {
                Alert.alert('Información', 'No hay registrada inforrmación.');
                this.setState({
                    isLoading: false,
                    hasInfo: false
                });
            }

        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
            this.setState({
                isLoading: false
            });
        }
    }

    async reporteMensual() {
        try {
            const response = await fetch(`${Globals.server}:3006/webservice/interfaz134/reporte_conductor_mensual`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_propietario: this.state.driver.id_chofer
                }),
            })

            const { datos, msg } = await response.json();
            // console.log(data);
            if (msg) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
            } else if (datos.length != 0) {
                this.setState({
                    info: datos[0],
                    isLoading: false,
                    hasInfo: true,
                });

            } else {
                Alert.alert('Info', 'No hay datos!');
                this.setState({
                    isLoading: false,
                    hasInfo: false,
                });
            }

        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
            this.setState({
                isLoading: false
            });
        }
    }

    updateIndex(selectedIndex) {
        this.setState({
            isLoading: true,
            hasInfo: false,
        });
        switch (selectedIndex) {
            case 0:
                // this.reporteActual();
                break;
            case 1:
                this.reporteSemanal();
                break;
            default:
                this.reporteMensual();
                break;
        }
        this.setState({ selectedIndex });
    }

    render() {
        const buttons = ['Actual', 'Semana', 'Mes']
        const { selectedIndex } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <View elevation={2} style={styles.subHeader}>
                    <FontAwesome
                        name='money'
                        size={64}
                    />
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
                <View style={styles.imageContainer}>
                    {/* <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={{ uri: this.state.driver.fotografia }}
                        /> */}
                    <Ionicons
                        name={'md-contact'}
                        size={76}
                    />
                    <Text style={{ fontFamily: 'aller-lt', fontSize: 16, textAlign: 'center' }}>{this.state.driver.nombre}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <ButtonGroup
                        onPress={this.updateIndex.bind(this)}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{ height: 35 }}
                        buttonStyle={{ backgroundColor: '#ff8834' }}
                        selectedButtonStyle={{ backgroundColor: '#ec6a2c' }}
                        textStyle={{ fontFamily: 'aller-lt', color: '#fafafa' }}
                        selectedTextStyle={{ fontFamily: 'aller-lt' }}
                    />
                </View>

                {
                    this.state.isLoading ? <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} /> :
                    this.state.hasInfo && <View>
                        <View style={styles.viewContainer}>
                            <View style={styles.viewTitle}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>TOTAL</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Pagos Efectivo</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Pagos Tarjeta</Text>
                            </View>
                            <View style={styles.viewContent}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this.state.info.total}`}</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this.state.info.pagosefectivo}`}</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this.state.info.pagostarjeta}`}</Text>
                            </View>
                        </View>

                        <View style={styles.viewContainer}>
                            <View style={styles.viewTitle}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Sol. atendidas</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Sol. rechazadas</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>T. recompensas</Text>
                            </View>
                            <View style={styles.viewContent}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{this.state.info.solatendidas}</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{this.state.info.solrechazadas}</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this.state.info.trecompenzas}`}</Text>
                            </View>
                        </View>

                        <View style={styles.viewContainer}>
                            <View style={styles.viewTitle}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Pagados con efectivo</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Pagados con tarjeta</Text>
                            </View>
                            <View style={styles.viewContent}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{this.state.info.pagadosconefectivo}</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{this.state.info.pagadoscontarjeta}</Text>
                            </View>
                        </View>

                        <View style={styles.viewContainer}>
                            <View style={styles.viewTitle}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Viajes</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Horas operadas</Text>
                                {
                                    this.state.selectedIndex != 0 && <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Comisión vehículo</Text>
                                }
                            </View>
                            <View style={styles.viewContent}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{this.state.info.viajes}</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{this.state.info.horasoperadas}</Text>
                                {
                                    this.state.selectedIndex != 0 && <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>null</Text>
                                }
                            </View>
                        </View>

                        <View style={styles.viewContainer}>
                            <View style={styles.viewTitle}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Comisión plataforma</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Ganancia Final</Text>
                            </View>
                            <View style={styles.viewContent}>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this.state.info.comisionplataforma}`}</Text>
                                <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this.state.info.gananciafinal}`}</Text>
                            </View>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, fontSize: 12 },
    subHeader: {
        backgroundColor: '#fff',
        height: 65,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 14,
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16,
    },
    scrollView: {
        backgroundColor: '#fafafa'
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15
    },
    imageContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        // marginBottom: 15
    },
    cardText: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        borderRadius: 38,
        width: 76,
        height: 76,
    },
    width40: {
        flex: 1,
        width: Dimensions.get('window').width - 40
    },
    width100: {
        flex: 1,
        width: Dimensions.get('window').width - 100,
        alignSelf: 'center'
    },
    border: {
        borderWidth: 2,
        borderColor: '#c8e1ff'
    },
    viewTitle: {
        height: 30,
        backgroundColor: '#cacaca',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
        // borderColor: '#000',
        // borderWidth: 1,
        // borderRadius: 2
    },
    viewContent: {
        height: 35,
        backgroundColor: '#eaeaea',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
        // borderColor: '#000',
        // borderWidth: 1,
        // borderRadius: 2
    },
    viewContainer: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 2,
        marginHorizontal: 10,
        marginVertical: 5
    }
});