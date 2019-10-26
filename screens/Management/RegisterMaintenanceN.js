import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Alert, Picker } from 'react-native';
import { Button, Icon, Overlay } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class RegisterMaintenance extends Component {
    static navigationOptions = {
        title: 'Registro mantenimiento neumático',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 14,
        },
        headerRight: <View></View>,
    }

    state = {
        registro: false,
        showDatePicker: false,
        fecha: 'Seleccionar',
        costo: '',
        motivo: 1,
        llanterataller: '',
        noneumatico: '',
        posicion: '',
        vehicle: this.props.navigation.getParam('vehicle', {})
    }

    async registrarServicio() {
        if (
            this.state.fecha == 'Seleccionar' ||
            this.state.costo == '' ||
            this.state.noneumatico == '' ||
            this.state.motivo == '' ||
            this.state.posicion == '' ||
            this.state.llanterataller == ''
        ) {
            Alert.alert('Info', 'Llena todos los campos.')
        }
        else {
            try {
                const result = await fetch('http://34.95.33.177:3006/webservice/interfaz129/registrar_servicio_neumatico', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fecha_servicio: this.state.fecha.replace(/[/]/g, '-'),
                        costo: this.state.costo,
                        num_neumaticos: this.state.noneumatico,
                        motivo: this.state.motivo,
                        posicion: this.state.posicion,
                        id_unidad: this.state.vehicle.id,
                        llantera : this.state.llanterataller                                        
                    })
                });
                
                const data = await result.json();
                
                if (data.msg) {
                    Alert.alert('Error', data.msg);
                } else {
                    console.log(data);
                    this.setState({ registro: true });
                }

            } catch (error) {
                Alert.alert('Error', 'Ha ocurrido un error.')
                this.props.navigation.goBack();
            }
        }

    }

    setDate(date) {
        if (this.state.opcion == 'servicio') {
            this.setState({
                fecha: date.toLocaleDateString(),
                showDatePicker: false
            })
        } /*else if (this.state.opcion == 'prog') {
            this.setState({
                fecha_prog: date.toLocaleDateString(),
                showDatePicker: false
            })
        } else {
            this.setState({
                fecha_garantia: date.toLocaleDateString(),
                showDatePicker: false
            })
        }*/
    }

    render() {
        const { vehicle } = this.state;

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
                            right: 0,
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            flex: 1,
                            fontFamily: 'aller-bd',
                            fontSize: 12,
                            bottom: 0,
                        }}
                        title="Ayuda"
                    />
                    <View>
                        <Image
                            style={{ width: 150, height: 150, alignSelf: 'center' }}
                            resizeMode="cover"
                            source={{ uri: vehicle.imagen }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', height: 30 }}>
                        <Text style={[styles.textoBold, { marginTop: 4 }]}>{vehicle.nombre}</Text>
                        <View style={{ width: 16, height: 16, marginTop: 6, marginLeft: 5, marginRight: 5, backgroundColor: vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                        <Text style={[styles.textoNormal, { marginTop: 4 }]}>- {vehicle.placas}</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: 10 }}>

                    <View style={{ marginBottom: 15 }}>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Fecha</Text>
                            <Button title={this.state.fecha}
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
                            <Text style={styles.texto}>Costo</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='decimal-pad'
                                onChangeText={text => this.setState({ costo: text })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Motivo</Text>
                            <Picker 
                                selectedValue={this.state.motivo}
                                style={styles.input} 
                                onValueChange={
                                (itemValue) => {
                                    this.setState({
                                        motivo: itemValue
                                    })
                                }
                            }>
                                <Picker.Item label="Pochadura" value={1} />
                                <Picker.Item label="Desgaste" value={2} />
                            </Picker>
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Llantera o taller</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => this.setState({ llanterataller: text })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}># de neumaticos</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                onChangeText={text => this.setState({ noneumatico: text })}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Posición</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => this.setState({ posicion: text })}
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
                            onPress={() => this.registrarServicio()}
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
    input: { height: 30, fontFamily: 'aller-lt', fontSize: 14, borderColor: 'gray', borderWidth: 1, padding: 1, width: 165, alignSelf: 'stretch' },
    texto: { fontFamily: 'aller-bd', fontSize: 14, paddingRight: 10, alignSelf: 'baseline', marginTop: 5 },
    container: { flex: 1, padding: 20, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 25, backgroundColor: '#9fd5d1' },
    views: { height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    touchable: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
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

