import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Alert, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Icon, Button, Card, Overlay } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import { Table, Row, Rows, } from 'react-native-table-component';
import { Text } from 'react-native';


export default class Alerts extends Component {

    /**
     * Checar las variables ya que estas son las que insertaran datos ya que no se escriben bien
     */

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true,
            hasAlerts: false,
            tableHead: ['Fecha', 'Hora', 'Concepto de alerta'],
            widthArr: [95, 70, 160],
            alerts: [],
            vehicle: this.props.navigation.getParam('vehicle', {}),
            visible: false,
            markedDates: null,
            selectedWeek: ''
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
        this.getWeek(new Date());
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/interfaz132/mostrar_alertas_unidad', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
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
                    return {
                        fecha: d.fecha.slice(0, 10).split('-').reverse().join('/'),
                        hora: date.toLocaleTimeString(),
                        concepto: d.concepto_alerta
                    }
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
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
            //this.props.navigation.goBack();
            this.setState({
                isLoading: false
            });
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

    formatDate(yyyy, mm, dd) {
        let m = (mm > 9) ? `${mm}` : `0${mm}`;
        let d = (dd > 9) ? `${dd}` : `0${dd}`;
        return `${yyyy}-${m}-${d}`;
    }

    getWeek(date) {
        // console.log(date);

        let dates = {};
        let startDay = date;
        let first, last;
        startDay.setDate(date.getDate() - (date.getDay() - 0)); // domingo
        // console.log(startDay);
        first = startDay.toGMTString().slice(5, 11);

        dates[this.formatDate(startDay.getFullYear(), startDay.getMonth() + 1, startDay.getDate())] = { color: '#ff8834', textColor: 'white' };

        for (let day = 1; day < 7; day++) {
            startDay.setDate(startDay.getDate() + 1);
            if (day == 6) {
                last = startDay.toGMTString().slice(5, 11);
            }
            dates[this.formatDate(startDay.getFullYear(), startDay.getMonth() + 1, startDay.getDate())] = { color: '#ff8834', textColor: 'white' };
        }

        this.setState({
            markedDates: dates,
            selectedWeek: `${first} - ${last}`,
            visible: false
        });

        // Fetch para obtener las alertas
    }

    render() {
        const state = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Overlay
                    isVisible={state.visible}
                    width={300}
                    height={400}
                    onBackdropPress={() => this.setState({ visible: false })}
                >
                    <View style={{ flex: 1 }}>
                        <Calendar
                            theme={{
                                textDayFontFamily: 'aller-lt',
                                textMonthFontFamily: 'aller-lt',
                                textDayHeaderFontFamily: 'aller-bd',
                            }}
                            onDayPress={(day) => this.getWeek(new Date(day.dateString))}
                            markedDates={this.state.markedDates}
                            markingType={'period'}
                        />
                        {/*<Button
                            title='cerrar'
                            onPress={ () => this.setState({ visible: false }) }
                            />*/
                        }
                    </View>
                </Overlay>

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

                <View style={{ flexDirection: 'row', alignSelf: 'center', height: 30 }}>
                    <Text style={[styles.textoBold, { marginTop: 4 }]}>{state.vehicle.nombre}</Text>
                    <View style={{ width: 16, height: 16, marginTop: 6, marginLeft: 5, marginRight: 5, backgroundColor: state.vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                    <Text style={[styles.textoNormal, { marginTop: 4 }]}>- {state.vehicle.placas}</Text>
                </View>
                <Text style={[styles.textoNormal, { marginBottom: 4, textAlign: "center" }]}>Selecciona la semana de consulta</Text>

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Button
                        title={state.selectedWeek}
                        onPress={() => this.setState({ visible: true })}
                    />
                    <Icon type='font-awesome' name="calendar" size={32} containerStyle={{ marginLeft: 5, marginTop: 3 }} />
                </View>

                <Card wrapperStyle={styles.cardHead} containerStyle={{marginBottom:2}}>
                    <Text style={styles.textoBold}>Alerta</Text>
                    <Text style={styles.textoBold}>Ubic.</Text>
                </Card>

                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    refreshControl={this._refreshControl()}
                >
                    <View style={{ flex: 1 }} >

                        {state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={state.isLoading} />}
                        {!state.isLoading && state.hasAlerts &&
                            state.alerts.map((alerta, k) => {
                                return (
                                    <Card key={k} wrapperStyle={{ flexDirection: 'row' }} containerStyle={{marginVertical: 1}}>
                                        <View style={{flexDirection: 'column', flex: 2}}>
                                            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                                <Text style={{ fontFamily: 'aller-lt', fontSize: 10 }}>{alerta.fecha}   {alerta.hora}</Text>
                                            </View>
                                            <Text style={{ fontFamily: 'aller-lt' }}>{alerta.concepto}</Text>
                                        </View>
                                        <TouchableOpacity>
                                            <Icon
                                                type='material-community'
                                                name='map-marker'
                                                size={24}
                                                color='#ffbb00'
                                                containerStyle={{ marginRight: 5, marginTop: 3 }}
                                            />
                                        </TouchableOpacity>
                                        
                                    </Card>
                                );
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 35, backgroundColor: '#f1f8ff' },
    text: { margin: 6, fontSize: 14 },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
    textoNormal: {
        fontSize: 14,
        fontFamily: 'aller-lt'
    },
    textoBold: {
        fontSize: 14,
        fontFamily: 'aller-bd'
    },
    cardHead: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
