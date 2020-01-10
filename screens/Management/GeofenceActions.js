/**
 * @format
 * @flow
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Alert,
    RefreshControl,
    Picker
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';

export default class GeofenceActions extends React.Component {

    static navigationOptions = {
        title: 'Acciones en geocerca',
        headerTitleStyle: {
            elevation: 4,
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    state = {
        refreshing: false,
        isLoading: true,
        hasRecords: false,
        geofences: [],
        month: new Date().getMonth()
    }


    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/obtener_geocercas', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        p_id_usuario: 2,
                    }),
                })

                const datos = await result.json();

                if (datos.msg) {
                    Alert.alert('Hubo un error', datos.msg);
                    this.setState({ isLoading: false });
                } else {
                    if (datos.datos.length != 0) {
                        this.setState({ geofences: datos.datos.map(g => { return { nombre: g.nombre, entradas: 0, salidas: 0 } }), hasRecords: true, isLoading: false });
                        //console.log(this.state.geofences);
                    } else {
                        Alert.alert('Info', 'No hay geocercas registradas.');
                        this.setState({ isLoading: false });
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un error.');
                console.error(error);
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
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
        return (
            <View style={{ flex: 1 }}>
                <View elevation={2} style={{ height: 95, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16 }}>
                    <View style={{ flexDirection: "column", justifyContent: "center", marginTop: 25 }}>
                        <Text style={{ fontFamily: 'aller-lt', fontSize: 15 }}>Selecciona el mes a consultar</Text>
                        <Picker
                            mode='dropdown'
                            selectedValue={this.state.month}
                            style={{ height: 40, width: 150 }}
                            onValueChange={(value) => this.setState({ month: value })}
                        >
                            <Picker.Item label="Enero" value={0} />
                            <Picker.Item label="Febrero" value={1} />
                            <Picker.Item label="Marzo" value={2} />
                            <Picker.Item label="Abril" value={3} />
                            <Picker.Item label="Mayo" value={4} />
                            <Picker.Item label="Junio" value={5} />
                            <Picker.Item label="Julio" value={6} />
                            <Picker.Item label="Agosto" value={7} />
                            <Picker.Item label="Septiembre" value={7} />
                            <Picker.Item label="Octubre" value={9} />
                            <Picker.Item label="Noviembre" value={10} />
                            <Picker.Item label="Diciembre" value={11} />
                        </Picker>
                    </View>

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
                            right: 0
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
                <View style={{ flex: 1 }}>
                    {
                        this.state.isLoading ?
                            <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }}/>
                            :
                            <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}
                                refreshControl={this._refreshControl()}
                            >
                                <View style={{ marginBottom: 15 }}>

                                    {!this.state.isLoading && this.state.hasRecords &&
                                        this.state.geofences.map((a, i) => {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    onPress={() => this.props.navigation.navigate('GeofenceAlerts', { id_geocerca: a.id_geocerca, nombre: a.nombre })}
                                                >
                                                    <Card wrapperStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View
                                                            style={{
                                                                flex: 3,
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                            }}>
                                                            <Icon type='material-community' name="map" size={38} iconStyle={{ flex: 1, marginHorizontal: 5 }} />
                                                            <Text style={{ flex: 1, fontFamily: 'aller-bd', fontSize: 16, }}>{a.nombre}</Text>
                                                        </View>
                                                        <View
                                                            style={{
                                                                flex: 2,
                                                                flexDirection: 'column',
                                                                justifyContent: 'center',
                                                                alignItems: 'flex-start'
                                                            }}
                                                        >
                                                            <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 15, marginLeft: 5 }}>Salidas: {a.salidas}</Text>
                                                            <Text style={{ flex: 1, fontFamily: 'aller-lt', fontSize: 15, marginLeft: 5 }}>Entradas: {a.entradas}</Text>
                                                            {/* <Icon name='check-circle' size={14} color='#20d447' iconStyle={{ position: 'absolute', right: -24, top: 0 }} />
                                                        <Icon type='font-awesome' name='car' size={18} iconStyle={{ marginHorizontal: 5 }} />
                                                        <Text style={{ fontFamily: 'aller-bd', fontSize: 10, marginBottom: 1 }}>{a.vehiculo.nombre}</Text>
                                                        <Text style={{ fontFamily: 'aller-lt', fontSize: 9, }}>{a.vehiculo.placas}</Text> */}
                                                        </View>
                                                    </Card>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </View>
                            </ScrollView>
                    }
                </View>
            </View>
        );
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
