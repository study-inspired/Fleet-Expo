import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { Input, Button, Overlay, Divider } from 'react-native-elements';
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import ColorPalette from 'react-native-color-palette';
import NetInfo from '@react-native-community/netinfo';
import Layout from '../../constants/Layout'

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
            color: '#000000',
            tipo_vehiculo: '',
            selectColor: false,
            problema: this.props.navigation.getParam('problema', false),
            id_unidad: this.props.navigation.getParam('id_unidad', 0),
            isLoading: true,
            tipo_nombre: '',
            selectType: false
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
            const response = await fetch('http://35.203.42.33:3006/webservice/datos_unidad', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    in_id_unidad: id_unidad,
                }),
            });

            const { datos } = await response.json();
            // console.log('id_unidad:', id_unidad, data.datos[0]);
            this.setState({
                marca: datos[0].marca,
                modelo: datos[0].modelo,
                kilometraje: datos[0].kilometraje + "",
                placa: datos[0].placas,
                color: datos[0].color,
                tipo_vehiculo: datos[0].id_tipo_vehiculo + "",
                tipo_nombre: datos[0].id_tipo_vehiculo == 0 ? 'Automóvil estandar' : datos[0].id_tipo_vehiculo == 1 ? 'Automóvil de lujo' : datos[0].id_tipo_vehiculo == 2 ? 'Motocicleta' : datos[0].id_tipo_vehiculo == 3 ? 'Camioneta' : 'Bicicleta'
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

    //Verificar si existe el niv

    async _verificarDatos(nextScreen) {
        let campos = `${this.state.modelo == '' ? 'modelo, ' : ''}${this.state.marca == '' ? 'marca, ' : ''}${this.state.kilometraje == '' ? 'kilometraje, ' : ''}${this.state.placa == '' ? 'placas, ' : ''}${this.state.serie == '' ? 'NIV o Serie, ' : ''}${this.state.tipo_vehiculo == '' ? 'tipo de vehículo, ' : ''}`;
        let faltantes = campos.match(/,/g);
        if (faltantes != null) {
            let el_los = `${faltantes.length != 1 ? 'los campos' : 'el campo'}`;
            Alert.alert('Atención', `Debes llenar ${el_los} ${campos.replace(/, $/g, '')} antes de continuar.`);
        } else {
            if (await this._verificarNIV()) {
                this.props.navigation.navigate(nextScreen, { doOnBack: this.onBack.bind(this), id_usuario: 2, niv: this.state.serie })
            }
        }
    }

    async _verificarNIV() {
        if (this.state.serie == '') {
            Alert.alert('Atención', 'El NIV o serie no puede estar en blanco.');
            return false;
        } else if (this.state.serie.length != 17) {
            Alert.alert('Atención', 'El NIV o serie introducido no es correcto.');
            return false;
        } else {
            const response = await fetch('http://35.203.42.33:3006/webservice/validar_niv', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_niv: this.state.serie
                })
            });

            const { datos, msg } = await response.json();

            if (msg) {
                Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                console.error(msg);
            } else if (datos) {
                if (datos[0].respuesta.includes('existe')) {
                    Alert.alert('Info', datos[0].respuesta);
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    async _verificarConexion() {
        const { isConnected } = await NetInfo.fetch();
        if (!isConnected) {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
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
                        overlayStyle={{ width: Layout.window.width - 30, height: 470 }}
                        animationType="fade"
                        isVisible={this.state.selectColor}
                        windowBackgroundColor="rgba(0, 0, 0, .4)"
                        onBackdropPress={() => this.setState({ selectColor: false })}
                    >
                        <View style={{ flexDirection: "column" }}>
                            <Text style={[styles.textoRegular16, { textAlign: 'center', marginTop: 5 }]}>Selecciona un color</Text>
                            <Divider style={{ backgroundColor: 'blue', marginTop: 15, marginBottom: 5 }} />
                            <View style={{ flex: 1, marginTop: -15 }}>
                                <ColorPalette
                                    onChange={color => this.setState({ color: color, selectColor: false })}
                                    value={this.state.color}
                                    colors={colores}
                                    icon={
                                        <FontAwesome name={'check'} size={25} color={this.state.color == '#FAFAFA' ? '#000000' : '#FAFAFA'} />
                                    }
                                    title=''
                                />
                            </View>
                            {/* <Button
                                title='Seleccionar'
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                buttonStyle={{ marginTop: 420, marginHorizontal: 15, marginBottom: 10, backgroundColor: '#ff8834' }}
                                onPress={() => { this.setState({ selectColor: false }) }}
                            /> */}
                        </View>
                    </Overlay>
                    <Overlay
                        animationType="fade"
                        isVisible={this.state.selectType}
                        windowBackgroundColor="rgba(0, 0, 0, .4)"
                        overlayStyle={{ width: Layout.window.width - 30, height: 'auto' }}
                        onBackdropPress={() => this.setState({ selectType: false })}
                    >
                        <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                            <Text style={[styles.textoRegular16, { textAlign: 'center' }]}>Seleccionar tipo de vehículo</Text>
                            <Divider style={{ backgroundColor: 'blue', marginTop: 15, marginBottom: 10 }} />
                            <TouchableNativeFeedback
                                onPress={() => { this.setState({ tipo_nombre: 'Automóvil estandar', tipo_vehiculo: '0', selectType: false }) }}
                            >
                                <View style={{
                                    height: 30,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginVertical: 4,
                                    alignItems: 'center',
                                    backgroundColor: this.state.tipo_vehiculo == '0' ? '#ff8834' : '#fff',
                                    borderRadius: 5
                                }}>
                                    <Text style={[styles.textoRegular16, { marginHorizontal: 5, color: this.state.tipo_vehiculo == '0' ? '#fff' : '#000', }]}>Automóvil estandar</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                onPress={() => { this.setState({ tipo_nombre: 'Automóvil de lujo', tipo_vehiculo: '1', selectType: false }) }}
                            >
                                <View style={{
                                    height: 30,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginVertical: 4,
                                    alignItems: 'center',
                                    backgroundColor: this.state.tipo_vehiculo == '1' ? '#ff8834' : '#fff',
                                    borderRadius: 5
                                }}>
                                    <Text style={[styles.textoRegular16, { marginHorizontal: 5, color: this.state.tipo_vehiculo == '1' ? '#fff' : '#000', }]}>Automóvil de lujo</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                onPress={() => { this.setState({ tipo_nombre: 'Motocicleta', tipo_vehiculo: '2', selectType: false }) }}
                            >
                                <View style={{
                                    height: 30,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginVertical: 4,
                                    alignItems: 'center',
                                    backgroundColor: this.state.tipo_vehiculo == '2' ? '#ff8834' : '#fff',
                                    borderRadius: 5
                                }}>
                                    <Text style={[styles.textoRegular16, { marginHorizontal: 5, color: this.state.tipo_vehiculo == '2' ? '#fff' : '#000', }]}>Motocicleta</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                onPress={() => { this.setState({ tipo_nombre: 'Camioneta', tipo_vehiculo: '3', selectType: false }) }}
                            >
                                <View style={{
                                    height: 30,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginVertical: 4,
                                    alignItems: 'center',
                                    backgroundColor: this.state.tipo_vehiculo == '3' ? '#ff8834' : '#fff',
                                    borderRadius: 5
                                }}>
                                    <Text style={[styles.textoRegular16, { marginHorizontal: 5, color: this.state.tipo_vehiculo == '3' ? '#fff' : '#000', }]}>Camioneta</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                onPress={() => { this.setState({ tipo_nombre: 'Bicicleta', tipo_vehiculo: '4', selectType: false }) }}
                            >
                                <View style={{
                                    height: 30,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginVertical: 4,
                                    alignItems: 'center',
                                    backgroundColor: this.state.tipo_vehiculo == '4' ? '#ff8834' : '#fff',
                                    borderRadius: 5
                                }}>
                                    <Text style={[styles.textoRegular16, { marginHorizontal: 5, color: this.state.tipo_vehiculo == '4' ? '#fff' : '#000', }]}>Bicicleta</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </Overlay>
                    <View elevation={2} style={styles.sectionContainer}>
                        <Text style={styles.texto}>Agregar vehículo</Text>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                            onPress={() => alert('Ayuda')}
                        >
                            <View style={{ flexDirection: 'column', alignItems: 'center', position: 'absolute', top: 12, right: 15 }}>
                                <Ionicons
                                    name={'ios-help-circle'}
                                    size={24}
                                    color='#ff8834'
                                />
                                <Text style={{ fontFamily: 'aller-bd', fontSize: 12, color: '#ff8834' }}>Ayuda</Text>
                            </View>
                        </TouchableNativeFeedback>
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
                                        onEndEditing={() => this._verificarNIV()}
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

                                {/* <Picker
                                    enabled={!this.state.problema}
                                    style={[
                                        styles.textoRegular16,
                                        {
                                            height: 40,
                                            marginVertical: 3,
                                            backgroundColor: '#cacaca'
                                        }
                                    ]}
                                    itemStyle={styles.textoRegular16}
                                    selectedValue={this.state.tipo_vehiculo}
                                    onValueChange={(tipo) => this.setState({ tipo_vehiculo: tipo })}>
                                    <Picker.Item label="Tipo" value="" />
                                    <Picker.Item label="Automóvil estandar" value="0" />
                                    <Picker.Item label="Automóvil de lujo" value="1" />
                                    <Picker.Item label="Motocicleta" value="2" />
                                    <Picker.Item label="Camioneta" value="3" />
                                    <Picker.Item label="Bicicleta" value="4" />
                                </Picker> */}

                                <TouchableOpacity
                                    onPress={() => { this.state.problema ? null : this.setState({ selectType: true }) }}
                                    style={{
                                        height: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 3,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={[styles.textoRegular16, { flex: 1 }]}>Tipo</Text>
                                    <View style={styles.viewTouchable}>
                                        <Text style={styles.textoRegular16}>{this.state.tipo_nombre}</Text>
                                        <View style={styles.touchableRightIcon}>
                                            <FontAwesome name="chevron-down" size={18} color='black' />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={async () => (this.state.poliza.estado || !this.state.poliza.cargado) ? await this._verificarDatos('AddPolicy') : null}
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
                                        <Text style={[styles.textoRegular16, { color: !this.state.poliza.cargado ? '#000' : '#fff', textAlign: 'right' }]}>Cargar</Text>
                                        <View style={styles.touchableRightIcon}>
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
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={async () => (this.state.factura.estado || !this.state.factura.cargado) ? await this._verificarDatos('AddBill') : null}
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
                                        <View style={styles.touchableRightIcon}>
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
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={async () => (this.state.holograma.estado || !this.state.holograma.cargado) ? await this._verificarDatos('AddHologram') : null}
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
                                        <View style={styles.touchableRightIcon}>
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
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={async () => (this.state.tarjeta.estado || !this.state.tarjeta.cargado) ? await this._verificarDatos('AddCard') : null}
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
                                        <View style={styles.touchableRightIcon}>
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
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={async () => (this.state.tag.estado || !this.state.tag.cargado) ? await this._verificarDatos('AddTAG') : null}
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
                                        <Text style={[styles.textoRegular16, { color: !this.state.tag.cargado ? '#000' : '#fff', }]}>Cargar</Text>
                                        <View style={styles.touchableRightIcon}>
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
                                        <View style={styles.touchableRightIcon}>
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
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    colorVehiculo: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1
    },
    touchableRightIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    }
});