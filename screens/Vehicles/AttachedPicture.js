/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Alert
} from 'react-native';

import { Button } from 'react-native-elements'
import NetInfo from '@react-native-community/netinfo'

export default class AttachedPicture extends React.Component {
    static navigationOptions = {
        title: 'Seleccionar una foto',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-lt',
            fontWeight: '200'
        },
        headerRight: <View></View>
    }

    state = {
        image: this.props.navigation.getParam('image', { uri: '' }),
        ruta: this.props.navigation.getParam('ruta_post_documento', ''),
        numero_foto: this.props.navigation.getParam('numero_foto', 0)
    }

    async entregar() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            try {
                const data = new FormData();
                data.append('id_usuario', '5');
                data.append('file', {
                    uri: this.state.image.uri,
                    name: this.state.image.uri.match(/(\w-*)+((\.jp\w{1,2})|(\.png))/)[0],
                    type: `image/${this.state.image.uri.match(/((\.jp\w{1,2})|(\.png))/)[0].replace('jpg', 'jpeg').replace('.', '')}`,
                });

                if (this.state.numero_foto != 0) {
                    data.append('foto', this.state.numero_foto);
                }

                console.log(data);

                const response = await fetch(`http://34.95.33.177:3001/${this.state.ruta}`, {
                    method: 'POST',
                    body: data
                });
                console.log(response);

                const result = await response.json();
                console.log(result);

                if (result.message.includes('exito')) {
                    if (this.state.numero_foto != 0) {
                        this.props.navigation.state.params.doOnBack(this.state.numero_foto, this.state.image.uri);
                        this.props.navigation.pop();
                    } else {
                        this.props.navigation.state.params.doOnBack(this.state.ruta);
                        this.props.navigation.pop(2);
                    }
                }

            } catch (error) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(error);
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', margin: 25 }}>
                <Image
                    resizeMode='contain'
                    source={this.state.image}
                    style={{
                        flex: 3
                    }}
                />

                <Button
                    title='Cargar'
                    containerStyle={{ height: 40 }}
                    buttonStyle={{ flex: 1, backgroundColor: '#ff8834' }}
                    titleStyle={{ fontFamily: 'aller-lt' }}
                    onPress={() => this.entregar()}
                />
            </View>
        )
    }
}