/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    ActivityIndicator
} from 'react-native';

import { Button, Icon } from 'react-native-elements'
import NetInfo from '@react-native-community/netinfo'
import Globals from '../../constants/Globals';

export default class DataSent extends React.Component {
    static navigationOptions = {
        header: null
    }

    state = {
        isloading: true,
        id_solicitud: 0,
        tiempo: 0,
        tipo_solicitud: '',
        email_soporte: '',
        telefono: ''
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const result = await fetch(`${Globals.server}:3003/webservice/tiempos/tiempos_solicitud`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const datos = await result.json();
                const data = datos.datos[0];
                if (data.msg) {
                    Alert.alert('Error', data.msg)
                } else {
                    this.setState({
                        id_solicitud: data.id_solicitud,
                        tiempo: data.tiempo,
                        tipo_solicitud: data.tipo_solicitud,
                        email_soporte: data.email_soporte,
                        telefono: data.telefono,
                        isloading: false
                    })
                }
            } catch (error) {
                Alert.alert('Error', 'Ha ocurrido un error.')
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 25 }}>
                {this.state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} />}
                {
                    !this.state.isloading &&
                    <View>
                        <View style={{ justifyContent: 'center', marginBottom: 20, marginTop: 30 }}>
                            <Icon
                                name='check-circle'
                                color='#20d447'
                                size={228}
                            />
                        </View>
                        <View style={{ marginHorizontal: 35 }}>
                            <Text style={styles.textoNormal}>Los datos y documentos han sido enviados para su validación, se te notificará el resultado en un máximo de {this.state.tiempo} horas.</Text>
                            <View style={{ marginVertical: 15 }}>
                                <Text style={{ fontFamily: 'aller-lt', textAlign: 'center' }}>{this.state.telefono}</Text>
                                <Text style={{ fontFamily: 'aller-lt', textAlign: 'center' }}>{this.state.email_soporte}</Text>
                            </View>
                        </View>
                        <Button
                            title='OK'
                            buttonStyle={{ bottom: 0, marginVertical: 15, backgroundColor: '#ff8834' }}
                            titleStyle={{ fontFamily: 'aller-lt' }}
                            onPress={() => { this.props.navigation.pop(2) }}
                        />
                    </View>
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    textoNormal: {
        textAlign: 'justify',
        fontFamily: 'aller-lt',
        fontSize: 16,
        marginVertical: 5
    }
});