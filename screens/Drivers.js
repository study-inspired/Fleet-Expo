/**
 * @format
 * @flow
**/

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    StatusBar
} from 'react-native';
import { Button, colors, Card } from 'react-native-elements'

const users = [
    {
        name: 'Laura Gutierrez',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        auto: {}
    },
    {
        name: 'Manuel Leyva',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        auto: {
            nombre: 'Chevrolet Aveo',
            placa: 'COL-6462J',
            color: '#e0e0e0',
        },
    },
    {
        name: 'Leonel Ortega',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        auto: {
            nombre: 'Chevrolet Beat',
            placa: 'COL-4518V',
            color: '#4287f5',
        },
    },
    {
        name: 'Otro',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        auto: {
            nombre: 'Chevrolet Aveo',
            placa: 'COL-6472J',
            color: '#948d8d',
        },
    },
]

export default class Drivers extends React.Component {
    static navigationOptions = {
        title: 'Conductores',
        headerStyle: {
            elevation: 4,
            backgroundColor: '#ec6a2c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontFamily: 'aller-bd',
            fontWeight: '200',
            textAlign: "center",
            flex: 1,
        },
    }

    state = {
        //loading: true,
    }

    // async componentDidMount(){
    //     try {
    //         const result = await fetch('http://localhost:3000/webservice/interfaz60/obtener_unidades_conductores_propietario',{
    //             method: 'POST',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 p_correo: 'carloslarios.15@gmail.com',
    //                 p_pass: '123456',
    //             }),
    //         })

    //         const drivers = await result.json();
    //         console.log(drivers);

    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // desvincularVehiculo(unidad, propietario, chofer) {
    //     try {
    //         const result = await fetch('http://localhost:3000/webservice/interfaz69/desvincular_vehiculo', {
    //             method: 'POST',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 p_id_unidad: unidad,
    //                 p_id_propietario: propietario,
    //                 p_id_chofer: chofer
    //             }),
    //         })

    //         const drivers = await result.json();
    //         console.log(drivers);

    //     } catch (error) {
    //         throw error;
    //     }
    // }

    render() {
        return (!this.state.loading &&
            <SafeAreaView style={{ flex: 1 }}>
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
                            flex: 1,
                            fontSize: 16
                        }}
                        title="Agregar conductor"
                        onPress={() => { this.props.navigation.navigate('AddDriver') }}
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
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={{ marginBottom: 15 }}>
                        {
                            users.map((u) => {
                                let vinculado = Object.entries(u.auto).length !== 0;
                                return (
                                    <Card key={u.name}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}>
                                                <Image
                                                    style={{
                                                        borderRadius: 38,
                                                        width: 76,
                                                        height: 76,
                                                        marginLeft: 5
                                                    }}
                                                    resizeMode="cover"
                                                    source={{ uri: u.avatar }}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 4,
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <Text style={{ fontFamily: 'aller-bd', fontSize: 16, marginBottom: 5 }}>{u.name}</Text>
                                                {vinculado &&
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{fontFamily:'aller-lt', fontSize: 12}}>{u.auto.nombre}</Text>
                                                    <View style={{ width: 16, height: 16, marginHorizontal: 5, backgroundColor: u.auto.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                    <Text style={{fontSize: 12, marginBottom: 10, fontFamily: 'aller-lt' }}>{u.auto.placa}</Text>
                                                </View>
                                                }
                                                <Button
                                                    title={vinculado ? 'Desvincular auto' : 'Vincular auto'}
                                                    buttonStyle={{
                                                        width: 140,
                                                        marginLeft: 5,
                                                        backgroundColor: '#ff8834'
                                                    }}
                                                    titleStyle={{fontFamily: 'aller-lt'}}
                                                    onPress={() => { !vinculado ? this.props.navigation.navigate('LinkVehicle') : {} }}
                                                />
                                            </View>
                                            <Text
                                                style={{
                                                    fontFamily: 'aller-bd',
                                                    fontSize: 16,
                                                    color: '#20d447',
                                                    marginBottom: 5,
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0
                                                }}>
                                                {vinculado ? 'Listo' : ''}
                                            </Text>
                                        </View>
                                    </Card>
                                );
                            })
                        }

                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fafafa',
    },
    body: {
        backgroundColor: '#fff',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 76,
    }
});