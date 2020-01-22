import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Alert, TouchableNativeFeedback } from 'react-native';
import { Button, Icon, Overlay } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';

export default class RegisterMaintenanceM extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Registro mantenimiento mecánico',
            headerTitleStyle: {
                flex: 1,
                textAlign: "center",
                fontFamily: 'aller-bd',
                fontWeight: '200',
                fontSize: 14,
            },
            headerRight: <View></View>,
        }
    }

    /**
     * Checar las variables ya que estas son las que insertaran datos ya que no se escriben bien
     */

    state = {
        registro: false,
        showDatePicker: false,
        fecha_servicio: 'Seleccionar',
        fecha_prog: 'Seleccionar',
        fecha_garantia: 'Seleccionar',
        opcion: undefined,
        descripcion: '',
        costo: '',
        kilometraje: '',
        mecanico: '',
        vehicle: this.props.navigation.getParam('vehicle', {})
    }

    async registroMecanico() {
        if (
            this.state.fecha_servicio == 'Seleccionar' ||
            this.state.fecha_prog == 'Seleccionar' ||
            this.state.fecha_servicio == 'Seleccionar' ||
            this.state.descripcion == '' ||
            this.state.costo == '' ||
            this.state.kilometraje == '' ||
            this.state.mecanico == ''
        ) {
            Alert.alert('Info', 'Llena todos los campos.');
        } else {
            try {
                const result = await fetch('http://35.203.42.33:3006/webservice/interfaz126/registrar_servicio_mecanico', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fecha_servicio: this.state.fecha_servicio.replace(/[/]/g, '-'),
                        fecha_prog: this.state.fecha_prog.replace(/[/]/g, '-'),
                        descripcion: this.state.descripcion,
                        costo: this.state.costo,
                        kilometraje: this.state.kilometraje,
                        mecanico: this.state.mecanico,
                        fecha_garantia: this.state.fecha_garantia.replace(/[/]/g, '-'),
                        estatus: 0,
                        id_unidad: this.state.vehicle.id,
                    })
                });

                const data = await result.json();

                if (data.msg) {
                    Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
                    console.error(data.msg);
                } else {
                    this.setState({ registro: true });
                }
            } catch (error) {
                Alert.alert('Error', 'Ha ocurrido un error.');
                console.error(error);

                this.props.navigation.goBack();
            }
        }
    }

    setDate(date) {
        if (this.state.opcion == 'servicio') {
            this.setState({
                fecha_servicio: date.toLocaleDateString(),
                showDatePicker: false
            })
        } else if (this.state.opcion == 'prog') {
            this.setState({
                fecha_prog: date.toLocaleDateString(),
                showDatePicker: false
            })
        } else {
            this.setState({
                fecha_garantia: date.toLocaleDateString(),
                showDatePicker: false
            })
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Overlay
                    overlayStyle={{ width: 300 }}
                    isVisible={this.state.registro}
                    windowBackgroundColor="rgba(0, 0, 0, .4)"
                    height="auto"
                >
                    <View>
                        <View style={{ justifyContent: 'center' }}>
                            <Icon
                                name='check-circle'
                                color='#20d447'
                                size={92}
                            />
                        </View>
                        <View>
                            <View>
                                <Text style={{ marginTop: 10, textAlign: 'center', fontWeight: '600', fontSize: 16 }}>Servicio registrado exitosamente!</Text>
                            </View>
                            <Button
                                title='Siguiente'
                                buttonStyle={{ marginVertical: 10, marginHorizontal: 13, backgroundColor: '#ff8834' }}
                                titleStyle={{ fontFamily: 'aller-lt' }}
                                onPress={() => { this.setState({ registro: false }); this.props.navigation.goBack() }}
                            />
                        </View>
                    </View>
                </Overlay>
                <View>
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
                    <View>
                        <Image
                            style={{ width: 150, height: 150, alignSelf: 'center' }}
                            resizeMode="cover"
                            source={{ uri: this.state.vehicle.imagen }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', height: 30 }}>
                        <Text style={[styles.textoBold, { marginTop: 4 }]}>{this.state.vehicle.nombre}</Text>
                        <View style={{ width: 16, height: 16, marginTop: 6, marginLeft: 5, marginRight: 5, backgroundColor: this.state.vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                        <Text style={[styles.textoNormal, { marginTop: 4 }]}>- {this.state.vehicle.placas}</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: 10 }}>

                    <View style={{ marginBottom: 15 }}>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Fecha servicio</Text>
                            <Button title={this.state.fecha_servicio}
                                titleStyle={{ fontFamily: 'aller-lt', paddingRight: 5, marginBottom: 1 }}
                                buttonStyle={{ backgroundColor: '#ff8834', height: 30 }}
                                icon={{
                                    type: 'material-community',
                                    name: "calendar",
                                    size: 16,
                                    color: "white"
                                }}
                                onPress={() => this.setState({ opcion: 'servicio', showDatePicker: true })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Fecha programada</Text>
                            <Button title={this.state.fecha_prog}
                                titleStyle={{ fontFamily: 'aller-lt', paddingRight: 5, marginBottom: 1 }}
                                buttonStyle={{ backgroundColor: '#ff8834', height: 30 }}
                                icon={{
                                    type: 'material-community',
                                    name: "calendar",
                                    size: 16,
                                    color: "white"
                                }}
                                onPress={() => this.setState({ opcion: 'prog', showDatePicker: true })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Descripción</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => this.setState({ descripcion: text })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Costo</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={text => this.setState({ costo: text })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Kilometraje</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={text => this.setState({ kilometraje: text })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Mecánico o taller</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => this.setState({ mecanico: text })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Fecha garantía</Text>
                            <Button title={this.state.fecha_garantia}
                                titleStyle={{ fontFamily: 'aller-lt', paddingRight: 5, marginBottom: 1 }}
                                buttonStyle={{ backgroundColor: '#ff8834', height: 30 }}
                                icon={{
                                    type: 'material-community',
                                    name: "calendar",
                                    size: 16,
                                    color: "white"
                                }}
                                onPress={() => this.setState({ opcion: 'garantia', showDatePicker: true })}
                            />
                        </View>

                        <Button
                            title='Registrar'
                            icon={{
                                name: "check-circle",
                                size: 16,
                                color: "white"
                            }}
                            titleStyle={{ fontFamily: 'aller-lt' }}
                            buttonStyle={{ backgroundColor: '#ff8834' }}
                            onPress={() => this.registroMecanico()}
                        />
                    </View>
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
                        mode={'date'}
                        onConfirm={date => this.setDate(date)}
                        onCancel={() => this.setState({ showDatePicker: false })}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 30,
        fontFamily: 'aller-lt',
        fontSize: 14,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 1,
        width: 165,
        alignSelf: 'stretch'
    },
    texto: { fontFamily: 'aller-bd', fontSize: 14, paddingRight: 10, alignSelf: 'baseline', marginTop: 5 },
    container: { flex: 1, padding: 20, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 25, backgroundColor: '#9fd5d1' },
    views: { height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    textoboton: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16,
        marginBottom: 5
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 16,
        marginBottom: 5
    },
});