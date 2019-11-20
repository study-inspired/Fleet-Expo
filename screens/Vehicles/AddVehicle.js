import React from 'react';
import { StyleSheet, Text, View, Picker, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Input, Button, Overlay } from 'react-native-elements';
import { FontAwesome } from "@expo/vector-icons";
import ColorPalette from 'react-native-color-palette'
import NetInfo from '@react-native-community/netinfo'

const colores = [
    '#000000', '#5F5F5F', '#8A8A8A', '#A8A8A8', '#FAFAFA', 
    '#C0391B', '#E74C1C', '#9B5916', '#8E441D', '#218019', 
    '#A0391B', '#EF4C1C', '#3AEE16', '#EE441D', '#ABEF19',
    '#8F8F8F', '#EFEFEF', '#CA67AC', '#8722FA', '#5E8219', 
    '#D98A6C', '#123456', '#9A5916', '#A5EE19', '#F18319'
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
    state = {
        documentos: [
            { nombre: 'Póliza de seguro', imagen: '', estado: 0, screen: 'AddPolicy' }, // 0 documento no cargado
            { nombre: 'Factura del vehículo', imagen: '', estado: 1, screen: 'AddBill' }, // 1 documento invalido
            { nombre: 'Holograma ambiental', imagen: '', estado: 3, screen: 'AddHologram' },
            { nombre: 'Tarjeta de circulación', imagen: '', estado: 2, screen: 'AddCard' }, // 2 documento con problemas
            { nombre: 'TAG', imagen: '', estado: 2, screen: 'AddTAG' },
            { nombre: 'Fotografías del vehículo', imagen: '', estado: 3, screen: 'AddPhoto' } // 3 documento aceptado
        ],
        modelo: '',
        marca: '',
        kilometraje: '',
        placa: '',
        serie: '',
        color: '#000',
        tipo_vehiculo: '',
        selectColor: false,
    }

    async componentDidMount() {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            this.props.navigation.goBack();
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    async enviarDatos() {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            if (
                this.state.modelo != '' && 
                this.state.marca != '' && 
                this.state.kilometraje != '' && 
                this.state.placa != '' &&
                this.state.serie != '' && 
                this.state.tipo_vehiculo != ''
            ) {
                this.props.navigation.navigate('DataSent');
            } else {
                Alert.alert('Atención', 'Debes llenar todos los campos antes de continuar.');
            }
        } else {
            Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Overlay
                    overlayStyle={{ width: 300 }}
                    isVisible={this.state.selectColor}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height='auto'
                >
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontFamily: 'aller-lt', textAlign: 'center', fontSize: 16 }}>Selecciona un color</Text>

                        <View style={{ flex: 1 }}>
                            <ColorPalette
                                onChange={color => this.setState({ color: color })}
                                value={this.state.color}
                                colors={colores}
                                icon={
                                    <FontAwesome name={'check-circle-o'} size={25} color={'black'} />
                                }
                                title=''
                            />
                        </View>
                        <Button
                            title='OK'
                            titleStyle={{fontFamily: 'aller-lt',}}
                            buttonStyle={styles.button, { marginTop: 280, marginHorizontal: 13, marginBottom: 10 }}
                            onPress={() => { this.setState({ selectColor: false }) }}
                        />
                    </View>
                </Overlay>
                <View elevation={2} style={styles.sectionContainer}>
                    <Text style={styles.texto}>Agregar vehiculo</Text>
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
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Input title="Modelo" placeholder="Modelo" inputStyle={styles.textoRegular16} 
                                    onChangeText={text => this.setState({modelo: text})}
                                />
                                <Input title="Marca" placeholder="Marca"  inputStyle={styles.textoRegular16}
                                    onChangeText={text => this.setState({marca: text})}
                                />
                                <Input title="Kilometraje" placeholder="Kilometraje" inputStyle={styles.textoRegular16}
                                    onChangeText={text => this.setState({kilometraje: text})}
                                />
                                <Input title="Placa" placeholder="Placa" inputStyle={styles.textoRegular16}
                                    onChangeText={text => this.setState({placa: text})}
                                />

                            </View>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Input title="Niv o Serie" placeholder="Niv o Serie" inputStyle={styles.textoRegular16}
                                    onChangeText={text => this.setState({serie: text})}
                                />
                            </View>
                        </View>
                        <View style={{ marginHorizontal: 10 }}>
                            <TouchableOpacity
                                onPress={() => { this.setState({ selectColor: true }) }}
                                style={{
                                    height: 30,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 25,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={[styles.textoRegular16, { flex: 3 }]}>Selecciona tu color</Text>
                                <FontAwesome name='circle' size={18} color={this.state.color} iconStyle={{ flex: 1 }} />
                            </TouchableOpacity>

                            <Picker
                                style={[
                                    styles.textoRegular16, 
                                    {
                                        height: 40,
                                        marginVertical: 5,
                                    }
                                ]}
                                itemStyle={styles.textoRegular16}
                                selectedValue={this.state.tipo_vehiculo}
                                onValueChange={(tipo) => this.setState({ tipo_vehiculo: tipo })}>
                                <Picker.Item label="Tipo"/>
                                <Picker.Item label="Auto normal" value="Auto normal" />
                                <Picker.Item label="Auto de lujo" value="Auto de lujo" />
                                <Picker.Item label="Camioneta" value="Camioneta" />
                            </Picker>

                            {
                                this.state.documentos.map((documento) => {
                                    return (
                                        <TouchableOpacity
                                            key={documento.screen}
                                            onPress={() => { this.props.navigation.navigate(documento.screen) }}
                                            style={{
                                                height: 30,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginVertical: 3,
                                                alignItems: 'center'
                                            }}
                                        >
                                            <View style={{ flex: 3 }}>
                                                <Text style={styles.textoRegular16}>{documento.nombre}</Text>
                                            </View>
                                            <View style={styles.viewTouchable}>
                                                <Text style={styles.textoRegular16}>Cargar</Text>
                                                {
                                                    documento.estado == 0 &&
                                                    <FontAwesome name="chevron-right" size={18} color='black' /> ||

                                                    documento.estado == 1 &&
                                                    <FontAwesome name="times-circle" size={18} color='#e81a1a' /> ||

                                                    documento.estado == 2 &&
                                                    <FontAwesome name="exclamation-circle" size={18} color='#ebcc1c' /> ||

                                                    documento.estado == 3 &&
                                                    <FontAwesome name="check-circle" size={18} color='#20d447' />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }

                            <Text style={styles.textoInfo}>Por favor vuelva a cargar los documentos marcados con <FontAwesome name="times-circle" size={16} color='#e81a1a' /> o <FontAwesome name="exclamation-circle" size={16} color='#ebcc1c' />, asegurese que el documento que se solicita sea válido y que contenga la información visible y clara. </Text>
                            <Button
                                title='Siguiente'
                                buttonStyle={{backgroundColor: '#ff8834', marginVertical: 20 }}
                                titleStyle={{fontFamily: 'aller-lt'}}  
                                onPress={() => { this.enviarDatos() }}
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
    textoBold16:{
        fontFamily: 'aller-bd',
        fontSize: 16
    },
    textoRegular16:{
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
        marginTop: 15, 
        marginBottom: 10, 
        fontSize: 14, 
        textAlign: 'justify' 
    },
    viewTouchable: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    }
});