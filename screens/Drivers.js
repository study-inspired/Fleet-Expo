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
    StatusBar,
    Alert,
    ActivityIndicator,
    RefreshControl 
} from 'react-native';
import { Button, colors, Card } from 'react-native-elements'

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
        refreshing: false,
        isLoading: true,
        hasDrivers: false,
        drivers: {},
    }

    async componentDidMount(){
        try {
            const result = await fetch('http://34.95.33.177:3006/webservice/interfaz/obtener_unidades_conductores_de_propietario',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_correo: 'diana@gmail.com',
                    p_pass: '123456',
                }),
            })

            const data = await result.json();

            if (data.datos.length != 0) {
                let drivers = data.datos.map((d)=>{
                    return {
                        id: d.id_usuario, 
                        nombre: `${d.nombre} ${d.apellido.split(' ')[0]}`,
                        auto: d.marca ? {
                            nombre: `${d.marca} ${d.modelo}`,
                            placas: d.placas,
                            color: d.color.includes('#')?d.color:'#a8a8a8',
                        } : {},
                        avatar: 'https://www.klrealty.com.au/wp-content/uploads/2018/11/user-image-.png',
                    }
                })
                this.setState({
                    hasDrivers: true,
                    drivers: drivers, 
                    isLoading: false 
                });

            } else {
                Alert.alert('Info', 'No hay conductores!');
                this.setState({
                    isLoading: false
                });
            }

        } catch (error) {
            Alert.alert('Error', 'Hubo un error.')
            console.error(error);
            this.setState({
                isLoading: false
            });
        }
    }

    async desvincularVehiculo(unidad) {
        try {
            const result = await fetch('http://34.95.33.177:3006/webservice/interfaz69/desvincular_vehiculo', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_id_unidad: unidad,
                    p_id_propietario: 1,
                    p_id_chofer1: 1
                }),
            })

            const datos = await result.json();
            if (datos) {
                if (datos.msg) {
                    Alert.alert('Hubo un error', datos.msg);
                } else if (datos.datos){
                    Alert.alert('Operación exitosa!', 'Se desvinculó el vehículo correctamente.')
                }
                this.props.navigation.goBack();
            }

        } catch (error) {
            Alert.alert('Error', 'Hubo un error.')
            console.error(error);
        }
    }

    //Refresh control  
    _refreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this._refreshListView()} />
        )
    }

    _refreshListView() {
        this.setState({ refreshing: true }) //Start Rendering Spinner
        this.componentDidMount()  //<-- Recargo el refresh control
        this.setState({ refreshing: false }) //Stop Rendering Spinner
    }
    //Termina el refresh  

    render() {
        return (!this.state.loading &&
            <SafeAreaView style={{ flex: 1 }}>
                
                <ScrollView
                    refreshControl={this._refreshControl()}
                >
                
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
                <ScrollView 
                    contentInsetAdjustmentBehavior="automatic" 
                    style={styles.scrollView}>
                    <View style={{ marginBottom: 15 }}>
                        {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                        { !this.state.isLoading && this.state.hasDrivers &&
                            this.state.drivers.map((d, i) => {
                                let vinculado = Object.entries(d.auto).length !== 0;
                                return (
                                    <Card key={i}>
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
                                                    source={{ uri: d.avatar }}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 4,
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <Text style={{ fontFamily: 'aller-bd', fontSize: 16, marginBottom: 5 }}>{d.nombre}</Text>
                                                {vinculado &&
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{fontFamily:'aller-lt', fontSize: 12}}>{d.auto.nombre}</Text>
                                                    <View style={{ width: 16, height: 16, marginHorizontal: 5, backgroundColor: d.auto.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                                                    <Text style={{fontSize: 12, marginBottom: 10, fontFamily: 'aller-lt' }}>{d.auto.placas}</Text>
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
                                                    onPress={() => { !vinculado ? this.props.navigation.navigate('LinkVehicle', {id_propietario: 1, id_chofer: 1}) : this.desvincularVehiculo(d.id) }}
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
