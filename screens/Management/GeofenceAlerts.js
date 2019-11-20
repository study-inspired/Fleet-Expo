import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Alert, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Table, Row, Rows, } from 'react-native-table-component';

const datos = [
    { vehiculo: 'Chevrolet beat', placa: 'COL-4568R', color: '#dddddd', entradas: 6, salidas: 5 },
    { vehiculo: 'Chevrolet beat', placa: 'COL-4568R', color: '#dddddd', entradas: 6, salidas: 5 },
    { vehiculo: 'Chevrolet beat', placa: 'COL-4568R', color: '#dddddd', entradas: 10, salidas: 10 },
    { vehiculo: 'Nissan Versa', placa: 'COL-1684D', color: '#fafafa', entradas: 8, salidas: 8 },
    { vehiculo: 'Nissan Versa', placa: 'COL-1684D', color: '#fafafa', entradas: 6, salidas: 7 }
];

export default class GeofenceAlerts extends Component {

    /**
     * Checar las variables ya que estas son las que insertaran datos ya que no se escriben bien
     */

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true,
            hasAlerts: false,
            tableHead: ['Ent', 'Sal', 'Vehículo', 'Placa'],
            widthArr: [37, 37, 145, 95],
            data: datos.map(val => {
                return [
                    val.entradas,
                    val.salidas,
                    <View style={styles.view1}>
                        <Text style={{ fontFamily: 'aller-lt' }}>{val.vehiculo}</Text>
                        <View style={{ width: 16, height: 16, marginTop: 4, marginLeft: 5, marginRight: 5, backgroundColor: val.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                    </View>,
                    val.placa
                ];
            })
        }
    }

    static navigationOptions = {
        title: 'Entradas y salidas de geocerca',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
            marginLeft: -10
        }
    }

    async componentDidMount() {

        this.setState({
            hasAlerts: true,
            isLoading: false
        });
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
        const state = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ height: 120, flexDirection: 'row', alignContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: "center", alignSelf: 'center' }}>
                        <Icon type='font-awesome' name="map-signs" size={52} containerStyle={{ flex: 1, marginTop: 20 }} />
                        <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 16, marginVertical: 20, textAlign: "center" }}>Nombre de geocerca: {this.props.navigation.getParam('nombre', 'Geocerca')}</Text>
                    </View>
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
                <ScrollView
                    refreshControl={this._refreshControl()}
                >
                    <View style={{ margin: 4 }} style={{ alignSelf: 'center' }} >
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Row data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={[styles.text, { fontFamily: 'aller-bd' }]} />
                        </Table>
                        {state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={state.isLoading} />}
                        {!state.isLoading && state.hasAlerts &&
                            <View style={{ flex: 1 }}>
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                        <Rows data={state.data} widthArr={state.widthArr} textStyle={[styles.text, { fontFamily: 'aller-lt' }]} />
                                    </Table>
                                </ScrollView>
                            </View>
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
    view1: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center"
    }
});