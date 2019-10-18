/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar
} from 'react-native';

import { Button, colors, Card } from 'react-native-elements'
import { FontAwesome } from "@expo/vector-icons";

const vehiculos = [
    {
        nombre: 'Chevrolet Aveo',
        imagen: 'http://www.cosasdeautos.com.ar/wp-content/uploads/2011/06/aveo2012-mexico-3.jpg',
        placa: 'COL-6462J',
        vigencia: '25/01/2021',
        color: '#e0e0e0',
        problema: false
    },
    {
        nombre: 'NISSAN Versa',
        imagen: 'https://dealerimages.dealereprocess.com/image/upload/c_limit,f_auto,fl_lossy/v1/svp/Pix_PNG1280/2017/17nissan/17nissanversasedansv2a/nissan_17versasedansv2a_frontview',
        placa: 'COL-1684D',
        vigencia: '25/01/2021',
        color: '#ffffff',
        problema: false
    },
    {
        nombre: 'Chevrolet Beat',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/812y-rC3v0L._SX425_.jpg',
        placa: 'COL-4518V',
        vigencia: '25/01/2021',
        color: '#4287f5',
        problema: true
    },
    {
        nombre: 'Chevrolet Aveo',
        imagen: 'http://www.cosasdeautos.com.ar/wp-content/uploads/2011/06/aveo2012-mexico-3.jpg',
        placa: 'COL-6472J',
        vigencia: '25/01/2021',
        color: '#948d8d',
        problema: true
    },
    {
        nombre: 'NISSAN Versa',
        imagen: 'https://dealerimages.dealereprocess.com/image/upload/c_limit,f_auto,fl_lossy/v1/svp/Pix_PNG1280/2017/17nissan/17nissanversasedansv2a/nissan_17versasedansv2a_frontview',
        placa: 'COL-1684E',
        vigencia: '25/01/2021',
        color: '#ffffff',
        problema: false
    },
    {
        nombre: 'Chevrolet Beat',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/812y-rC3v0L._SX425_.jpg',
        placa: 'COL-4562R',
        vigencia: '25/01/2021',
        color: '#c72020',
        problema: false
    },
]

export default class VehiclesView extends React.Component {
    static navigationOptions = {
        title: 'Vehículos',
        headerStyle: {
            elevation: 4,
            backgroundColor: '#ec6a2c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
        },
    }

    state = {
        selected: null
    }
    
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#ff8834" barStyle="light-content" />
                <View elevation={2} style={styles.sectionContainer}>
                    <Button
                        type='clear'
                        icon={{
                            name: "add-circle",
                            size: 32,
                            color: colors.primary
                        }}
                        buttonStyle={{
                            position: 'absolute',
                            flexDirection: 'column',
                            alignSelf: 'center',
                            top: -10
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            fontFamily: 'aller-lt',
                            flex: 1
                        }}
                        title="Agregar vehículo"
                        onPress={() => { this.props.navigation.navigate('AddVehicle') }}
                    />

                    <Button
                        type='clear'
                        icon={{
                            name: "help",
                            size: 32,
                            color: '#ff8834'
                        }}
                        buttonStyle={{
                            position: 'absolute',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            right: 0,
                            top: -10
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            fontFamily: 'aller-lt',
                            flex: 1,
                            fontSize: 12
                        }}
                        title="Ayuda"
                    />
                </View>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View style={{ marginBottom: 15 }}>
                        {
                            vehiculos.map((v) => {
                                return (
                                    <Card key={v.placa}>
                                        <TouchableOpacity
                                            /*key={i}*/
                                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                            onPress={() => { v.problema?this.props.navigation.navigate('AddVehicle'): null }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}>
                                                <Image
                                                    style={styles.imagen}
                                                    resizeMode="cover"
                                                    source={{ uri: v.imagen }}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 5,
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.texto700}>{v.nombre}</Text>
                                                    <View style={{ width: 16, height: 16, marginTop: 4, marginLeft: 5, backgroundColor: v.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                </View>

                                                <Text style={styles.texto600}>{v.placa}</Text>
                                                <Text style={styles.texto70012}>Vigencia de operación:</Text>
                                                <Text style={styles.texto600, { fontSize: 12 }}>{v.vigencia}</Text>
                                            </View>
                                            <FontAwesome name={v.problema?'warning':'check-circle'} size={18} color={v.problema?'#ebcc1c':'#20d447'} style={styles.listo} />
                                            <Button
                                                type='clear'
                                                icon={{
                                                    name: "delete",
                                                    size: 24,
                                                    color: '#ff8834'
                                                }}
                                                buttonStyle={{
                                                    position: 'absolute',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    right: -15,
                                                }}
                                                iconContainerStyle={{
                                                    flex: 1,
                                                }}
                                                titleStyle={{
                                                    fontFamily: 'aller-lt',
                                                    flex: 1,
                                                    fontSize: 12
                                                }}
                                                title="Eliminar"
                                            />
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
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fafafa',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 76
    },
    button: {
        backgroundColor: '#ff8834',
    },
    texto600: {
        fontFamily: 'aller-lt',
        fontSize: 16,
        marginBottom: 5
    },
    texto700: {
        fontFamily: 'aller-bd',
        fontSize: 16,
        marginBottom: 5
    },
    texto70012: {
        fontFamily: 'aller-bd',
        fontSize: 12,
        marginBottom: 5
    },
    listo: {
        marginTop: 2,
        marginBottom: 5,
        position: 'absolute',
        top: 0,
        right: 6
    },
    imagen: {
        width: 50,
        height: 50,
    }
});