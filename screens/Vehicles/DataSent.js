/**
 * @format
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';

import { Button, Icon } from 'react-native-elements'

export default class DataSent extends React.Component {
    static navigationOptions = {
        header: null
    }
    render() {
        return (

            <View style={{ flex: 1, flexDirection:'column',marginHorizontal: 25 }}>
                <View style={{ justifyContent: 'center', marginBottom: 20, marginTop:30 }}>
                    <Icon
                        name='check-circle'
                        color='#20d447'
                        size={228}
                    />
                </View>
                <View style={{ marginHorizontal: 35}}>
                    <Text style={styles.textoNormal}>Los datos y documentos han sido enviados para su validación, se te notificará el resultado en un máximo de XX horas.</Text>
                    <View style={{marginVertical:15}}>
                    <Text style={{  fontFamily: 'aller-lt', textAlign: 'center' }}>3121234567</Text>
                    <Text style={{ fontFamily: 'aller-lt', textAlign: 'center'}}>Soporte@MiGo.com</Text>
                    </View>
                </View>
                <Button
                    title='OK'
                    buttonStyle={{ bottom: 0, marginVertical:15, backgroundColor: '#ff8834' }}
                    titleStyle={{fontFamily: 'aller-lt'}}
                    onPress={() => { this.props.navigation.pop(2) }}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    textoNormal: {
        textAlign: 'justify',
        fontFamily: 'aller-lt',
        fontSize: 16,
        marginVertical: 5
    }
});