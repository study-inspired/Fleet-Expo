/**
 * @format
 * @flow
**/

import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableNativeFeedback
} from 'react-native';

import { Card, Icon } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';

export default class Geofences extends React.Component {
    static navigationOptions = {
        title: 'Geocercas',
        headerTitleStyle: {
            fontFamily: 'aller-bd',
            fontWeight: '200',
            textAlign: "center",
            flex: 1,
        },
        headerRight: (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                onPress={() => alert('Ayuda')}
            >
                <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 15 }}>
                    <Ionicons
                        name={'ios-help-circle'}
                        size={32}
                        color='#ff8834'
                    />
                    {/* <Text style={{ fontFamily: 'aller-bd', fontSize: 12, color: '#ff8834' }}>Ayuda</Text> */}
                </View>
            </TouchableNativeFeedback>
        )
    }
    render() {
        return (
            <View style={{ marginBottom: 15 }}>
                <Icon
                    type='material-community'
                    name='map-marker'
                    size={58}
                    iconStyle={{alignSelf:'center', marginTop: 12}}
                />
                <Card>
                    <TouchableOpacity
                        /*key={i}*/
                        style={styles.touchableOpacity}
                        onPress={() => this.props.navigation.navigate('RegisterGeofence')}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                            <Icon type='material-community' name="circle-edit-outline" size={50} />
                        </View>
                        <View
                            style={styles.textoTouchable}>
                            <Text style={styles.textoBold}>Trazar nueva geocerca</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity
                        /*key={i}*/
                        style={styles.touchableOpacity}
                        onPress={() => this.props.navigation.navigate('RegisteredGeofences')}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                            <Icon type='material-community' name="target" size={50} />
                        </View>
                        <View
                            style={styles.textoTouchable}>
                            <Text style={styles.textoBold}>Geocercas registrdadas</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity
                        /*key={i}*/
                        style={styles.touchableOpacity}
                        onPress={() => this.props.navigation.navigate('GeofenceActions')}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                            <Icon type='font-awesome' name="list-ul" size={38} iconStyle={{ margin: 8 }} />
                        </View>
                        <View
                            style={styles.textoTouchable}>
                            <Text style={styles.textoBold}>Acciones en geocercas</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textoNormal: {
        fontFamily: 'aller-lt',
        fontSize: 16, 
        marginBottom: 5,
    },
    textoBold: {
        fontFamily: 'aller-bd',
        fontSize: 16, 
        marginBottom: 5,
    },
    touchableOpacity: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start'
    },
    textoTouchable: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})