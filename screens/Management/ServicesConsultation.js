import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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

    render() {
        const vehicle = this.props.navigation.getParam('vehicle', {})
        const Data = [
            ['24/08/2019', 'Mecanico', 0],
            ['24/08/2019', 'Neumatico', 1],
            ['21/06/2019', 'Mecanico', 2],
            ['01/02/2019', 'Mecanico', 3]
        ]
        const tabla = {
            tableHead: ['Fecha', 'Tipo', ''],
            widthArr: [120, 120, 40],
            tableData: Data.map(data => {
                return [
                    data[0],
                    data[1],
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('ServiceConsultation', { vehicle: vehicle })}>
                        <Icon type='material' name='remove-red-eye' size={16} />
                    </TouchableOpacity>
                ]
            })
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
                        <Text style={styles.textoBold}>{vehicle.nombre}</Text>
                        <View style={{ width: 16, height: 16, marginTop: 4, marginLeft: 5, marginRight: 5, backgroundColor: vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                        <Text style={styles.textoNormal}>- {vehicle.placa}</Text>
                    </View>
                </View>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>

                    <View style={{ margin: 4, alignSelf: 'center' }} >
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Row data={tabla.tableHead} widthArr={tabla.widthArr} style={styles.head} textStyle={styles.text} />
                            <Rows data={tabla.tableData} widthArr={tabla.widthArr} textStyle={styles.text} />
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
    text: { margin: 6, fontSize: 12 },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
    btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' },
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