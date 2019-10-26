import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Table, Row, Rows, } from 'react-native-table-component';


export default class Alerts extends Component {

    /**
     * Checar las variables ya que estas son las que insertaran datos ya que no se escriben bien
     */

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            hasAlerts: false,
            tableHead: ['Fecha', 'Hora', 'Concepto de alerta'],
            widthArr: [95, 70, 160],
            alerts: [],
            vehicle: this.props.navigation.getParam('vehicle', {})
        }
    }

    static navigationOptions = {
        title: 'Alertas presentadas',
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
        try {
            const result = await fetch('http://34.95.33.177:3006/webservice/interfaz132/mostrar_alertas_unidad', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_unidad: this.state.vehicle.id
                }),
            });

            const data = await result.json();
            console.log(data);


            if (data.datos.length != 0) {
                let alerts = Object.values(data.datos).map((d) => {
                    let date = new Date();
                    let hm = d.hora.split(':');
                    date.setHours(hm[0]);
                    date.setMinutes(hm[1]);
                    return [
                        d.fecha.slice(0, 10).split('-').reverse().join('/'),
                        date.toLocaleTimeString(),
                        d.concepto_alerta
                    ]
                });
                console.log(alerts);

                this.setState({
                    alerts: alerts,
                    hasAlerts: true,
                    isLoading: false
                });
            } else {
                Alert.alert('Info', 'No hay alertas registradas!');
                this.setState({
                    isLoading: false
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un error.');
            console.error(error);
            this.props.navigation.goBack();
        }
    }


    render() {
        const state = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ height: 70, flexDirection: 'row', alignContent: 'center' }}>
                    <Icon type='font-awesome' name="warning" size={52} containerStyle={{ flex: 1, marginTop: 8, alignSelf: 'center' }} />
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

                <View style={{ margin: 4 }} style={{ alignSelf: 'center' }} >
                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                        <Row data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={[styles.text, { fontFamily: 'aller-bd' }]} />
                    </Table>
                    {state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={state.isLoading} />}
                    {!state.isLoading && state.hasAlerts &&
                        <View style={{ flex: 1 }}>
                            <ScrollView contentInsetAdjustmentBehavior="automatic">
                                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                    <Rows data={state.alerts} widthArr={state.widthArr} textStyle={[styles.text, { fontFamily: 'aller-lt' }]} />
                                </Table>
                            </ScrollView>
                        </View>
                    }
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 35, backgroundColor: '#f1f8ff' },
    text: { margin: 6, fontSize: 14 },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
});