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

import { Button, Card, Icon } from 'react-native-elements'

const conductores = [
    {
        name: 'Laura Gutierrez',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
    },
    {
        name: 'Manuel Leyva',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
    },
    {
        name: 'Leonel Ortega',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
    },
    {
        name: 'Otro',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
]

export default class ReportByDriver extends React.Component {
    static navigationOptions = {
        title: 'Reporte por conductor',
        headerStyle: {
            elevation: 4
        },
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
                <View elevation={2} style={styles.subHeader}>
                    <Text style={[styles.textoBold, { marginVertical: 25, marginLeft:16 }]}>Seleccione un conductor a consultar</Text>
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
                <ScrollView style={styles.scrollView} contentInsetAdjustmentBehavior="automatic">
                    <View style={{ marginBottom: 15 }}>
                        {
                            conductores.map((c) => {
                                return (
                                    <Card key={c.name}>
                                        <TouchableOpacity 
                                            style={styles.touchableOpacity} 
                                            onPress={ () => this.props.navigation.navigate('ReportDriver',{ name: c.name }) }>
                                            <Icon type='font-awesome' name="bar-chart" size={38} iconStyle={{ position:'absolute', left: 5 }} />
                                            <View
                                                style={styles.imageContainer}>
                                                <Image
                                                    style={styles.imagenConductor}
                                                    resizeMode="cover"
                                                    source={{ uri: c.avatar }}
                                                />
                                                <Text style={styles.textoBold}>{c.name}</Text>
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
        fontSize: 16, 
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16, 
    },
    touchableOpacity: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    textoTouchable: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'center',
    }, 
    imagenConductor: {
        borderRadius: 38,
        width: 76,
        height: 76,
    }, 
    scrollView: {
        backgroundColor:  '#fafafa'
    }
})