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
    Dimensions
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
        tableHead: ['TOTAL', 'Efectivo', 'Tarjeta', 'Comisión', 'Ganancia'],
        tableData: [
            ['$3,000.00 MXN', '$2,000.00 MXN','$1,000.00 MXN', '-$300.00 MXN', '$2,700.00 MXN'],
        ],
    }

    render() {
        const conductor = {
            name: this.props.navigation.getParam('name', '?'),
            avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
            ganancia: '2,000.00 MXN'
        }

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
                            source={{ uri: conductor.avatar }}
                        />
                        <Text style={styles.textoBold}>{conductor.name}</Text>
                    </View>
                    <View
                        style={styles.cardText}>
                        <Text style={[styles.textoNormal, { marginBottom: 10 }]}>Ganancia actual:  </Text>
                        <Text style={[styles.textoBold, { marginBottom: 10, color: '#0e9bcf' }]}>${conductor.ganancia}</Text>
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