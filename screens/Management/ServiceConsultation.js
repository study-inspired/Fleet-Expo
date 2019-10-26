import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, ActivityIndicator, Alert} from 'react-native';
import { Table, Rows } from 'react-native-table-component';
import { Button } from 'react-native-elements'

export default class ServiceConsultation extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Mantenimiento ' + navigation.getParam('tipo', 'Tipo').replace('a', 'á'),
            headerTitleStyle: {
                flex: 1,
                textAlign: "center",
                fontFamily: 'aller-bd',
                fontWeight: '200',
                fontSize: 18,
            },
            headerRight: <View></View>,
        }
    }

    state = {
        isLoading: true,
        hasInfo: false,
        widthArr: [150, 150],
        tableData: [],
        vehicle: this.props.navigation.getParam('vehicle', {}),
        id_servicio: this.props.navigation.getParam('id_servicio', 0),
        tipo: this.props.navigation.getParam('tipo', '')
    }

    async componentDidMount() {
        try {
            const result = await fetch('http://34.95.33.177:3006/webservice/interfaz136/obtener_servicios_detalle', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_id_servicios: this.state.id_servicio,
                    p_tipo: this.state.tipo
                })
            });

            const data = await result.json();
            if (data.datos.length != 0) {
                console.log(data.datos);
                let obj = data.datos[0];
                if (this.state.tipo == 'Neumatico') {
                    obj['Fecha servicio'] = obj.fecha_serv.slice(0, 10).split('-').reverse().join('/');
                    delete obj.fecha_serv;
                    obj['Descripción'] = obj.descripcion;
                    delete obj.descripcion;
                    obj['Costo'] = obj.costo;
                    delete obj.costo;
                    obj['Kilometraje'] = obj.kilometraje;
                    delete obj.kilometraje;
                    obj['Llantera o taller'] = obj.mecanico;
                    delete obj.mecanico;
                    obj['No. de neumáticos'] = obj.num_neumaticos;
                    delete obj.num_neumaticos;
                    obj['Posición'] = obj.posicion_llanta;
                    delete obj.posicion_llanta;
                } else {
                    obj['Fecha servicio'] = obj.fecha_serv.slice(0, 10).split('-').reverse().join('/');
                    delete obj.fecha_serv;
                    obj['Descripción'] = obj.descripcion;
                    delete obj.descripcion;
                    obj['Costo'] = obj.costo;
                    delete obj.costo;
                    obj['Kilometraje'] = obj.kilometraje;
                    delete obj.kilometraje;
                    obj['Mecánico'] = obj.mecanico;
                    delete obj.mecanico;
                    delete obj.num_neumaticos;
                    delete obj.posicion_llanta;
                }
                this.setState({
                    hasInfo: true,
                    tableData: Object.entries(obj),
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
        const { vehicle } = this.state
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
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                    { !this.state.isLoading && this.state.hasInfo &&
                        <View style={{ margin: 4, alignSelf: 'center' }} >
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Rows data={this.state.tableData} widthArr={this.state.widthArr} textStyle={styles.text} />
                            </Table>
                        </View>
                    }
                </ScrollView>
            </SafeAreaView>

        );

    }
}

const styles = StyleSheet.create({
    text: { margin: 6, fontSize: 14,  },
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