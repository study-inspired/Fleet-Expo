import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Table, Row, Rows, } from 'react-native-table-component';


export default class Alerts extends Component {

    /**
     * Checar las variables ya que estas son las que insertaran datos ya que no se escriben bien
     */

    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Fecha', 'Hora', 'Concepto de alerta', 'Vehiculo'],
            widthArr: [50, 50, 160, 80],
            tableData: [
                ['24/08/19', '12:34 pm', 'Temperatura del refrigerante del mot', 'Chevrolet (Rojo) COL-4568R'],
                ['12/05/19', '09:25 am', 'Cambio de carril rápido', 'Chevrolet (Rojo) COL-4568R'],
                ['04/02/19', '02:40 pm', 'Salida de la geocerca', 'Chevrolet (Rojo) COL-4568R'],
                ['25/04/19', '10:30 am', 'Tiempo excesivo de inactividad del m', 'Nissan (Azul) COL-4555R'],
                ['10/10/19', '11:40 am', 'Choque', 'Nissan (Azul) COL-4555R'],
                ['17/05/19', '04:25 pm', 'Cambio de carril rapido', 'Nissan (Azul) COL-4555R'],
            ]
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

    render() {
        const state = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ height: 70, flexDirection: 'row', alignContent:'center' }}>
                    <Icon type='font-awesome' name="warning" size={52} containerStyle={{ flex: 1, marginTop:8, alignSelf:'center' }} />
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


                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={{ margin: 4 }} style={{ alignSelf: 'center' }} >
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Row data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={styles.text} />
                            <Rows data={state.tableData} widthArr={state.widthArr} textStyle={styles.text} />
                        </Table>
                    </View>
                </ScrollView>
            </SafeAreaView>

        );

    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#808B97' },
    text: { margin: 6, fontSize: 8 },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
    btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' }
});