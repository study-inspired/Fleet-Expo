import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Icon, Button } from 'react-native-elements';

/**
 * Esta vista es de las de gestion de mantenimiento vehiculo
 */

const viajes = [
    ['Plaza san fernando', 'Central foranea', '23/08/2019'],
    ['Zentralia', 'Piedra lisa', '28/08/2019'],
    ['Central forana', 'Plaza country', '02/09/2019'],
    ['Hotel Maria Isabel', 'Comala', '10/09/2019'],
    ['Colima centro', 'Placetas', '22/09/2019'],
]

const alertas = [
    ['Salida geocerca', '22/09/2019', '10:00 pm'],
    ['Conectado', '24/09/2019', '08:00 am'],
    ['Conectado', '27/09/2019', '11:00 am'],
    ['Salida geocerca', '30/09/2019', '10:00 am'],
    ['Entrada geocerca', '04/10/2019', '04:00 pm'],
]

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
        viajesHead: ['Origen', 'Destino', 'Fecha'],
        alertasHead: ['Alerta', 'Fecha', 'Hora']
    }

    render() {
        const vehicle = this.props.navigation.getParam('vehicle', {})
        return (
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
                        <Text style={styles.textoNormal}>- {vehicle.placa}</Text>
                    </View>
                </View>

                <View style={{ margin: 4 }} >
                    <View style={styles.view1}>
                        <Icon type='ionicon' name='ios-send' size={16} />
                        <Text style={styles.titulo}>  Viajes</Text>
                    </View>

                    <Table borderStyle={styles.border}>
                        <Row data={this.state.viajesHead} style={styles.head} textStyle={styles.text} />
                        <Rows data={viajes} textStyle={styles.text} />
                    </Table>

                    <View style={styles.view1}>
                        <Icon type='material-community' name='alert' size={16} />
                        <Text style={styles.titulo}>  Alertas</Text>
                    </View>
                    <Table borderStyle={styles.border}>
                        <Row data={this.state.alertasHead} style={styles.head} textStyle={styles.text} />
                        <Rows data={alertas} textStyle={styles.text} />
                    </Table>

                </View>
            </View>
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