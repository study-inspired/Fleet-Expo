/**
 * @format
 * @flow
**/

import React from 'react';

import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    Alert,
    TouchableNativeFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class RealTimeReport extends React.Component {
    static navigationOptions = {
        title: 'Reporte en tiempo real',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>,
    }

    state = {
        isLoading: true,
        hasInfo: false,
        tableHead: ['TOTAL', 'Efectivo', 'Tarjeta', 'Comisión', 'Ganancia'],
        tableData: [],
        driver: this.props.navigation.getParam('driver', {}),
    }

    /**
     * Convierte un valor numerico a una cadena que representa valores monetarios con 2 decimales.
     * 12 => 12.00
     * 1234567 => 1,234,567.00
     * 1234567.89 => 1,234,567.89
     * @param {number} number 
     */
    _formatCurrency(number) {
        return (+number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View elevation={2} style={styles.subHeader}>
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

                <View
                    style={styles.imageContainer}>
                    {false && <Image
                        style={styles.image}
                        resizeMode="cover"
                        source={{ uri: this.state.driver.fotografia }}
                    />}
                    <Ionicons
                        name={'md-contact'}
                        size={76}
                    />
                    <Text style={styles.textoBold}>{this.state.driver.nombre}</Text>
                </View>
                <View style={styles.viewContainer}>
                    <View style={styles.viewTitle}>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>TOTAL</Text>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Efectivo</Text>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Tarjeta</Text>
                    </View>
                    <View style={styles.viewContent}>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this._formatCurrency(this.state.driver.ganancias.out_total)} MXN`}</Text>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this._formatCurrency(this.state.driver.ganancias.out_efectivo)} MXN`}</Text>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this._formatCurrency(this.state.driver.ganancias.out_tarjeta)} MXN`}</Text>
                    </View>
                </View>
                <View style={styles.viewContainer}>
                    <View style={styles.viewTitle}>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Comisión</Text>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>Ganancia final</Text>
                    </View>
                    <View style={styles.viewContent}>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this._formatCurrency(this.state.driver.ganancias.out_comision)} MXN`}</Text>
                        <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`$${this._formatCurrency(this.state.driver.ganancias.out_ganancia_final)} MXN`}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, fontSize: 12 },
    subHeader: {
        height: 65,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 14,
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16,
    },
    scrollView: {
        backgroundColor: '#fafafa'
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15
    },
    imageContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 15
    },
    cardText: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        borderRadius: 38,
        width: 76,
        height: 76,
    },
    viewTitle: {
        height: 30,
        backgroundColor: '#cacaca',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewContent: {
        height: 35,
        backgroundColor: '#eaeaea',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewContainer: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 2,
        marginHorizontal: 10,
        marginVertical: 5
    }
});