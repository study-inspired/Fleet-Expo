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
    ActivityIndicator
} from 'react-native';

import { Button, Card, ButtonGroup } from 'react-native-elements'
import { Table, Row, Rows } from 'react-native-table-component';



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
        Actual1Head: [],
        Actual1Data: [],
        Actual2Head: [],
        Actual2Data: [],
        Actual3Head: [],
        Actual3Data: [],
        Actual4Head: [],
        Actual4Data: [],
        Actual5Head: [],
        Actual5Data: [],
        driver: this.props.navigation.getParam('driver', {})
    }

    componentDidMount() {
        this.reporteActual();
    }

    async reporteActual() {
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/interfaz134/reporte_conductor_actual', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_propietario: this.state.driver.id_chofer1
                }),
            })

            const data = await result.json();
            console.log(data);

            if (data.datos.length != 0) {
                this.setState({
                    hasDrivers: true,
                    Actual1Head: ['TOTAL', 'Pagos Efectivo', 'Pagos Tarjeta'],
                    Actual1Data: [
                        data.datos[0].total,
                        data.datos[0].pagosefectivo,
                        data.datos[0].pagostarjeta
                    ],
                    Actual2Head: ['Sol. atendidas', 'Sol. rechazadas', 'T. recompensas'],
                    Actual2Data: [
                        data.datos[0].solatendidas,
                        data.datos[0].solrechazadas,
                        data.datos[0].trecompenzas
                    ],
                    Actual3Head: ['Pagados con Efectivo', 'Pagados con Tarjeta'],
                    Actual3Data: [
                        data.datos[0].pagadosconefectivo,
                        data.datos[0].pagadoscontarjeta,
                    ],
                    Actual4Head: ['Viajes', 'Horas operadas'],
                    Actual4Data: [
                        data.datos[0].viajes,
                        data.datos[0].horasoperadas,
                    ],
                    Actual5Head: ['Comisión plataforma', 'Ganancia Final'],
                    Actual5Data: [
                        data.datos[0].comisionplataforma,
                        data.datos[0].gananciafinal,
                    ],
                    isLoading: false
                });

            } else {
                Alert.alert('Info', 'No hay conductores!');
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
            const result = await fetch('http://35.203.42.33:3006/webservice/interfaz134/reporte_conductor_semanal', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_propietario: this.state.driver.id_chofer1
                }),
            })

            const data = await result.json();
            console.log(data);

            if (data.datos.length != 0) {
                this.setState({
                    hasDrivers: true,
                    Actual1Head: ['TOTAL', 'Pagos Efectivo', 'Pagos Tarjeta'],
                    Actual1Data: [
                        data.datos[0].total,
                        data.datos[0].pagosefectivo,
                        data.datos[0].pagostarjeta
                    ],
                    Actual2Head: ['Sol. atendidas', 'Sol. rechazadas', 'T. recompensas'],
                    Actual2Data: [
                        data.datos[0].solatendidas,
                        data.datos[0].solrechazadas,
                        data.datos[0].trecompenzas
                    ],
                    Actual3Head: ['Pagados con Efectivo', 'Pagados con Tarjeta'],
                    Actual3Data: [
                        data.datos[0].pagadosconefectivo,
                        data.datos[0].pagadoscontarjeta,
                    ],
                    Actual4Head: ['Viajes', 'Horas operadas'],
                    Actual4Data: [
                        data.datos[0].viajes,
                        data.datos[0].horasoperadas,
                    ],
                    Actual5Head: ['Comisión plataforma', 'Ganancia Final'],
                    Actual5Data: [
                        data.datos[0].comisionplataforma,
                        data.datos[0].gananciafinal,
                    ],
                    isLoading: false
                });

            } else {
                Alert.alert('Info', 'No hay datos!');
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

    async reporteMensual() {
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/interfaz134/reporte_conductor_mensual', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_propietario: this.state.driver.id_chofer1
                }),
            })

            const data = await result.json();
            console.log(data);

            if (data.datos.length != 0) {
                this.setState({
                    hasDrivers: true,
                    Actual1Head: ['TOTAL', 'Pagos Efectivo', 'Pagos Tarjeta'],
                    Actual1Data: [
                        data.datos[0].total,
                        data.datos[0].pagosefectivo,
                        data.datos[0].pagostarjeta
                    ],
                    Actual2Head: ['Sol. atendidas', 'Sol. rechazadas', 'T. recompensas'],
                    Actual2Data: [
                        data.datos[0].solatendidas,
                        data.datos[0].solrechazadas,
                        data.datos[0].trecompenzas
                    ],
                    Actual3Head: ['Pagados con Efectivo', 'Pagados con Tarjeta'],
                    Actual3Data: [
                        data.datos[0].pagadosconefectivo,
                        data.datos[0].pagadoscontarjeta,
                    ],
                    Actual4Head: ['Viajes', 'Horas operadas'],
                    Actual4Data: [
                        data.datos[0].viajes,
                        data.datos[0].horasoperadas,
                    ],
                    Actual5Head: ['Comisión plataforma', 'Ganancia Final'],
                    Actual5Data: [
                        data.datos[0].comisionplataforma,
                        data.datos[0].gananciafinal,
                    ],
                    isLoading: false
                });

            } else {
                Alert.alert('Info', 'No hay datos!');
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

    updateIndex(selectedIndex) {
        switch (selectedIndex) {
            case 0:
                this.reporteActual();
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
        const { selectedIndex } = this.state

        return (
            <View style={{ flex: 1 }}>
                <View elevation={5} style={styles.subHeader}>
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
                            alignSelf: 'flex-end'
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
                <Card containerStyle={styles.card} >
                    <View
                        style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={{ uri: this.state.driver.avatar }}
                        />
                        <Text style={styles.textoBold}>{this.state.driver.name}</Text>
                    </View>
                    <View
                        style={{
                            marginTop: 36
                        }}>
                        <ButtonGroup
                            onPress={this.updateIndex.bind(this)}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{ height: 33 }}
                            buttonStyle={{ backgroundColor: '#ff8834' }}
                            selectedButtonStyle={{ backgroundColor: '#ec6a2c' }}
                            textStyle={{ fontFamily: 'aller-lt' }}
                            selectedTextStyle={{ fontFamily: 'aller-lt' }}
                        />
                    </View>
                    {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                    {!this.state.isLoading && this.state.hasInfo && 
                        <View>
                            <View style={styles.width40}>
                                <Table borderStyle={styles.border}>
                                    <Row data={this.state.Actual1Head} style={styles.head} textStyle={styles.text} />
                                    <Rows data={this.state.Actual1Data} textStyle={styles.text} />
                                </Table>
                            </View>
                            <View style={styles.width40}>
                                <Table borderStyle={styles.border}>
                                    <Row data={this.state.Actual2Head} style={styles.head} textStyle={styles.text} />
                                    <Rows data={this.state.Actual2Data} textStyle={styles.text} />
                                </Table>
                            </View>
                            <View style={styles.width100}>
                                <Table borderStyle={styles.border}>
                                    <Row data={this.state.Actual3Head} style={styles.head} textStyle={styles.text} />
                                    <Rows data={this.state.Actual3Data} textStyle={styles.text} />
                                </Table>
                            </View>
                            <View style={styles.width100}>
                                <Table borderStyle={styles.border}>
                                    <Row data={this.state.Actual4Head} style={styles.head} textStyle={styles.text} />
                                    <Rows data={this.state.Actual4Data} textStyle={styles.text} />
                                </Table>
                            </View>
                            <View style={styles.width100}>
                                <Table borderStyle={styles.border}>
                                    <Row data={this.state.Actual5Head} style={styles.head} textStyle={styles.text} />
                                    <Rows data={this.state.Actual5Data} textStyle={styles.text} />
                                </Table>
                            </View>
                        </View>
                    }
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, fontSize: 12 },
    subHeader: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 15
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
    }
});