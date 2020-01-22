import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, ScrollView, Alert, ActivityIndicator, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Icon, Button, Card, Overlay } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

/**
 * Esta vista es de las de gestion de mantenimiento vehiculo
 */

//Checar _refreshListView()  ya que como no hay fetch en esta parte no se actualizaran las tablas

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
        viajes: [{ fecha: '', hora: '', origen: 'No se encontrarón viajes', destino: '' }],
        alertas: [{ fecha: '', hora: '', concepto: 'No se encontrarón alertas', coordenadas: null }],
        vehicle: this.props.navigation.getParam('vehicle', {}),
        visible: false,
        markedDates: null,
        selectedWeek: '',
        fecha_inicial: '',
        fecha_final: ''
    }

    async componentDidMount() {
        this.getWeek(new Date());
        setTimeout(async () => {
            await this.obtenerViajes();
            await this.obtenerAlertas();
            this.setState({
                isLoading: false
            });
        }, 100);
    }

    async obtenerViajes() {
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/obtener_viajes_origen_destino', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_id_unidad: this.state.vehicle.id,
                    p_fecha_inicio: this.state.fecha_inicial,
                    p_fecha_final: this.state.fecha_final
                })
            });
            const data = await result.json();
            // console.log(data);
            if (data.datos.length != 0) {
                this.setState({
                    viajes: data.datos.map(viaje => {
                        return {
                            fecha: viaje.fecha_hora.substring(0, 10),
                            hora: viaje.fecha_hora.substring(11, 19),
                            origen: viaje.origen_geocoder,
                            destino: viaje.destino_geocoder
                        }
                    }),
                    hasTravels: true
                });
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
                    p_id_unidad: this.state.vehicle.id,
                    p_fecha_inicial: this.state.fecha_inicial,
                    p_fecha_final: this.state.fecha_final
                }),
            });

            const data = await result.json();

            // console.log(data);

            if (data.datos.length != 0) {
                let alerts = Object.values(data.datos).map((d) => {
                    let date = new Date();
                    let hm = d.hora.split(':');
                    date.setHours(hm[0]);
                    date.setMinutes(hm[1]);
                    return {
                        fecha: d.fecha.slice(0, 10).split('-').reverse().join('/'),
                        hora: date.toLocaleTimeString(),
                        concepto: d.concepto_alerta,
                        coordenadas: { latitude: parseFloat(d.ubicacion.split(',')[0]), longitude: parseFloat(d.ubicacion.split(',')[1]) }
                    }
                });

                // console.log(alerts);

                this.setState({
                    alertas: alerts,
                    hasAlerts: true
                });
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
        let fechas = Object.keys(dates);
        this.setState({
            markedDates: dates,
            selectedWeek: `${first} - ${last}`,
            visible: false,
            fecha_inicial: fechas[0],
            fecha_final: fechas[6]
        });
    }

    render() {
        const { vehicle } = this.state
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
                        <View>
                            <Image
                                style={styles.imagen}
                                resizeMode="cover"
                                source={{ uri: vehicle.imagen }}
                            />
                        </View>
                        <View style={styles.view1}>
                            <Text style={styles.textoBold}>{vehicle.nombre}</Text>
                            <View style={{ width: 16, height: 16, marginTop: -2, marginLeft: 5, marginRight: 5, backgroundColor: vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                            <Text style={styles.textoNormal}>- {vehicle.placas}</Text>
                        </View>
                    </View>

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
                            <Text style={[styles.textoBold, { marginBottom: 0 }]}>Origen</Text>
                            <Text style={[styles.textoBold, { marginBottom: 0 }]}>Destino</Text>
                        </Card>
                        {
                            this.state.isLoading ?
                                <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />
                                :
                                this.state.viajes.map((viaje, k) => {
                                    return (
                                        <Card key={k} containerStyle={{ marginVertical: 1 }}>
                                            <View style={{ flexDirection: 'column' }} >
                                                {
                                                    this.state.hasTravels &&
                                                    <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                                        <Text style={{ fontFamily: 'aller-lt', fontSize: 10 }}>{viaje.fecha}   {viaje.hora}</Text>
                                                    </View>
                                                }
                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                    <Text style={{ fontFamily: 'aller-lt', flex: 1 }}>{viaje.origen}</Text>
                                                    <Text style={{ fontFamily: 'aller-lt', flex: 1, textAlign: 'right' }}>{viaje.destino}</Text>
                                                </View>
                                            </View>
                                        </Card>
                                    );
                                })
                        }

                        <Card wrapperStyle={{ flexDirection: 'row', justifyContent: 'space-between' }} containerStyle={{ marginBottom: 2 }}>
                            <Text style={[styles.textoBold, { marginBottom: 0 }]}>Alerta</Text>
                            <Text style={[styles.textoBold, { marginBottom: 0 }]}>Ubic.</Text>
                        </Card>

                        {
                            this.state.isLoading ?
                                <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />
                                :
                                this.state.alertas.map((alerta, k) => {
                                    return (
                                        <Card key={k} containerStyle={{ marginVertical: 1 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flexDirection: 'column', flex: 2 }}>
                                                    {
                                                        this.state.hasAlerts &&
                                                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                                            <Text style={{ fontFamily: 'aller-lt', fontSize: 10 }}>{alerta.fecha}   {alerta.hora}</Text>
                                                        </View>
                                                    }
                                                    <Text style={{ fontFamily: 'aller-lt' }}>{alerta.concepto}</Text>
                                                </View>
                                                {
                                                    this.state.hasAlerts &&
                                                    <TouchableOpacity
                                                        onPress={() => this.props.navigation.navigate('GeofenceAlertsDetailsMap', { coordenadas: alerta.coordenadas, concepto: alerta.concepto })}
                                                    >
                                                        <Icon
                                                            type='material-community'
                                                            name='map-marker'
                                                            size={24}
                                                            color='#ffbb00'
                                                            containerStyle={{ marginRight: 5, marginTop: 3 }}
                                                        />
                                                    </TouchableOpacity>
                                                }
                                            </View>
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
        width: 150,
        height: 150,
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
