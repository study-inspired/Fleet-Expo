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
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';

import { Button, Card } from 'react-native-elements'

const conductores = [
    {
        name: 'Laura Gutierrez',
        avatar: 'https://www.klrealty.com.au/wp-content/uploads/2018/11/user-image-.png',
        ganancia: '2,000.00 MXN'
    },
    {
        name: 'Manuel Leyva',
        avatar: 'https://www.klrealty.com.au/wp-content/uploads/2018/11/user-image-.png',
        ganancia: '1,750.00 MXN'
    },
    {
        name: 'Leonel Ortega',
        avatar: 'https://www.klrealty.com.au/wp-content/uploads/2018/11/user-image-.png',
        ganancia: '2,080.00 MXN'
    },
    {
        name: 'Otro',
        avatar: 'https://www.klrealty.com.au/wp-content/uploads/2018/11/user-image-.png',
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

    state = {
        isLoading: true,
        hasDrivers: false,
        drivers: []
    }

    async componentDidMount() {
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/interfaz134/reporte_tiempo_real', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_id_propietario: 1
                })
            });

            const data = await result.json();
            
            if (data.datos.length != 0) {
                this.setState({
                    drivers: data.datos,
                    hasDrivers: true,
                    isLoading: false
                });
            } else {
                Alert.alert('Info', 'No hay datos.');
                this.setState({
                    isLoading: false
                });
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
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={{ marginBottom: 15 }}>
                    {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                        { !this.state.isLoading && this.state.hasDrivers &&
                            this.state.drivers.map((c, i) => {
                                return (
                                    <Card key={i}>
                                        <TouchableOpacity 
                                            style={styles.touchableOpacity} 
                                            onPress={ () => this.props.navigation.navigate('RealTimeReport', { driver: c }) } >
                                            <View
                                                style={styles.imagecontainer}>
                                                <Image
                                                    style={styles.image}
                                                    resizeMode="cover"
                                                    source={{ uri: 'https://www.klrealty.com.au/wp-content/uploads/2018/11/user-image-.png' }} // c.avatar
                                                />
                                                <Text style={styles.textoBold}>{c.nombre}</Text>
                                            </View>
                                            <View
                                                style={styles.textoTouchable}>
                                                <Text style={styles.textoBold}>Ganancia actual</Text>
                                                <Text style={[styles.textoNormal, { marginBottom: 10, color:'#0e9bcf' }]}>$ {(+c.gananciaactual).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} MXN</Text>
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

