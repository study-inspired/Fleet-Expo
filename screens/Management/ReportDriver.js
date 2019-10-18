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

import { Button, Card, ButtonGroup } from 'react-native-elements'
import { Table, Row, Rows } from 'react-native-table-component';



export default class ReportDriver extends React.Component {
    static navigationOptions = {
        title: 'Reporte conductor, socio conductor',
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
        selectedIndex: 0,
        Actual1Head: ['TOTAL', 'Pagos Efectivo', 'Pagos Tarjeta'],
        Actual1Data: [
            ['$2,350.00 MXN', '$500.00 MXN', '$1,500.00 MXN'],
        ],
        Actual2Head: ['Sol. atendidas', 'Sol. rechazadas', 'T. recompensas'],
        Actual2Data: [
            ['24', '5', '$350.00 MXN'],
        ],
        Actual3Head: ['Pagados con Efectivo', 'Pagados con Tarjeta'],
        Actual3Data: [
            ['24', '16'],
        ],
        Actual4Head: ['Viajes', 'Horas operadas'],
        Actual4Data: [
            ['40', '16'],
        ],
        Actual5Head: ['Comisión plataforma', 'Ganancia Final'],
        Actual5Data: [
            ['$235.00 MXN', '$2,115.00 MXN'],
        ],
    }

    updateIndex (selectedIndex) {
        this.setState({selectedIndex})
    }

    render() {
        const conductor = {
            name: this.props.navigation.getParam('name', '?'),
            avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
            ganancia: '2,000.00 MXN'
        }

        const buttons = ['Actual', 'Semana', 'Mes']
        const { selectedIndex } = this.state

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
                        style={{
                            marginTop:36
                        }}>
                        <ButtonGroup
                            onPress={this.updateIndex.bind(this)}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{ height: 33 }}
                            buttonStyle={{ backgroundColor: '#ff8834' }}
                            selectedButtonStyle={{ backgroundColor: '#ec6a2c' }}
                            textStyle={{fontFamily: 'aller-lt'}}
                            selectedTextStyle={{fontFamily: 'aller-lt'}}
                        />
                    </View>
                    <View style={styles.width40}>
                        <Table borderStyle={styles.border}>
                            <Row data={this.state.Actual1Head} style={styles.head} textStyle={styles.text} />
                            <Rows data={this.state.Actual1Data} textStyle={styles.text} />
                        </Table>
                    </View>
                    <View style={styles.width40}>
                        <Table borderStyle={styles.border}>
                            <Row data={this.state.Actual2Head} style={styles.head} textStyle={styles.text} />
                            <Rows data={this.state.Actual2Data} textStyle={styles.text} />
                        </Table>
                    </View>
                    <View style={styles.width100}>
                        <Table borderStyle={styles.border}>
                            <Row data={this.state.Actual3Head} style={styles.head} textStyle={styles.text} />
                            <Rows data={this.state.Actual3Data} textStyle={styles.text} />
                        </Table>
                    </View>
                    <View style={styles.width100}>
                        <Table borderStyle={styles.border}>
                            <Row data={this.state.Actual4Head} style={styles.head} textStyle={styles.text} />
                            <Rows data={this.state.Actual4Data} textStyle={styles.text} />
                        </Table>
                    </View>
                    <View style={styles.width100}>
                        <Table borderStyle={styles.border}>
                            <Row data={this.state.Actual5Head} style={styles.head} textStyle={styles.text} />
                            <Rows data={this.state.Actual5Data} textStyle={styles.text} />
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
        marginBottom: 15
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
    },
    width40: { 
        flex: 1, 
        width: Dimensions.get('window').width - 40 
    },
    width100: { 
        flex: 1, 
        width: Dimensions.get('window').width - 100, 
        alignSelf: 'center' 
    }, 
    border: { 
        borderWidth: 2, 
        borderColor: '#c8e1ff' 
    }
});