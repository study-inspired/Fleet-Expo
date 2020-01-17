import React from 'react';
import { StyleSheet, Text, View, Picker, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Input, Button, Overlay } from 'react-native-elements';
import { FontAwesome } from "@expo/vector-icons";
import ColorPalette from 'react-native-color-palette'
import NetInfo from '@react-native-community/netinfo'

const colores = [
    '#000000', '#5F5F5F', '#8A8A8A', '#A8A8A8', '#DBDBDB', '#FAFAFA',
    '#751717', '#8f0b0b', '#a31f1f', '#c91616', '#cf3434', '#ed2f2f',
    '#9C640C', '#D68910', '#F39C12', '#F5B041', '#F8C471', '#FAE5D3',
    '#c7a614', '#e3be1b', '#f7d540', '#ebe93d', '#fffc40', '#fffd85',
    '#2f7829', '#328f13', '#45a823', '#5dc23a', '#5cd952', '#7df573',
    '#0a065e', '#241e9e', '#322bcc', '#1d49cf', '#3c67e8', '#5ca7ed',
    '#54048a', '#721dab', '#8f17d4', '#972fd4', '#a350d4', '#bb6aeb',
    '#e607de', '#e32bdc', '#ff17f6', '#ff40f8', '#ff66f9', '#ff96fb',
]

