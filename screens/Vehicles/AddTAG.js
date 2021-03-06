/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import { Button, Icon } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import NetInfo from '@react-native-community/netinfo'

export default class AddTAG extends React.Component {
    static navigationOptions = {
        title: 'Agregar vehículo',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-lt',
            fontWeight: '200',
        },
        headerRight: <View></View>
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

    async _openGalery() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5
            // aspect: [4, 3],
        });

        //console.log(result);

        if (!result.cancelled) {
            this.props.navigation.navigate('AttachedPicture', { 
                doOnBack: this.props.navigation.state.params.doOnBack,
                ruta_post_documento: 'upload_Tag',
                image: { uri: result.uri },
                id_usuario: this.props.navigation.getParam('id_usuario', 0),
                niv: this.props.navigation.getParam('niv', '01234567891234567')
            })
        }
    }

    async _openCamera() {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5
            // aspect: [4, 3],
        });

        //console.log(result);

        if (!result.cancelled) {
            this.props.navigation.navigate('AttachedPicture', { 
                doOnBack: this.props.navigation.state.params.doOnBack,
                ruta_post_documento: 'upload_Tag',
                image: { uri: result.uri },
                id_usuario: this.props.navigation.getParam('id_usuario', 0),
                niv: this.props.navigation.getParam('niv', '01234567891234567')
            })
        }
    }

    render() {
        return (
            <View style={{ flex:1, marginHorizontal: 25, flexDirection: 'column' }}>
                <View style={{ flex:1, justifyContent: 'center', alignItems: "center" }}>
                    <Icon type='material-community' name="file-document-outline" size={160} color='#000' />
                    <Text style={{ textAlign: 'center', fontFamily: 'aller-bd', fontSize: 16 }}>TAG</Text>
                </View>
                <View style={{ flex:1, marginHorizontal: 25, alignItems: "center", marginTop:18 }}>
                    <Text style={styles.textoNormal}>Asegúrese que la informacón y la imágen sean legibles.</Text>
                    <Text style={styles.textoNormal}>Sube una foto de tu TAG que sea vigente y expedida por la secretaria correspondiente.</Text>
                    <Text style={styles.textoNormal}>Si la imágen no es clara vuelve a tomar otra foto o sube otra imágen.</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", bottom:15 }}>
                    <Button
                        type='outline'
                        icon={
                            <Icon
                                type='material-community'
                                name='camera-iris'
                                size={64}
                                color="black"
                            />
                        }
                        buttonStyle={{ marginHorizontal: 4 }}
                        onPress={this._openCamera.bind(this)}
                    />
                    <Button
                        type='outline'
                        icon={
                            <Icon
                                iconStyle={{
                                    marginTop: 6,
                                    marginBottom: 2,
                                    marginLeft: 8,
                                    width: 56,
                                    height: 58,
                                }}
                                type='font-awesome'
                                name='file-photo-o'
                                size={56}
                                color="black"
                            />
                        }
                        buttonStyle={{ marginHorizontal: 4 }}
                        onPress={this._openGalery.bind(this)}
                    />
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
        textAlign: 'justify',
        fontFamily: 'aller-lt',
        fontSize: 16,
        marginVertical: 2
    }
});