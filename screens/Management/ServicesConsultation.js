import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, TouchableNativeFeedback } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Icon } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';


export default class ServicesConsultation extends Component {
    static navigationOptions = {
        title: 'Consulta de servicios',
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
        refreshing: false,
        isLoading: true,
        hasInfo: false,
        tableHead: ['Fecha', 'Tipo', ''],
        widthArr: [140, 140, 40],
        tableData: [],
        vehicle: this.props.navigation.getParam('vehicle', {})
    }

    async componentDidMount() {
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/interfaz140/obtener_servicios', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_id_unidad: this.state.vehicle.id
                })
            });

            const data = await result.json();
            if (data.datos.length != 0) {
                this.setState({
                    hasInfo: true,
                    tableData: data.datos.map(servicio => {
                        return [
                            servicio.fecha_serv.slice(0, 10).split('-').reverse().join('/'),
                            servicio.tipo.replace('a', 'á'),
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ServiceConsultation', { vehicle: this.state.vehicle, id_servicio: servicio.id_servicios, tipo: servicio.tipo })}>
                                <Icon type='material' name='remove-red-eye' size={24} />
                            </TouchableOpacity>
                        ]
                    }),
                    isLoading: false
                });
            } else {
                Alert.alert('Info', 'No hay datos.');
                // this.props.navigation.goBack();
                this.setState({
                    isLoading: false
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
            // this.props.navigation.goBack();
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

    render() {
        const { vehicle } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={this._refreshControl()}
                >
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
                                style={{ width: 150, height: 150, alignSelf: 'center' }}
                                resizeMode="cover"
                                source={{ uri: vehicle.imagen }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', height: 30 }}>
                            <Text style={[styles.textoBold, { marginTop: 4 }]}>{vehicle.nombre}</Text>
                            <View style={{ width: 16, height: 16, marginTop: 6, marginLeft: 5, marginRight: 5, backgroundColor: vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                            <Text style={[styles.textoNormal, { marginTop: 4 }]}>- {vehicle.placas}</Text>
                        </View>
                    </View>
                    <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                        {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                        {!this.state.isLoading && this.state.hasInfo &&
                            <View style={{ margin: 4, alignSelf: 'center' }} >
                                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                    <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.head} textStyle={[{ fontFamily: 'aller-bd' }, styles.text]} />
                                    <Rows data={this.state.tableData} widthArr={this.state.widthArr} textStyle={[{ fontFamily: 'aller-lt' }, styles.text]} />
                                </Table>
                            </View>
                        }
                    </ScrollView>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, fontSize: 14 },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
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
});
