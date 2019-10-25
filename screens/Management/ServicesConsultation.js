import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Button, Icon } from 'react-native-elements'


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
        isLoading: true,
        hasInfo: false,
        tableHead: ['Fecha', 'Tipo', ''],
        widthArr: [140, 140, 40],
        tableData: [],
        vehicle: this.props.navigation.getParam('vehicle', {})
    }

    async componentDidMount() {
        try {
            const result = await fetch('http://34.95.33.177:3006/webservice/interfaz140/obtener_servicios', {
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
                    tableData: data.datos.map( servicio => {
                        return [
                            new Date(servicio.fecha_serv).toLocaleDateString(), 
                            servicio.tipo,
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ServiceConsultation', { vehicle: this.state.vehicle, id_servicio: servicio.id_servicios, tipo: servicio.tipo })}>
                                <Icon type='material' name='remove-red-eye' size={18} />
                            </TouchableOpacity>
                        ]
                    }),
                    isLoading: false
                });
            } else {
                Alert.alert('Info', 'No hay datos.');
                this.props.navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un error.');
            console.error(error);
            this.props.navigation.goBack();
        }
    }

    render() {
        const { vehicle } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
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
                            style={{ width: 150, height: 150, alignSelf: 'center' }}
                            resizeMode="cover"
                            source={{ uri: vehicle.imagen }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', height: 30 }}>
                        <Text style={[styles.textoBold, {marginTop: 4}]}>{vehicle.nombre}</Text>
                        <View style={{ width: 16, height: 16, marginTop: 6, marginLeft: 5, marginRight: 5, backgroundColor: vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                        <Text style={[styles.textoNormal, {marginTop: 4}]}>- {vehicle.placas}</Text>
                    </View>
                </View>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                    { !this.state.isLoading && this.state.hasInfo &&
                        <View style={{ margin: 4, alignSelf: 'center' }} >
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.head} textStyle={[{fontFamily: 'aller-bd'},styles.text]} />
                                <Rows data={this.state.tableData} widthArr={this.state.widthArr} textStyle={[{fontFamily: 'aller-lt'}, styles.text]} />
                            </Table>
                        </View>
                    }
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