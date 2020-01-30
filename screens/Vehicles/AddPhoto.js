/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Alert
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import NetInfo from '@react-native-community/netinfo'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Globals from '../../constants/Globals';

export default class AddPhoto extends React.Component {
    static navigationOptions = {
        title: 'Agregar vehículo',
        headerTitleStyle: {
            flex: 1,
            fontFamily: 'aller-lt',
            textAlign: "center",
            fontWeight: '200',
        },
        headerRight: <View></View>
    }

    state = {
        delantera: '',
        trasera: '',
        izquierda: '',
        derecha: '',
        perfil: ''
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            this.props.navigation.goBack();
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Lo sentimos, necesitamos el permiso de camara para hacer ésto.');
            }
        }
    }

    onBack(lado, uri) {
        switch (lado) {
            case 3:
                this.setState({
                    trasera: uri
                })
                break;
            case 5:
                this.setState({
                    delantera: uri
                })
                break;
            case 2:
                this.setState({
                    derecha: uri
                })
                break;
            case 4:
                this.setState({
                    izquierda: uri
                })
                break;
            default:
                this.setState({
                    perfil: uri
                })
                break;
        }

        if (
            this.state.delantera != '' &&
            this.state.trasera != '' &&
            this.state.izquierda != '' &&
            this.state.derecha != '' &&
            this.state.perfil != ''
        ) {
            this.props.navigation.state.params.doOnBack('fotos', 
                [this.state.perfil, this.state.derecha, this.state.trasera, this.state.izquierda, this.state.delantera]
            );
            this.props.navigation.pop();
        }
    }

    async _openGalery(lado) {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5
            // aspect: [4, 3],
        });

        if (!result.cancelled) {
            let foto = 0;
            switch (lado) {
                case 'trasera':
                    console.log('Trasera');
                    foto = 3;
                    break;
                case 'delantera':
                    console.log('Delantera');
                    foto = 5;
                    break;
                case 'lado derecho':
                    console.log('Lado derecho');
                    foto = 2;
                    break;
                case 'lado izquierdo':
                    console.log('Lado izquierdo');
                    foto = 4;
                    break;
                default:
                    console.log('Perfil');
                    foto = 1;
                    break;
            }

            this.props.navigation.navigate('AttachedPicture', {
                doOnBack: this.onBack.bind(this),
                ruta_post_documento: `upload_fotografia${foto}`,
                numero_foto: foto,
                image: { uri: result.uri },
                id_usuario: this.props.navigation.getParam('id_usuario', 0),
                niv: this.props.navigation.getParam('niv', '01234567891234567')
            });
        }
    }

    async _openCamera(lado) {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5
            // aspect: [4, 3],
        });

        if (!result.cancelled) {
            let foto = 0;
            switch (lado) {
                case 'trasera':
                    console.log('Trasera');
                    foto = 3;
                    break;
                case 'delantera':
                    console.log('Delantera');
                    foto = 5;
                    break;
                case 'lado derecho':
                    console.log('Lado derecho');
                    foto = 2;
                    break;
                case 'lado izquierdo':
                    console.log('Lado izquierdo');
                    foto = 4;
                    break;
                default:
                    console.log('Perfil');
                    foto = 1;
                    break;
            }

            this.props.navigation.navigate('AttachedPicture', {
                doOnBack: this.onBack.bind(this),
                ruta_post_documento:  `upload_fotografia${foto}`,
                numero_foto: foto,
                image: { uri: result.uri },
                id_usuario: this.props.navigation.getParam('id_usuario', 0),
                niv: this.props.navigation.getParam('niv', '01234567891234567')
            });
        }
    }

    tipoDeFoto(lado) {
        Alert.alert(
            `Seleccionar imágen ${lado}`,
            `Selecciona la imagen desde la cámara o la galería`,
            [
                {
                    text: 'Abrir cámara',
                    onPress: () => this._openCamera(lado)
                },
                {
                    text: 'Abrir galería',
                    onPress: () => this._openGalery(lado)
                }
            ]
        );
    }

    render() {
        return (
            <View style={{ flex: 1, marginHorizontal: 25, flexDirection: 'column' }}>
                <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 25, marginBottom: 15 }}>
                        <TouchableOpacity
                            style={[styles.touchable, { borderRightWidth: 0 }]}
                            onPress={
                                () => this.tipoDeFoto('lado izquierdo')
                            }
                        >
                            {this.state.izquierda != '' ?
                                <Image
                                    resizeMode='cover'
                                    style={styles.image}
                                    source={{ uri: `${Globals.server}${this.state.izquierda.replace('/var/www/html', '')}` }}
                                /> :
                                <Text style={[styles.textoNormal, { textAlign: 'center', textAlignVertical: 'center' }]}>Lado izquierdo</Text>
                            }
                        </TouchableOpacity>
                        <View style={{ width: 100, height: 300 }}>
                            <TouchableOpacity
                                style={[styles.touchable, { borderBottomWidth: 0 }]}
                                onPress={
                                    () => this.tipoDeFoto('trasera')
                                }
                            >
                                {this.state.trasera != '' ?
                                    <Image
                                        resizeMode='cover'
                                        style={styles.image}
                                        source={{ uri: `${Globals.server}${this.state.trasera.replace('/var/www/html', '')}` }}
                                    /> :
                                    <Text style={[styles.textoNormal, { textAlign: 'center', textAlignVertical: 'center' }]}>Trasera</Text>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.touchable}
                                onPress={
                                    () => this.tipoDeFoto('perfil')
                                }
                            >
                                {this.state.perfil != '' ?
                                    <Image
                                        resizeMode='cover'
                                        style={styles.image}
                                        source={{ uri: `${Globals.server}${this.state.perfil.replace('/var/www/html', '')}` }}
                                    /> :
                                    <Text style={[styles.textoNormal, { textAlign: 'center', textAlignVertical: 'center' }]}>Perfil</Text>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.touchable, { borderTopWidth: 0 }]}
                                onPress={
                                    () => this.tipoDeFoto('delantera')
                                }
                            >
                                {this.state.delantera != '' ?
                                    <Image
                                        resizeMode='cover'
                                        style={styles.image}
                                        source={{ uri: `${Globals.server}${this.state.delantera.replace('/var/www/html', '')}` }} //Url de la imagen desde el servidor
                                    /> :
                                    <Text style={[styles.textoNormal, { textAlign: 'center', textAlignVertical: 'center' }]}>Delantera</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.touchable, { borderLeftWidth: 0 }]}
                            onPress={
                                () => this.tipoDeFoto('lado derecho')
                            }
                        >
                            {this.state.derecha != '' ?
                                <Image
                                    resizeMode='cover'
                                    style={styles.image}
                                    source={{ uri: `${Globals.server}${this.state.derecha.replace('/var/www/html', '')}` }}
                                /> :
                                <Text style={[styles.textoNormal, { textAlign: 'center', textAlignVertical: 'center' }]}>{'Lado\nderecho'}</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.textoBold, { textAlign: 'center', fontFamily: 'aller-bd', fontSize: 16 }]}>Fotografías del vehículo</Text>
                </View>
                <View style={{ flex: 1, marginHorizontal: 25, alignItems: "center" }}>
                    <Text style={styles.textoNormal}>Asegúrese que las fotografías sean claras y el vehículo aparezca correctamente.</Text>
                    <Text style={styles.textoNormal}>Las fotos del vehículo deben ser actuales.</Text>
                    <Text style={styles.textoNormal}>Si la imágen no es clara vuelve a tomar otra foto o sube otra imágen.</Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#fff',
    },
    textoNormal: {
        flex: 1,
        fontFamily: 'aller-lt',
        fontSize: 15,
        textAlign: 'justify'
    },
    textoBold: {
        fontFamily: 'aller-bd',
    },
    touchable: {
        borderColor: '#000',
        borderWidth: 2,
        backgroundColor: '#fafafa',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 96,
        height: 96
    }
});