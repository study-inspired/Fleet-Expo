/**
 * @format
 * @flow
**/

import React from 'react';

import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    Alert,
} from 'react-native';

import { Button, Card } from 'react-native-elements'
import { Table, Row, Rows } from 'react-native-table-component';

export default class RealTimeReport extends React.Component {
    static navigationOptions = {
        title: 'Reporte en tiempo real',
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
        tableHead: ['TOTAL', 'Efectivo', 'Tarjeta', 'Comisión', 'Ganancia'],
        tableData: [],
        driver: this.props.navigation.getParam('driver', {}),
    }

    async componentDidMount() {
        try {
            const result = await fetch('', {
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_id_propietario: this.state.driver.id_chofer1 // cual id es?
                })
            });

            const data = await result.json();

            if (data.datos.length != 0) {
                this.setState({
                    hasInfo: true,
                    tableData: [
                        data.datos[0].GananciaActual,
                        data.datos[0].Efectivo,
                        data.datos[0].Tarjeta,
                        data.datos[0].comision,
                        data.datos[0].gananciafin
                    ],
                    isLoading: false,
                });
            } else {
                Alert.alert('Info', 'No hay datos.');
                //this.props.navigation.goBack();
                this.setState({
                    isLoading: false
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
            
            //this.props.navigation.goBack();
            this.setState({
                isLoading: false
            });
        }
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <View elevation={5} style={styles.subHeader}>
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
                            alignSelf: 'flex-end'
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
                <Card containerStyle={styles.card} >
                    <View
                        style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={{ uri: 'https://www.klrealty.com.au/wp-content/uploads/2018/11/user-image-.png' }} // this.state.driver.avatar
                        />
                        <Text style={styles.textoBold}>{this.state.driver.nombre}</Text>
                    </View>
                    <View
                        style={styles.cardText}>
                        <Text style={[styles.textoNormal, { marginBottom: 10 }]}>Ganancia actual:  </Text>
                        <Text style={[styles.textoBold, { marginBottom: 10, color: '#0e9bcf' }]}>$ {this.state.tableData[0]} MXN</Text>
                    </View>
                    <View style={{ flex: 4, width: Dimensions.get('window').width-40 }}>
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
                            <Rows data={this.state.tableData} textStyle={styles.text} />
                        </Table>
                    </View>
                </Card>
            </View>
        )
    }
}

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, fontSize:12 },
    subHeader: {
        height: 70, 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 14, 
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16, 
    },
    scrollView: {
        backgroundColor:  '#fafafa'
    },
    card: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: 15 
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 15
    }, 
    cardText: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        borderRadius: 38,
        width: 76,
        height: 76,
    }
});