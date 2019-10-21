import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView} from 'react-native';
import { Table, Rows } from 'react-native-table-component';
import { Button } from 'react-native-elements'
const Data = {
    Fecha: '24/08/2019',
    Tipo: 'Mecánico',
    Descripcion: 'Afinación',
    Costo: '$2000.00 MXN',
    Kilometraje: '35000 km',
    'Mecánico o taller': 'Rojo Motors'
}

export default class ServiceConsultation extends Component {
    static navigationOptions = {
        title: 'Mantenimiento ' + Data.Tipo,
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>,
    }

    render() {
        const vehicle = this.props.navigation.getParam('vehicle', {})

        const tabla = {
            widthArr: [150, 150],
            tableData: Object.entries(Data)
        }

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

                    <View style={{ margin: 4, alignSelf: 'center' }} >
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Rows data={tabla.tableData} widthArr={tabla.widthArr} textStyle={styles.text} />
                        </Table>
                    </View>

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