/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';

import { Card, Icon } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';

export default class RegisterGeofence extends React.Component {

    static navigationOptions = {
        title: 'Registrar geocerca',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-bd',
            fontWeight: '200',
            fontSize: 18,
        },
        headerRight: <View></View>
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.subHeader}>
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
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={{ marginBottom: 15 }}>
                        <Card>
                            <TouchableOpacity
                                /*key={i}*/
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
                                onPress={() => this.props.navigation.navigate('TraceGeofence', { id_tipo_geocerca: 0 }) }
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                    }}>
                                    <Icon type='material-community' name='circle-edit-outline' size={50} />
                                </View>
                                <View
                                    style={{
                                        flex: 4,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{ fontFamily: 'aller-bd', fontSize: 16, marginBottom: 5 }}>Trazar en modo radio</Text>
                                </View>
                            </TouchableOpacity>
                        </Card>
                        <Card>
                            <TouchableOpacity
                                /*key={i}*/
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
                                onPress={() => this.props.navigation.navigate('TraceGeofence', { id_tipo_geocerca: 1 })}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                    }}>
                                    <Icon type='material-community' name='square-edit-outline' size={50} />
                                </View>
                                <View
                                    style={{
                                        flex: 4,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{ fontFamily: 'aller-bd', fontSize: 16, marginBottom: 5 }}>Trazar en modo polígono</Text>
                                </View>
                            </TouchableOpacity>
                        </Card>

                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fafafa',
    },
    body: {
        backgroundColor: '#fff',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 76,
    },
    subHeader: { 
        height: 70, 
    }
});