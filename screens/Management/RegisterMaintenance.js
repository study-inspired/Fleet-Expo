import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput } from 'react-native';
import { Button, Icon, Overlay } from 'react-native-elements';

export default class RegisterMaintenance extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Registro mantenimiento ' + navigation.getParam('tipo', ''),
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
    }

    render() {
        const vehicle = this.props.navigation.getParam('vehicle', {})
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
                                titleStyle={{fontFamily: 'aller-lt'}}
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
                        <Text style={[styles.textoBold, { marginTop: 4}]}>{vehicle.nombre}</Text>
                        <View style={{ width: 16, height: 16, marginTop: 6, marginLeft: 5, marginRight: 5, backgroundColor: vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
                        <Text style={[styles.textoNormal, { marginTop: 4}]}>- {vehicle.placas}</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: 10 }}>

                    <View style={{ marginBottom: 15 }}>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Fecha</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Descripción</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Costo</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Kilometraje</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.views}>
                            <Text style={styles.texto}>Mecánico o taller</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>

                        <Button
                            title='Registrar'
                            icon={{
                                name: "check-circle",
                                size: 16,
                                color: "white"
                            }}
                            titleStyle={{fontFamily: 'aller-lt'}}
                            buttonStyle={{ backgroundColor: '#ff8834' }}
                            onPress={() => this.setState({ registro: true })}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    input: { height: 26, fontFamily: 'aller-lt', fontSize: 14, borderColor: 'gray', borderWidth: 1, padding: 1, width: 165, alignSelf: 'stretch', fontSize: 10 },
    texto: { fontFamily: 'aller-bd', fontSize: 14, paddingRight: 10, alignSelf: 'baseline', marginTop:3 },
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

export { RegisterMaintenance } 