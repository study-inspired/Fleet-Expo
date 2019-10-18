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
    TouchableOpacity
} from 'react-native';

import { Button, Card, Icon } from 'react-native-elements'

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
                            right:0
                        }}
                        iconContainerStyle={{
                            flex: 1,
                        }}
                        titleStyle={{
                            flex: 1,
                            fontFamily: 'aller-lt',
                            fontSize: 12,
                            bottom: 0
                        }}
                        title="Ayuda"
                    />
                </View>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={{ marginBottom: 15 }}>
                        <Card>
                            <TouchableOpacity
                                /*key={i}*/
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
                                onPress={() => { this.props.navigation.navigate('TraceRadius') }}
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
                                onPress={() => this.props.navigation.navigate('TracePoligon')}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16 
    }
});