export default class AddVehicle extends React.Component {
    static navigationOptions = {
        title: 'Vehículo',
        headerStyle: {
            elevation: 4
        },
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
        },
        headerRight: <View></View>,
    }

    constructor(props) {
        super(props);
        this.state = {
            poliza: { cargado: false, ruta: '', estado: false },
            factura: { cargado: false, ruta: '', estado: false },
            holograma: { cargado: false, ruta: '', estado: false },
            tarjeta: { cargado: false, ruta: '', estado: false },
            tag: { cargado: false, ruta: '', estado: false },
            fotos: { cargado: false, rutas: ['', '', '', '', ''], estado: false, numero_foto: 0 },
            modelo: '',
            marca: '',
            kilometraje: '',
            placa: '',
            serie: this.props.navigation.getParam('niv', ''),
            color: '#000',
            tipo_vehiculo: '',
            selectColor: false,
            problema: this.props.navigation.getParam('problema', false),
            id_unidad: this.props.navigation.getParam('id_unidad', 0),
            isLoading: true
        }
    }

    onBack(documento, url) {
        switch (documento) {
            case 'upload_poliza_seguro':
                this.setState({ poliza: { cargado: true, ruta: url, estado: false } });
                break;
            case 'upload_factura_vehiculo':
                this.setState({ factura: { cargado: true, ruta: url, estado: false } });
                break;
            case 'upload_Holograma':
                this.setState({ holograma: { cargado: true, ruta: url, estado: false } });
                break;
            case 'upload_Tarjeta_circulacion':
                this.setState({ tarjeta: { cargado: true, ruta: url, estado: false } });
                break;
            case 'upload_Tag':
                this.setState({ tag: { cargado: true, ruta: url, estado: false } });
                break;
            default:
                this.setState({ fotos: { cargado: true, rutas: url, estado: false } });
                break;
        }
    }

    async _getEstadoDocumentosVehiculoGeneral(niv_unidad) {
        try {
            const result = await fetch('http://35.203.42.33:3000/EstadoDocumentosVehiculoxUsuario', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    in_niv: niv_unidad,
                }),
            });

            const data = await result.json();

            // console.log(niv_unidad, data.data);
            let fotos = ['', '', '', '', ''];
            data.data.forEach(documento => {
                if (documento.id_documento_out == 11) {
                    this.setState({ poliza: { cargado: false, ruta: documento.nombre, estado: true } });
                } else if (documento.id_documento_out == 12) {
                    this.setState({ factura: { cargado: false, ruta: documento.nombre, estado: true } });
                } else if (documento.id_documento_out == 13) {
                    this.setState({ holograma: { cargado: false, ruta: documento.nombre, estado: true } });
                } else if (documento.id_documento_out == 14) {
                    this.setState({ tarjeta: { cargado: false, ruta: documento.nombre, estado: true } });
                } else if (documento.id_documento_out == 15) {
                    this.setState({ tag: { cargado: false, ruta: documento.nombre, estado: true } });
                } else if (documento.id_documento_out == 16) {
                    fotos[0] = documento.nombre;
                } else if (documento.id_documento_out == 17) {
                    fotos[1] = documento.nombre;
                } else if (documento.id_documento_out == 18) {
                    fotos[2] = documento.nombre;
                } else if (documento.id_documento_out == 19) {
                    fotos[3] = documento.nombre;
                } else if (documento.id_documento_out == 20) {
                    fotos[4] = documento.nombre;
                }
            });
            if (fotos.some(foto => foto != '')) {
                this.setState({ fotos: { cargado: false, rutas: fotos, estado: true } });
            }
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
        }
    }

    async _datosUnidad(id_unidad) {
        try {
            const result = await fetch('http://35.203.42.33:3006/webservice/datos_unidad', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    in_id_unidad: id_unidad,
                }),
            });

            const data = await result.json();
            // console.log('id_unidad:', id_unidad, data.datos[0]);
            this.setState({
                marca: data.datos[0].marca,
                modelo: data.datos[0].modelo,
                kilometraje: data.datos[0].kilometraje + "",
                placa: data.datos[0].placas,
                color: data.datos[0].color,
                tipo_vehiculo: data.datos[0].id_tipo_vehiculo + ""
            });
        } catch (error) {
            Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
            console.error(error);
        }
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            this.props.navigation.goBack();
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        } else {
            if (this.state.problema) {
                console.log('Problema con documentos.');
                this.setState({
                    poliza: { cargado: true, ruta: '', estado: false },
                    factura: { cargado: true, ruta: '', estado: false },
                    holograma: { cargado: true, ruta: '', estado: false },
                    tarjeta: { cargado: true, ruta: '', estado: false },
                    tag: { cargado: true, ruta: '', estado: false },
                    fotos: { cargado: true, rutas: ['', '', '', '', ''], estado: false, numero_foto: 0 },
                });

                await this._datosUnidad(this.state.id_unidad);
                await this._getEstadoDocumentosVehiculoGeneral(this.state.serie);
            }
            this.setState({
                isLoading: false
            });
        }
    }

    async enviarDatos() {
        if (this.state.problema) {
            this.props.navigation.navigate('DataSent'); // Modificar el estado de los documentos modificados.
        }
        // else {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            if (
                this.state.modelo != '' &&
                this.state.marca != '' &&
                this.state.kilometraje != '' &&
                this.state.placa != '' &&
                this.state.serie != '' &&
                this.state.tipo_vehiculo != '' &&
                this.state.poliza.cargado &&
                this.state.factura.cargado &&
                this.state.holograma.cargado &&
                this.state.tarjeta.cargado &&
                this.state.tag.cargado &&
                this.state.fotos.cargado
            ) {
                try {
                    const result = await fetch('http://35.203.42.33:3006/webservice/interfaz61/agregar_unidad', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            p_modelo: this.state.modelo,
                            p_marca: this.state.marca,
                            p_kilometraje: this.state.kilometraje,
                            p_placas: this.state.placa,
                            p_descripcion: '',
                            p_niv: this.state.serie,
                            p_id_tipo_vehiculo: this.state.tipo_vehiculo,
                            p_color: this.state.color,
                            p_id_usuario_propietario: 2,
                            in_fotografia1: this.state.fotos.rutas[0],
                            in_fotografia2: this.state.fotos.rutas[1],
                            in_fotografia3: this.state.fotos.rutas[2],
                            in_fotografia4: this.state.fotos.rutas[3],
                            in_fotografia5: this.state.fotos.rutas[4],
                        }),
                    })

                    const datos = await result.json();
                    console.log('Agregar unidad:');
                    console.log(datos);
                    if (datos.datos.length > 0) {
                        //this.setState({ conductor: datos.datos[0] });
                        this.props.navigation.navigate('DataSent');
                    } else {
                        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                        //this.props.navigation.goBack();
                    }

                } catch (error) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    console.error(error);
                }
            } else {
                Alert.alert('Atención', 'Debes llenar todos los campos y subir los todos documentos antes de continuar.');
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
        // }
    }

    verificarNIV(nextScreen) {
        if (this.state.serie != '' && this.state.serie.length == 17) {
            this.props.navigation.navigate(nextScreen, { doOnBack: this.onBack.bind(this), id_usuario: 2, niv: this.state.serie })
        } else {
            Alert.alert('Atención', 'Debes llenar los datos anteriores antes de seleccionar los documentos o fotografías.');
        }
    }

    verificarEscrituraNiv() {
        if (this.state.serie == '') {
            Alert.alert('Atención', 'El NIV o serie no puede estar en blanco.');
            return false;
        } else if (this.state.serie.length != 17) {
            Alert.alert('Atención', 'El NIV o serie introducido no es correcto.');
            return false;
        } else {
            return true;
        }
    }

    render() {
        return (
            this.state.isLoading ?
                <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} />
                :
                <View style={{ flex: 1 }}>
                    <Overlay
                        overlayStyle={{ width: 350 }}
                        isVisible={this.state.selectColor}
                        windowBackgroundColor="rgba(0, 0, 0, .4)"
                        height={500}
                        onBackdropPress={() => this.setState({ selectColor: false })}
                    >
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontFamily: 'aller-lt', textAlign: 'center', fontSize: 16, marginTop: 5 }}>Selecciona un color</Text>

                            <View style={{ flex: 1, marginTop: -15 }}>
                                <ColorPalette
                                    onChange={color => this.setState({ color: color })}
                                    value={this.state.color}
                                    colors={colores}
                                    icon={
                                        <FontAwesome name={'check'} size={25} color={'white'} />
                                    }
                                    title=''
                                />
                            </View>
                            <Button
                                title='OK'
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                buttonStyle={{ marginTop: 420, marginHorizontal: 15, marginBottom: 10 }}
                                onPress={() => { this.setState({ selectColor: false }) }}
                            />
                        </View>
                    </Overlay>
                    <View elevation={2} style={styles.sectionContainer}>
                        <Text style={styles.texto}>Agregar vehículo</Text>
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
                                right: 7,
                                top: -68,
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
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <View style={{ marginHorizontal: 15 }}>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Input
                                        title="Marca"
                                        placeholder="Marca"
                                        inputStyle={styles.textoRegular16}
                                        value={this.state.marca}
                                        editable={!this.state.problema}
                                        onChangeText={text => this.setState({ marca: text })}
                                    />
                                    <Input
                                        title="Modelo"
                                        placeholder="Modelo"
                                        inputStyle={styles.textoRegular16}
                                        value={this.state.modelo}
                                        editable={!this.state.problema}
                                        onChangeText={text => this.setState({ modelo: text })}
                                    />
                                    <Input
                                        title="Kilometraje"
                                        placeholder="Kilometraje"
                                        inputStyle={styles.textoRegular16}
                                        keyboardType='numeric'
                                        value={this.state.kilometraje}
                                        editable={!this.state.problema}
                                        onChangeText={text => this.setState({ kilometraje: text })}
                                    />
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Input
                                        title="NIV o Serie"
                                        placeholder="NIV o Serie"
                                        inputStyle={styles.textoRegular16}
                                        value={this.state.serie}
                                        autoCapitalize='characters'
                                        maxLength={17}
                                        editable={!this.state.problema}
                                        onChangeText={text => this.setState({ serie: text.toUpperCase() })}
                                        onEndEditing={() => this.verificarEscrituraNiv()}
                                    />
                                    <Input
                                        title="Placa"
                                        placeholder="Placa"
                                        inputStyle={styles.textoRegular16}
                                        value={this.state.placa}
                                        editable={!this.state.problema}
                                        onChangeText={text => this.setState({ placa: text })}
                                    />
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 10 }}>
                                <TouchableOpacity
                                    onPress={() => { this.state.problema ? null : this.setState({ selectColor: true }) }}
                                    style={{
                                        height: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 15,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={[styles.textoRegular16, { flex: 3 }]}>Selecciona tu color</Text>
                                    <View style={[styles.colorVehiculo, { backgroundColor: this.state.color }]}></View>

                                </TouchableOpacity>

                                <Picker
                                    enabled={!this.state.problema}
                                    style={[
                                        styles.textoRegular16,
                                        {
                                            height: 40,
                                            marginVertical: 3,
                                        }
                                    ]}
                                    itemStyle={styles.textoRegular16}
                                    selectedValue={this.state.tipo_vehiculo}
                                    onValueChange={(tipo) => this.setState({ tipo_vehiculo: tipo })}>
                                    <Picker.Item label="Tipo" value="" />
                                    <Picker.Item label="Auto normal" value="0" />
                                    <Picker.Item label="Auto de lujo" value="1" />
                                    <Picker.Item label="Camioneta" value="2" />
                                </Picker>

                                <TouchableOpacity
                                    onPress={() => (this.state.poliza.estado || !this.state.poliza.cargado) ? this.verificarNIV('AddPolicy') : null}
                                    style={{
                                        height: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 3,
                                        alignItems: 'center'
                                    }}
                                >
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.textoRegular16}>Póliza de seguro</Text>
                                    </View>
                                    <View style={styles.viewTouchable}>
                                        <Text style={[styles.textoRegular16, { color: !this.state.poliza.cargado ? '#000' : '#fff' }]}>Cargar</Text>
                                        {
                                            !this.state.poliza.estado && !this.state.poliza.cargado ?
                                            <FontAwesome name="chevron-right" size={18} color='black' />
                                            :
                                            this.state.poliza.estado && !this.state.poliza.cargado ?
                                                <FontAwesome name="exclamation-circle" size={18} color='#ebcc1c' />
                                                :
                                                !this.state.poliza.estado && this.state.poliza.cargado ?
                                                    <FontAwesome name="check-circle" size={18} color='#20d447' /> 
                                                        :
                                                        <FontAwesome name="file-photo-o" size={18} color='#ff8834' />
                                        }
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => (this.state.factura.estado || !this.state.factura.cargado) ? this.verificarNIV('AddBill') : null}
                                    style={{
                                        height: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 3,
                                        alignItems: 'center'
                                    }}
                                >
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.textoRegular16}>Factura del vehículo</Text>
                                    </View>
                                    <View style={styles.viewTouchable}>
                                        <Text style={[styles.textoRegular16, { color: !this.state.factura.cargado ? '#000' : '#fff' }]}>Cargar</Text>
                                        {
                                            !this.state.factura.estado && !this.state.factura.cargado ?
                                            <FontAwesome name="chevron-right" size={18} color='black' />
                                            :
                                            this.state.factura.estado && !this.state.factura.cargado ?
                                                <FontAwesome name="exclamation-circle" size={18} color='#ebcc1c' />
                                                :
                                                !this.state.factura.estado && this.state.factura.cargado ?
                                                    <FontAwesome name="check-circle" size={18} color='#20d447' /> 
                                                        :
                                                        <FontAwesome name="file-photo-o" size={18} color='#ff8834' />
                                        }
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => (this.state.holograma.estado || !this.state.holograma.cargado) ? this.verificarNIV('AddHologram') : null}
                                    style={{
                                        height: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 3,
                                        alignItems: 'center'
                                    }}
                                >
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.textoRegular16}>Holograma ambiental</Text>
                                    </View>
                                    <View style={styles.viewTouchable}>
                                        <Text style={[styles.textoRegular16, { color: !this.state.holograma.cargado ? '#000' : '#fff' }]}>Cargar</Text>
                                        {
                                            !this.state.holograma.estado && !this.state.holograma.cargado ?
                                            <FontAwesome name="chevron-right" size={18} color='black' />
                                            :
                                            this.state.holograma.estado && !this.state.holograma.cargado ?
                                                <FontAwesome name="exclamation-circle" size={18} color='#ebcc1c' />
                                                :
                                                !this.state.holograma.estado && this.state.holograma.cargado ?
                                                    <FontAwesome name="check-circle" size={18} color='#20d447' /> 
                                                        :
                                                        <FontAwesome name="file-photo-o" size={18} color='#ff8834' />
                                        }
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => (this.state.tarjeta.estado || !this.state.tarjeta.cargado) ? this.verificarNIV('AddCard') : null}
                                    style={{
                                        height: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 3,
                                        alignItems: 'center'
                                    }}
                                >
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.textoRegular16}>Tarjeta de circulación</Text>
                                    </View>
                                    <View style={styles.viewTouchable}>
                                        <Text style={[styles.textoRegular16, { color: !this.state.tarjeta.cargado ? '#000' : '#fff' }]}>Cargar</Text>
                                        {
                                            !this.state.tarjeta.estado && !this.state.tarjeta.cargado ?
                                            <FontAwesome name="chevron-right" size={18} color='black' />
                                            :
                                            this.state.tarjeta.estado && !this.state.tarjeta.cargado ?
                                                <FontAwesome name="exclamation-circle" size={18} color='#ebcc1c' />
                                                :
                                                !this.state.tarjeta.estado && this.state.tarjeta.cargado ?
                                                    <FontAwesome name="check-circle" size={18} color='#20d447' /> 
                                                        :
                                                        <FontAwesome name="file-photo-o" size={18} color='#ff8834' />
                                        }
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => (this.state.tag.estado || !this.state.tag.cargado) ? this.verificarNIV('AddTAG') : null}
                                    style={{
                                        height: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 3,
                                        alignItems: 'center'
                                    }}
                                >
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.textoRegular16}>TAG</Text>
                                    </View>
                                    <View style={styles.viewTouchable}>
                                        <Text style={[styles.textoRegular16, { color: !this.state.tag.cargado ? '#000' : '#fff' }]}>Cargar</Text>
                                        {
                                            !this.state.tag.estado && !this.state.tag.cargado ?
                                            <FontAwesome name="chevron-right" size={18} color='black' />
                                            :
                                            this.state.tag.estado && !this.state.tag.cargado ?
                                                <FontAwesome name="exclamation-circle" size={18} color='#ebcc1c' />
                                                :
                                                !this.state.tag.estado && this.state.tag.cargado ?
                                                    <FontAwesome name="check-circle" size={18} color='#20d447' /> 
                                                        :
                                                        <FontAwesome name="file-photo-o" size={18} color='#ff8834' />
                                        }
                                    </View>
                                </TouchableOpacity>
{/*            
    Cargar las 5 imagenes del vehiculo si hay problema e indicar cual es la que tiene el problema.
*/}
                                <TouchableOpacity
                                    onPress={() => (this.state.fotos.estado || !this.state.fotos.cargado) ? this.verificarNIV('AddPhoto') : null}
                                    style={{
                                        height: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 3,
                                        alignItems: 'center'
                                    }}
                                >
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.textoRegular16}>Fotografías del vehículo</Text>
                                    </View>
                                    <View style={styles.viewTouchable}>
                                        <Text style={[styles.textoRegular16, { color: !this.state.fotos.cargado ? '#000' : '#fff' }]}>Cargar</Text>
                                        {
                                            !this.state.fotos.estado && !this.state.fotos.cargado ?
                                            <FontAwesome name="chevron-right" size={18} color='black' />
                                            :
                                            this.state.fotos.estado && !this.state.fotos.cargado ?
                                                <FontAwesome name="exclamation-circle" size={18} color='#ebcc1c' />
                                                :
                                                !this.state.fotos.estado && this.state.fotos.cargado ?
                                                    <FontAwesome name="check-circle" size={18} color='#20d447' /> 
                                                        :
                                                        <FontAwesome name="file-photo-o" size={18} color='#ff8834' />
                                        }
                                    </View>
                                </TouchableOpacity>

                                {
                                    this.state.problema &&
                                    <Text style={styles.textoInfo}>Por favor vuelva a cargar los documentos marcados con <FontAwesome name="times-circle" size={16} color='#e81a1a' /> o <FontAwesome name="exclamation-circle" size={16} color='#ebcc1c' />, asegurese que el documento que se solicita sea válido y que contenga la información visible y clara. </Text>
                                }
                                <Button
                                    title='Siguiente'
                                    buttonStyle={{ backgroundColor: '#ff8834', marginVertical: 20 }}
                                    titleStyle={{ fontFamily: 'aller-lt' }}
                                    onPress={() => { this.enviarDatos() }} //cambiar el estado de los documentos modificados
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    texto: {
        marginVertical: 20,
        fontSize: 20,
        fontFamily: 'aller-lt',
        textAlign: 'center',
    },
    textoBold16: {
        fontFamily: 'aller-bd',
        fontSize: 16
    },
    textoRegular16: {
        fontFamily: 'aller-lt',
        fontSize: 16
    },
    ingresarTexto: {
        fontFamily: 'aller-lt',
        height: 30,
        width: 180,
        marginHorizontal: 5,
        borderBottomWidth: 2,
        borderColor: '#ccc',
        color: 'black',
        borderBottomColor: 'black',
        fontSize: 15
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingTop: 5,
        paddingBottom: 5
    },
    textoInfo: {
        fontFamily: 'aller-lt',
        marginHorizontal: 30,
        marginTop: 10,
        marginBottom: 0,
        fontSize: 14,
        textAlign: 'justify'
    },
    viewTouchable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    colorVehiculo: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1
    },
});