/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';

import { Button } from 'react-native-elements'

export default class AttachedPicture extends React.Component {
    static navigationOptions = {
        title: 'Seleccionar una foto',
        headerTitleStyle: {
            flex: 1,
            textAlign: "center",
            fontFamily: 'aller-lt',
            fontWeight: '200'
        },
        headerRight: <View></View>
    }

    render() {
        const image = this.props.navigation.getParam('image', { uri: '' });
        console.log(image)
        return (

            <View style={{ marginHorizontal: 25, marginVertical: 25 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <Image
                        resizeMode='stretch'
                        source={image}
                        style={{
                            flex: 1,
                            width: 400,
                            height: 400
                        }}
                    />
                </View>

                <Button
                    title='Entregar'
                    buttonStyle={{ bottom: 30, backgroundColor: '#ff8834' }}
                    titleStyle={{fontFamily: 'aller-lt'}}
                    onPress={() => { this.props.navigation.navigate('AddVehicle') }}
                />
            </View>
        )
    }
}