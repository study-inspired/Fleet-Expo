/**
 * @format
 * @flow
**/

import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet
} from 'react-native';

import { Button, Card } from 'react-native-elements'

const conductores = [
    {
        name: 'Laura Gutierrez',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        ganancia: '2,000.00 MXN'
    },
    {
        name: 'Manuel Leyva',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        ganancia: '1,750.00 MXN'
    },
    {
        name: 'Leonel Ortega',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        ganancia: '2,080.00 MXN'
    },
    {
        name: 'Otro',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        ganancia: '2,100.00 MXN'
    },
]

export default class RealTimeReports extends React.Component {
    static navigationOptions = {
        title: 'Reportes en tiempo real',
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
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={{ marginBottom: 15 }}>
                        {
                            conductores.map((c) => {
                                return (
                                    <Card key={c.name}>
                                        <TouchableOpacity 
                                            style={styles.touchableOpacity} 
                                            onPress={ () => this.props.navigation.navigate('RealTimeReport', { name: c.name }) } >
                                            <View
                                                style={styles.imagecontainer}>
                                                <Image
                                                    style={styles.image}
                                                    resizeMode="cover"
                                                    source={{ uri: c.avatar }}
                                                />
                                                <Text style={styles.textoBold}>{c.name}</Text>
                                            </View>
                                            <View
                                                style={styles.textoTouchable}>
                                                <Text style={styles.textoBold}>Ganancia actual</Text>
                                                <Text style={[styles.textoNormal, { marginBottom: 10, color:'#0e9bcf' }]}>${c.ganancia}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                );
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subHeader: {
        height: 70, 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 14, 
        marginBottom: 10
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16, 
    },
    touchableOpacity: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start'
    },
    textoTouchable: {
        flex: 3,
        flexDirection: 'column',
        alignItems: 'center'
    }, 
    imagecontainer: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center'
    },
    image: {
        borderRadius: 38,
        width: 76,
        height: 76,
    }
})

