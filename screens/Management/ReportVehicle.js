import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Icon, Button, Card, Overlay } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';

/**
 * Esta vista es de las de gestion de mantenimiento vehiculo
 */

//Checar _refreshListView()  ya que como no hay fetch en esta parte no se actualizaran las tablas

const viajes_prueba = [
    { origen: 'Plaza san fernando', destino: 'Central foranea', fecha: '23/08/2019', hora: '16:16:00' },
    { origen: 'Zentralia', destino: 'Piedra lisa', fecha: '28/08/2019', hora: '12:56:00' },
    { origen: 'Central forana', destino: 'Plaza country', fecha: '02/09/2019', hora: '14:31:00' },
    { origen: 'Hotel Maria Isabel', destino: 'Comala', fecha: '10/09/2019', hora: '02:31:00' },
    { origen: 'Colima centro', destino: 'Placetas', fecha: '22/09/2019', hora: '21:41:00' }
]

// const alertas = [
//     ['Salida geocerca', '22/09/2019', '10:00 pm'],
//     ['Conectado', '24/09/2019', '08:00 am'],
//     ['Conectado', '27/09/2019', '11:00 am'],
//     ['Salida geocerca', '30/09/2019', '10:00 am'],
//     ['Entrada geocerca', '04/10/2019', '04:00 pm'],
// ]

export default class ReportVehicle extends Component {
    static navigationOptions = {
        title: 'Reporte vehículo',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontSize: 18,
        },
        headerRight: <View></View>,
    }

    state = {
        refreshing: false,
        isLoading: true,
        hasAlerts: false,
        hasTravels: false,
        viajesHead: ['Origen', 'Destino', 'Fecha'],
        viajes: [],
        alertasHead: ['Alerta', 'Fecha', 'Hora'],
        alertas: [],
        vehicle: this.props.navigation.getParam('vehicle', {}),
        visible: false,
        markedDates: null,
        selectedWeek: ''
    }

    async componentDidMount() {
        this.getWeek(new Date());
        await this.obtenerViajes();
        await this.obtenerAlertas();
        this.setState({
            isLoading: false
        });
    }

    async obtenerViajes() {
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/interfaz151/obtener_viajes', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key: 'val'
                })
            });

            const data = await result.json();
            console.log(data);
            if (data.datos.length != 0) {
                this.setState({
                    viajes: [],
                    hasTravels: true
                });
            } else {
                Alert.alert('Info', 'No hay viajes registrados.');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un error al obtener los viajes.');
        }
    }

    async obtenerAlertas() {
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

                this.setState({
                    alertas: alerts,
                    hasAlerts: true
                });
            } else {
                Alert.alert('Info', 'No hay alertas registradas.');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un error al obtener alertas.');
            console.error(error);
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
        //this.componentDidMount()  //<-- Recargo el refresh control
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
        const { vehicle, viajes, viajesHead, alertas, alertasHead } = this.state
        return (
            <ScrollView
                refreshControl={this._refreshControl()}
            >
                <Overlay
                    isVisible={this.state.visible}
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

                <View style={{ flex: 1 }}>
                    <View>
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
                                right: 0,
                            }}
                            iconContainerStyle={{
                                flex: 1,
                            }}
                            titleStyle={{
                                flex: 1,
                                fontFamily: 'aller-lt',
                                fontSize: 12,
                                bottom: 0,
                            }}
                            title="Ayuda"
                        />
                        <View>
                            <Image
                                style={styles.imagen}
                                resizeMode="cover"
                                source={{ uri: vehicle.imagen }}
                            />
                        </View>
                        <View style={styles.view1}>
                            <Text style={styles.textoBold}>{vehicle.nombre}</Text>
                            <View style={{ width: 16, height: 16, marginTop: 4, marginLeft: 5, marginRight: 5, backgroundColor: vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                            <Text style={styles.textoNormal}>- {vehicle.placas}</Text>
                        </View>
                    </View>

                    {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                    <View style={{ margin: 4 }} >
                        <View style={styles.view1}>
                            <Icon type='ionicon' name='ios-send' size={16} />
                            <Text style={styles.titulo}>  Viajes</Text>
                        </View>

                        <Text style={[styles.textoNormal, { marginVertical: 4, textAlign: "center" }]}>Selecciona la semana de consulta</Text>

                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <Button
                                title={this.state.selectedWeek}
                                buttonStyle={{ backgroundColor: '#ff8834' }}
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                onPress={() => this.setState({ visible: true })}
                            />
                            <Icon type='font-awesome' name="calendar" size={32} containerStyle={{ marginLeft: 5, marginTop: 3 }} />
                        </View>

                        <Card wrapperStyle={{ flexDirection: 'row', justifyContent: 'space-between', padding: 0 }} containerStyle={{ marginBottom: 2 }}>
                            <Text style={styles.textoBold}>Origen</Text>
                            <Text style={styles.textoBold}>Destino</Text>
                        </Card>
                        {/* {
                        viajes_prueba.map(viaje => {
                            <Card
                                wrapperStyle={{flexDirection: 'column'}}
                            >
                                <View style={{flexDirection: 'row'}}>
                                    <Text>{viaje.fecha}</Text>
                                    <Text>{viaje.hora}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text>{viaje.origen}</Text>
                                    <Text>{viaje.destino}</Text>
                                </View>
                            </Card>
                        })
                    } */}



                        {
                            !this.state.isLoading && this.state.hasTravels &&
                            <Table borderStyle={styles.border}>
                                <Row data={viajesHead} style={styles.head} textStyle={styles.text} />
                                <Rows data={viajes} textStyle={styles.text} />
                            </Table>
                        }

                        {/* <View style={styles.view1}>
                        <Icon type='material-community' name='alert' size={16} />
                        <Text style={styles.titulo}>  Alertas</Text>
                    </View> */}

                        <Card wrapperStyle={{ flexDirection: 'row', justifyContent: 'space-between' }} containerStyle={{ marginBottom: 2 }}>
                            <Text style={styles.textoBold}>Alerta</Text>
                            <Text style={styles.textoBold}>Ubic.</Text>
                        </Card>

                        {
                            !this.state.isLoading && this.state.hasAlerts &&
                            this.state.alertas.map((alerta, k) => {
                                return (
                                    <Card key={k} wrapperStyle={{ flexDirection: 'row' }} containerStyle={{ marginVertical: 1 }}>
                                        <View style={{ flexDirection: 'column', flex: 2 }}>
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
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: { flex: 1, padding: 20, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 30, backgroundColor: '#f1f8ff' },
    small: { height: 40, backgroundColor: '#f1f8ff', width: 20 },
    text: { margin: 6, fontSize: 10 },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
    titulo: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 2
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16,
        marginBottom: 5
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 16,
        marginBottom: 5
    },
    imagen: {
        width: 200,
        height: 200,
        alignSelf: 'center'
    },
    border: {
        borderWidth: 2,
        borderColor: '#c8e1ff'
    },
    view1: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center"
    }
});
